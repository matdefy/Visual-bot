const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        let prefix = '!vb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        if (message.mentions.users.size === 0) {
            if (!message.channel.type === 'dm') {
                if (message.guild.id === '775274490723827712') {
                    if (db.get('crea_' + args[0])) {
                        const user = args[0]
                        db.delete('pr_' + user)
                        db.delete('crea_' + user)
                        return message.channel.send('✅ **(`' + user + '`) n\'est plus enregistré dans la base de données !**')
                    } else {
                        const user = args[0]
                        return message.channel.send('⚠️ **Utilisateur avec l\'identifiant (`' + user + '`) introuvable !**')
                    }
                }
            }
            if (db.has('pr_' + message.author.id) || db.has('crea_' + message.author.id)) {
                db.delete('pr_' + message.author.id)
                db.delete('crea_' + message.author.id)
                message.channel.send('✅ **Vous n\'êtes plus enregistré dans la base de données !**')
            } else {
                message.channel.send('⚠️ **Vous n\'êtes pas enregistré dans la base de données !**')
            }
        } else {
            message.channel.send('🛑 **Vous n\'avez pas les permissions suffisantes !**')
        }
    }
}
