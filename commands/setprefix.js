const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        let prefix2 = config.prefix
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix2 = db.get('prefix_' + message.guild.id)
            }
        }
        if (message.member.hasPermission('MANAGE_GUILD')) {
            const prefix = args[0]
            if (args[0]) {
                if (prefix.length < 6) {
                    db.set('prefix_' + message.guild.id, prefix)
                    message.channel.send('✅ **Le prefix pour le serveur ' + message.guild.name + ' et maintenant **`' + prefix + '`** !**')
                } else {
                    message.channel.send('⚠️ **Le prefix doit faire au maximum 5 caractères !**')
                }
            } else {
                message.channel.send('⚠️ **Veuillez entrer un prefix !**')
            }
        } else {
            message.channel.send('⛔ **Vous n\'avez pas les permissions suffisantes !**')
        }
    }
}
