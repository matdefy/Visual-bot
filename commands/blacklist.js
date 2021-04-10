const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        if (message.guild.id === '764869621982691329') {
            let prefix = config.prefix
            if (message.channel.type !== 'dm') {
                if (db.has('prefix_' + message.guild.id)) {
                    prefix = db.get('prefix_' + message.guild.id)
                }
            }
            const userID = args[0]
            const descriptSi = message.content.trim().slice(`${prefix}blacklist ${userID} `.length)
            const user = client.users.cache.find((element) => element.id === userID)
            if (userID) {
                if (user) {
                    if (descriptSi.length > 1) {
                        let usersblacklist = db.get('blacklist')
                        if (usersblacklist.includes(userID)) {
                            client.users.cache.get(userID).send(new Discord.MessageEmbed()
                                .setDescription(`✅ **Bonjour, suite à votre débannissement de Visual Bot l\'utilisation de celui-ci vous est maintenant autorisé !\n\n-Raison : **${descriptSi}`)
                                .setColor('FF7B00')
                                .setFooter(config.version, client.user.avatarURL()))
                            usersblacklist = usersblacklist.filter((element) => element !== userID)
                            db.set('blacklist', usersblacklist)
                            message.channel.send(new Discord.MessageEmbed()
                                .setDescription(`✅ **Utilisateur <@${userID}> débanni par <@${message.author.id}> !\n\n-Raison : **${descriptSi}`)
                                .setColor('FF7B00')
                                .setFooter(config.version, client.user.avatarURL()))
                            message.client.channels.cache.get('829764875626348614').send(`✅ **Utilisateur <@${userID}> débanni par <@${message.author.id}>\n\n-Raison : **${descriptSi}`)
                        } else {
                            client.users.cache.get(userID).send(new Discord.MessageEmbed()
                                .setDescription(`☢️ **Bonjour, suite à votre bannissement de Visual Bot l\'utilisation de celui-ci vous est maintenant bloqué !\n\n-Raison : **${descriptSi}`)
                                .setColor('#FF0000')
                                .setFooter(config.version, client.user.avatarURL()))
                            db.push('blacklist', userID)
                            message.channel.send(new Discord.MessageEmbed()
                                .setDescription(`☢️ **Utilisateur <@${userID}> banni par <@${message.author.id}> !\n\n-Raison : **${descriptSi}`)
                                .setColor('FF7B00')
                                .setFooter(config.version, client.user.avatarURL()))
                            message.client.channels.cache.get('829764875626348614').send(`☢️ **Utilisateur <@${userID}> banni par <@${message.author.id}>\n\n-Raison : **${descriptSi}`)
                        }
                    } else {
                        message.channel.send('⚠️ **Veuillez rentrer une description de votre dé/bannissement !**')
                    }
                } else {
                    message.channel.send(`⚠️ **Utilisateur <@${userID}> inconnu/e !**`)
                }
            } else {
                message.channel.send('⚠️ **Veuillez rentrer l\'identifiant d\'un utilisateur !**')
            }
        } else {
            message.channel.send('⛔ **Vous n\'avez pas les permissions suffisantes !**')
        }
    }
}
