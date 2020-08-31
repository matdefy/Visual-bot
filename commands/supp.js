const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        const user = message.mentions.users.first()
        if (message.member.hasPermission('KICK_MEMBERS') && message.mentions.users.size === 1) {
            db.delete('pr_' + user.id)
            db.delete(user.id)
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('✅ ' + user.id + ' n\'est plus enregistré dans la base de données ! ✅')
                .setColor('#00FF00')
                .setFooter(config.version, message.client.user.avatarURL()))
        } else {
            if (db.has('pr_' + message.member.id) || db.has(message.member.id)) {
                db.delete('pr_' + message.member.id)
                db.delete(message.member.id)
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('✅ Vous n\'êtes plus enregistré dans la base de données ! ✅')
                    .setColor('#00FF00')
                    .setFooter(config.version, message.client.user.avatarURL()))
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Vous n\'êtes pas enregistré dans la bse de données ! ⚠️')
                    .setColor('#FF0000')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        }
    }
}
