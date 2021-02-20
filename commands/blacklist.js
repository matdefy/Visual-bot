const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        if (message.guild.id === '764869621982691329') {
            let prefix = '!vb'
            if (message.channel.type !== 'dm') {
                if (db.has('prefix_' + message.guild.id)) {
                    prefix = db.get('prefix_' + message.guild.id)
                }
            }
            const userID = args[0]
            const descriptSi = message.content.trim().slice(`${prefix}blacklist ${userID} `.length)
            if (userID > 1000) {
                if (descriptSi.length > 1) {
                    let usersblacklist = db.get('blacklist')
                    if (usersblacklist.includes(message.author.id)) {
                        client.users.cache.get(userID).send('✅ **Bonjour, suite à votre débannissement de Visual Bot l\'utilisation de celui-ci vous est maintenant autorisé !**')
                        usersblacklist = usersblacklist.filter((element) => element !== userID)
                        db.set('blacklist', usersblacklist)
                        message.channel.send('✅ **Utilisateur à l\'identifiant `' + userID + '` débanni !**')
                        message.client.channels.cache.get('797853971162595339').send('Utilisateur à l\'identifiant `' + userID + '` débanni par ' + message.author.tag + ' (`' + message.author.id + '`) ')
                    } else {
                        client.users.cache.get(userID).send(new Discord.MessageEmbed()
                            .setDescription('🛑 **Bonjour, suite à votre bannissement de Visual Bot l\'utilisation de celui-ci vous est maintenant bloqué !**\n\nRaison : ' + descriptSi)
                            .setColor('#FF0000')
                            .setFooter(config.version, client.user.avatarURL()))
                        db.push('blacklist', userID)
                        message.channel.send('✅ **Utilisateur à l\'identifiant `' + userID + '` banni !**')
                        message.client.channels.cache.get('797853971162595339').send('Utilisateur à l\'identifiant `' + userID + '` banni par ' + message.author.tag + ' (`' + message.author.id + '`) ')
                    }
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ **Veuillez rentrer une description de votre bannissement !**\n\n`' + prefix + 'blacklist ' + userID + ' [description de votre bannissement]`**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send('🛑 **Vous n\'avez pas les permissions suffisantes !**')
            }
        }
    }
}
