const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        const user = message.mentions.users.first()
        if (message.member.hasPermission('KICK_MEMBERS') && message.guild.id === '775274490723827712') {
            if (message.mentions.users.size === 1) {
                if (args[1] < 6) {
                    const numlevel = args[1]
                    db.set('level_' + user.id, parseInt(numlevel))
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('✅ **Level ' + parseInt(numlevel) + ' attribué à l\'utilisateur ' + user.tag + '**')
                        .setColor('#00FF00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                    message.client.channels.cache.get('775413874920128542').send('Level ' + parseInt(numlevel) + ' attribué à l\'utilisateur ' + user.tag + ' (`' + user.id + '`) Par ' + message.author.tag + ' (`' + message.author.id + '`) ')
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ **Veuillez rentrer un level entre `1` et `5`**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ **Veuillez mentionner 1 membre**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 **Vous n\'avez pas les permissions suffisantes**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
