const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        let prefix = '!vb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        const memberSiId = args[0]
        const descriptSi = message.content.trim().slice(`${prefix}signalement ${memberSiId} `.length)
        if (descriptSi.length > 1) {
            const user = client.users.cache.find((element) => element.id === message.author.id)
            if (user) {
                let signalementIMG = 0
                if (message.attachments.first()) {
                    signalementIMG = message.attachments.first().url
                    client.channels.cache.get('808414479913713697').send({ files: [signalementIMG] }).then(img => {
                        signalementIMG = img.attachments.first().url
                    })
                }
                message.channel.send('✅ **Membre à l\'identifiant `' + memberSiId + '` signalé !**')
                client.channels.cache.get('797845739472027658').send('Membre : `[' + memberSiId + ']`\nSignalement : `<' + message.author.id + '>`\nLien preuve : **' + signalementIMG + '**\nDescription : {**' + descriptSi + '**}').then(msg => {
                    msg.react('⛔')
                    msg.react('❌')
                })
                message.client.channels.cache.get('797853971162595339').send('membre à l\'identifiant `' + message.author.id + '` a signalé le membre `' + memberSiId + '`')
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ **Utilisateur incunnu de Visual Bot !**\n\nSeuls les utilisateurs pouvant utiliser Visual Bot peuvent être bannis.\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send('⚠️ **Veuillez rentrer une description de votre signalement !**')
        }
    }
}
