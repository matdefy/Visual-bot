const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        if (message.member.id === '364481003479105537') {
            if (args[0]) {
                message.delete()
                message.channel.send(message.content.trim().slice(`${config.prefix}say`.length))
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Veuiller entrer du texte ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 Vous n\'avez pas les permissions suffisantes ! 🛑\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
