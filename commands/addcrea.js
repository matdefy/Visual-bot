const Discord = require('discord.js')
const config = require('../config.json')
const Jimp = require('jimp')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        let creationId = 1
        if (db.has('crea_' + message.author.id)) {
            creationId = db.get('crea_' + message.author.id).length + 1
        }
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
                        db.push('crea_' + message.author.id, {
                            id: creationId,
                            url: imageAvecFiligrane,
                            verif: '❌',
                            advance: '✅'
                        })
                    })
                    dbLogs.add('creation', 1)
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('✅ Création enregistrée au num\éro : `' + creationId + '` ✅\nTapez `!gbaddpreuve ' + creationId + ' [le fichier de votre preuve]` pour ajouter une preuve à la création !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                        .setColor('#00FF00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                })
            })
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 Veuillez entrer 1 création 🛑\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
