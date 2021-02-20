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
        if (message.member.hasPermission('KICK_MEMBERS') && message.guild.id === '775274490723827712') {
            if (args[1]) {
                if (db.has('crea_' + args[1])) {
                    const user = args[1]
                    const creations = db.get('crea_' + user)
                    const idcrea = args[0]
                    // Récupérer et modifier une creation
                    creations.find((creation) => creation.id === parseInt(idcrea)).verif = '✅'
                    // Écrire les modifications dans la base de données
                    db.set('crea_' + user, creations)
                    message.channel.send('✅ **Création ' + idcrea + ' vérifiée !**')
                    message.client.channels.cache.get('775411371189862410').send('création vérifiée pour l\'utilisateur (`' + user + '`) Par ' + message.author.tag + ' (`' + message.author.id + '`) ')
                } else {
                    message.channel.send('⚠️ **Ce membre n\'est pas enregistré dans la base de données !**')
                }
            } else {
                message.channel.send('⚠️ **Veuillez mentionner 1 membre !**')
            }
        } else {
            message.channel.send('🛑 **Vous n\'avez pas les permissions suffisantes !**')
        }
    }
}
