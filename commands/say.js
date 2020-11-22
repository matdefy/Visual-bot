const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        if (message.author.id === '364481003479105537') {
            const userID = args[0]
            const descriptCMD = message.content.trim().slice(`${config.prefix}cmd ${userID} `.length)
            if (args[0]) {
                message.delete()
                client.users.cache.get(userID).send(new Discord.MessageEmbed()
                    .setDescription(descriptCMD)
                    .setColor('#00FF00')
                    .setFooter(config.version, client.user.avatarURL()))
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Veuiller entrer du texte ⚠️')
                    .setColor('#00FF00')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 Vous n\'avez pas les permissions suffisantes ! 🛑')
                .setColor('#00FF00')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
