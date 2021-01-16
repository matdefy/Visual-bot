const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        const prefix = '!gb'
        if (message.guild.id === '775274490723827712') {
            const userID = args[0]
            if (userID) {
                const usersreaction = dbLogs.get('reaction')
                if (usersreaction.find((user) => user.user === message.author.id)) {
                    let usersblacklist = db.get('blacklist')
                    if (usersblacklist.includes(message.author.id)) {
                        client.users.cache.get(userID).send(new Discord.MessageEmbed()
                            .setDescription('✅ **Bonjour, suite à votre débannissement de Graph Bot l\'utilisation de celui-ci vous est maintenant autorisé**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                            .setColor('#FF0000')
                            .setFooter(config.version, client.user.avatarURL()))
                        usersblacklist = usersblacklist.filter((element) => element !== userID)
                        db.set('blacklist', usersblacklist)
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('✅ **Utilisateur à l\'identifiant `' + userID + '` débanni**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                            .setColor('#00FF00')
                            .setFooter(config.version, message.client.user.avatarURL()))
                        message.client.channels.cache.get('797853971162595339').send('Utilisateur à l\'identifiant `' + userID + '` débanni par ' + message.author.tag + ' (`' + message.author.id + '`) ')
                    } else {
                        client.users.cache.get(userID).send(new Discord.MessageEmbed()
                            .setDescription('🛑 **Bonjour, suite à votre bannissement de Graph Bot l\'utilisation de celui-ci vous est maintenant bloqué**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                            .setColor('#FF0000')
                            .setFooter(config.version, client.user.avatarURL()))
                        db.push('blacklist', userID)
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('✅ **Utilisateur à l\'identifiant `' + userID + '` banni**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                            .setColor('#00FF00')
                            .setFooter(config.version, message.client.user.avatarURL()))
                        message.client.channels.cache.get('797853971162595339').send('Utilisateur à l\'identifiant `' + userID + '` banni par ' + message.author.tag + ' (`' + message.author.id + '`) ')
                    }
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ **Veuillez rentrer l\'identifiant d\'un utilisateur valide**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ **Veuillez rentrer l\'identifiant d\'un utilisateur**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
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
