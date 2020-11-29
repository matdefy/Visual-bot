const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        let creationId = 1
        if (db.has('crea_' + message.author.id)) {
            creationId = db.get('crea_' + message.author.id).length + 1
        }
        if (message.attachments.size === 1) {
            db.push('crea_' + message.author.id, {
                id: creationId,
                url: message.attachments.first().url,
                verif: '❌'
            })
            dbLogs.add('creation', 1)
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('✅ Création enregistrée au num\éro : `' + creationId + '` ✅\nTapez `!gbaddpreuve ' + creationId + ' [le fichier de votre preuve]` pour ajouter une preuve à la création !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#00FF00')
                .setFooter(config.version, message.client.user.avatarURL()))
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 Veuillez entrer 1 création 🛑\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
