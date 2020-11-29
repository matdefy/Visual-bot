const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: async (db, message, args, client, dbLogs) => {
        const creationIdPr = parseInt(args[0])
        if (db.has('crea_' + message.author.id)) {
            const creationIdverif = db.get('crea_' + message.author.id).some((creation) => creation.id === parseInt(args[0]))
            if (message.attachments.size === 1) {
                if (creationIdverif) {
                    db.push('pr_' + message.author.id, {
                        id: parseInt(creationIdPr),
                        url: message.attachments.first().url
                    })
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('✅ Preuve enregistrée pour la création num\éro : `' + creationIdPr + '` ✅\nTapez `!gbviewpreuve` pour voir toutes les preuves des créations !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                        .setColor('#00FF00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                    dbLogs.add('preuve', 1)
                    const creation = db.get('crea_' + message.author.id).find(crea => crea.id === creationIdPr)
                    await client.channels.cache.get('775274490723827715').send({
                        embed: new Discord.MessageEmbed()
                            .setDescription('Création numéro [' + creationIdPr + '] / Utilisateur : (' + message.author.id + ')')
                            .setColor('#00FF00')
                            .setFooter(config.version, message.client.user.avatarURL()),
                        files: [{
                            name: creation.id + '.' + creation.url.split('.').pop(), // récupère l'extension
                            attachment: creation.url
                        }]
                    })
                    client.channels.cache.get('775274490723827715').send({
                        embed: new Discord.MessageEmbed()
                            .setDescription('Preuve pour la création numéro [' + creationIdPr + '] / Utilisateur : (' + message.author.id + ')\nlien preuve : -' + message.attachments.first().url + '-')
                            .setColor('#00FF00')
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
                        .setDescription('⚠️ Création introuvable ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('🛑 Veuillez entrer 1 preuve ! 🛑\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                    .setColor('#FF0000')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ Aucune création enregistrée dans la base de données ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
