const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        if (message.mentions.users.size === 0) {
            if (message.channel.type === 'dm') {
                if (db.has('pr_' + message.author.id) || db.has(message.author.id)) {
                    db.delete('pr_' + message.author.id)
                    db.delete(message.author.id)
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('✅ Vous n\'êtes plus enregistré dans la base de données ! ✅\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                        .setColor('#00FF00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ Vous n\'êtes pas enregistré dans la base de données ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                if (message.guild.id === '775274490723827712') {
                    if (db.get(args[0])) {
                        const user = args[0]
                        db.delete('pr_' + user)
                        db.delete(user)
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('✅ (`' + user + '`) n\'est plus enregistré dans la base de données ! ✅\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                            .setColor('#00FF00')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    } else {
                        const user = args[0]
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('⚠️ Utilisateur avec l\'identifiant (`' + user + '`) introuvable ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                            .setColor('#e55f2a')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    }
                } else {
                    if (db.has('pr_' + message.author.id) || db.has(message.author.id)) {
                        db.delete('pr_' + message.author.id)
                        db.delete(message.author.id)
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('✅ Vous n\'êtes plus enregistré dans la base de données ! ✅\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                            .setColor('#00FF00')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    } else {
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('⚠️ Vous n\'êtes pas enregistré dans la base de données ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                            .setColor('#e55f2a')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    }
                }
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 Vous n\'avez pas les permissions suffisantes ! 🛑\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
