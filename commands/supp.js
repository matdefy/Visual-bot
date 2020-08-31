const Discord = require('discord.js')
const config = require('C:/Users/matte/montage_video/bot/Graph-bot/config.json')

module.exports = {
    run: (db, message, args) => {
        const user = message.mentions.users.first()
        if (message.member.hasPermission('KICK_MEMBERS') && message.mentions.users.size === 1) {
            db.delete('pr_' + user.id)
            db.delete(user.id)
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('✅ ' + user.id + ' n\'est plus enregistré dans la basse de donnée ! ✅')
                .setColor('#00FF00')
                .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
        } else {
            if (db.has('pr_' + message.member.id) || db.has(message.member.id)) {
                db.delete('pr_' + message.member.id)
                db.delete(message.member.id)
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('✅ Vous n\'êtes plus enregistré dans la basse de donnée ! ✅')
                    .setColor('#00FF00')
                    .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Vous n\'êtes pas enregistré dans la base de donnée ! ⚠️')
                    .setColor('#FF0000')
                    .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
            }
        }
    }
}
