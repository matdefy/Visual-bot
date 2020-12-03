const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
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
                        .setDescription('🛠️ La création numéro `' + creaID + '` a été mise en avancé ! 🛠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                        .setColor('#00FF00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
                if (advanceIDOk2) {
                    if (message.attachments.size === 1) {
                        const creations = db.get('crea_' + message.author.id)
                        creations.find((creation) => creation.id === creaID).url = message.attachments.first().url
                        db.set('crea_' + message.author.id, creations)
                        creations.find((creation) => creation.id === creaID).advance = '✅'
                        db.set('crea_' + message.author.id, creations)
                        creations.find((creation) => creation.id === creaID).verif = '❌'
                        db.set('crea_' + message.author.id, creations)
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('✅ La création numéro `' + creaID + '` est maintenant terminé ! ✅\nTapez `!gbviewcrea` pour voir votre nouvelle création finie !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                            .setColor('#00FF00')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    } else {
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('🛑 Veuillez entrer votre création terminée ! 🛑\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                            .setColor('#FF0000')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    }
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Création introuvable ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ Aucune création enregistrée dans la base de données ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
