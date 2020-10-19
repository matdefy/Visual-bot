const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: async (db, message, args, client) => {
        const creationIdPr = parseInt(args[0])
        if (db.has(message.author.id)) {
            const creationIdverif = db.get(message.author.id).some((creation) => creation.id === parseInt(args[0]))
            if (message.attachments.size === 1) {
                if (creationIdverif) {
                    db.push('pr_' + message.author.id, {
                        id: parseInt(creationIdPr),
                        url: message.attachments.first().url
                    })
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('✅ Preuve enregistrée pour la création num\éro : `' + creationIdPr + '` ✅\nTapez `*viewpreuve` pour voir toutes les preuves des créations !\n\n**[documentation](https://graphbot.gitbook.io/graph-bot/)**')
                        .setColor('#00FF00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                    const creation = db.get(message.author.id).find(crea => crea.id === creationIdPr)
                    await client.channels.cache.get('764886091295358996').send({
                        embed: new Discord.MessageEmbed()
                            .setDescription('Création numéro [' + creationIdPr + '] / Utilisateur : (' + message.author.id + ')')
                            .setColor('#FF0000')
                            .setFooter(config.version, message.client.user.avatarURL()),
                        files: [{
                            name: creation.id + '.' + creation.url.split('.').pop(), // récupère l'extension
                            attachment: creation.url
                        }]
                    })
                    client.channels.cache.get('764886091295358996').send({
                        embed: new Discord.MessageEmbed()
                            .setDescription('Preuve pour la création numéro [' + creationIdPr + '] / Utilisateur : (' + message.author.id + ')')
                            .setColor('#FF0000')
                            .setFooter(config.version, message.client.user.avatarURL()),
                        files: [{
                            name: creation.id + '.' + message.attachments.first().url.split('.').pop(), // récupère l'extension
                            attachment: message.attachments.first().url
                        }]
                    }).then(msg => {
                        msg.react('✅')
                        msg.react('❌')
                    })
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ Création introuvable ⚠️\n\n**[documentation](https://graphbot.gitbook.io/graph-bot/)**')
                        .setColor('#00FF00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('❌ Veuillez entrer 1 preuve ❌\n\n**[documentation](https://graphbot.gitbook.io/graph-bot/)**')
                    .setColor('#FF0000')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ Aucune création enregistrée dans la base de données ⚠️\n\n**[documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
