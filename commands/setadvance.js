const Discord = require('discord.js')
const config = require('../config.json')
const Jimp = require('jimp')

module.exports = {
    run: (db, message, args, client) => {
        let prefix = '!gb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        const creaID = parseInt(args[0])
        if (db.has('crea_' + message.author.id)) {
            const creaIDOk = db.get('crea_' + message.author.id).some((creation) => creation.id === creaID)
            if (creaIDOk) {
                const advanceIDOk = db.get('crea_' + message.author.id).some((creation) => creation.advance === '✅')
                const advanceIDOk2 = db.get('crea_' + message.author.id).some((creation) => creation.advance === '🛠️')
                if (advanceIDOk) {
                    const creations = db.get('crea_' + message.author.id)
                    creations.find((creation) => creation.id === creaID).advance = '🛠️'
                    db.set('crea_' + message.author.id, creations)
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('🛠️ **La création numéro ' + creaID + ' a été mise en avancé**\n\n`' + prefix + 'setadvance `' + creaID + '` [création finalisé]` : permet de remplacer votre création non terminée par celle finalisé ! L’emoji 🛠️ sera remplacer par ✅ quand votre création sera affiché !\n\n(le numéro d’une création s’obtient en tapant `' + prefix + 'viewcrea`)\n\n(votre création doit être envoyer dans le même message que la commande, mais en pièce jointe (le + situé à gauche de la zone d’écriture))\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                        .setColor('#00FF00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
                if (advanceIDOk2) {
                    if (message.attachments.size === 1) {
                        const ORIGINAL_IMAGE = message.attachments.first().url

                        const LOGO = 'https://cdn.discordapp.com/attachments/791336914379997205/792694216262156298/graph_bot_5_filigrane.png'

                        const FILENAME = message.attachments.first().url
                        const urlFichier = FILENAME.split('.')
                        urlFichier.pop()

                        const main = async () => {
                            const [image, logo] = await Promise.all([
                                Jimp.read(ORIGINAL_IMAGE),
                                Jimp.read(LOGO)
                            ])

                            logo.resize(image.bitmap.width / 1, image.bitmap.height / 1)

                            return image.composite(logo, 0, 0, [
                                {
                                    mode: Jimp.BLEND_SCREEN,
                                    opacitySource: 0.1,
                                    opacityDest: 1
                                }
                            ])
                        }
                        main().then(image => {
                            image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                                if (err) return
                                client.channels.cache.get('791338433306034182').send({ files: [buffer] }).then(img => {
                                    const imageAvecFiligrane = img.attachments.first().url
                                    const creations = db.get('crea_' + message.author.id)
                                    creations.find((creation) => creation.id === creaID).url = imageAvecFiligrane
                                    db.set('crea_' + message.author.id, creations)
                                    creations.find((creation) => creation.id === creaID).advance = '✅'
                                    db.set('crea_' + message.author.id, creations)
                                    creations.find((creation) => creation.id === creaID).verif = '❌'
                                    db.set('crea_' + message.author.id, creations)
                                    message.channel.send(new Discord.MessageEmbed()
                                        .setDescription('✅ **La création numéro `' + creaID + '` est maintenant terminé**\n\nTapez `' + prefix + 'viewcrea` pour voir votre nouvelle création finie !\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                                        .setColor('#00FF00')
                                        .setFooter(config.version, message.client.user.avatarURL()))
                                })
                            })
                        })
                    } else {
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('🛑 **Veuillez entrer votre création terminée**\n\n(votre création doit être envoyer dans le même message que la commande, mais en pièce jointe (le + situé à gauche de la zone d’écriture))\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                            .setColor('#FF0000')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    }
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ **Création introuvable**\n\n(le numéro d’une création s’obtient en tapant `' + prefix + 'viewcrea`)\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ **Aucune création enregistrée dans la base de données**\n\n`' + prefix + 'addcrea [votre création]` : permet d\'enregistrer une création dans la base de données !\n\n(votre création doit être envoyer dans le même message que la commande, mais en pièce jointe (le + situé à gauche de la zone d’écriture))\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
