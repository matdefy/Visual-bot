const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        if (message.author.id === '364481003479105537') {
            const descriptCMD = message.content.trim().slice(`${config.prefix}say `.length)
            if (args[0]) {
                message.delete()
                message.channel.send(descriptCMD)
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ **Veuiller entrer du texte**')
                    .setColor('#00FF00')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 **Vous n\'avez pas les permissions suffisantes**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                .setColor('#00FF00')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
