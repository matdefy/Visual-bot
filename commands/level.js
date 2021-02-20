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
                    message.channel.send('✅ **Level ' + parseInt(numlevel) + ' attribué à l\'utilisateur ' + user.tag + ' !**')
                    message.client.channels.cache.get('775413874920128542').send('Level ' + parseInt(numlevel) + ' attribué à l\'utilisateur ' + user.tag + ' (`' + user.id + '`) Par ' + message.author.tag + ' (`' + message.author.id + '`) ')
                } else {
                    message.channel.send('⚠️ **Veuillez rentrer un level entre `1` et `5` !**')
                }
            } else {
                message.channel.send('⚠️ **Veuillez mentionner 1 membre !**')
            }
        } else {
            message.channel.send('🛑 **Vous n\'avez pas les permissions suffisantes !**')
        }
    }
}
