const Discord = require('discord.js')
const config = require('../config.json')
const Jimp = require('jimp')

module.exports = {
    run: (db, message, args, client) => {
        if (db.has('crea_' + message.author.id)) {
            const creations = db.get('crea_' + message.author.id)
            const creationIdverif = db.get('crea_' + message.author.id).some((creation) => creation.id === parseInt(args[0]))
            if (creationIdverif) {
                const idcrea = args[0]
                const urlcrea = creations.find((creation) => creation.id === parseInt(idcrea)).url
                const ORIGINAL_IMAGE = urlcrea

                const LOGO = 'https://cdn.discordapp.com/attachments/791336914379997205/792694216262156298/graph_bot_5_filigrane.png'

                const FILENAME = urlcrea
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
                            creations.find((creation) => creation.id === parseInt(idcrea)).url = imageAvecFiligrane
                        })
                        message.channel.send(new Discord.MessageEmbed()
                            .setTitle('✅ Filigrane appliqué sur la création numéro ' + idcrea + ' ! ✅')
                            .setColor('#00FF00')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    })
                })
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Veuillez entrer le numéro d\'une création valide ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ Vous n\'êtes pas enregistré dans la base de données ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
