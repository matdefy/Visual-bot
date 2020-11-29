const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            const prefix = args[0]
            if (args[0]) {
                if (prefix.length < 6) {
                    db.set('prefix_' + message.guild.id, prefix)
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('✅ Le préfix pour le serveur : ' + message.guild.name + ' et maintenant : `' + prefix + '` ! ✅\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                        .setColor('#00FF00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ Le préfix doit faire au maximum 5 caractères ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Le préfix doit faire au maximum 5 caractères ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
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
