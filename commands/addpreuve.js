const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: async (db, message, args, client, dbLogs) => {
        let prefix = '!gb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
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
                        .setDescription('✅ **Preuve enregistrée pour la création num\éro `' + creationIdPr + '`**\n\nTapez `' + prefix + 'viewpreuve` pour voir toutes les preuves des créations !\n\nLorsqu\'une preuve est enregistrée, elle est envoyée en examen pour déterminer si oui ou non, elle permet de confirmer que la création qui lui est reliée vous appartient ! Si oui, votre création sera **validée**, un emoji ✅ sera affiché avec votre création !\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
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
                        .setDescription('⚠️ **Veuillez entrer le numéro d\'une création valide**\n\n(le numéro d’une création s’obtient en tapant `' + prefix + 'viewcrea`)\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ **Veuillez entrer 1 preuve**\n\n(une preuve est un screen du projet (photoshop, gimp, etc…) de la création ou l’on peut voir les calques)\n\n(votre preuve doit être envoyer dans le même message que la commande, mais en pièce jointe (le + situé à gauche de la zone d’écriture))\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                    .setColor('#FF0000')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ **Aucune création enregistrée dans la base de données**\n\n`' + prefix + 'addcrea [votre création]` : permet d\'enregistrer une création dans la base de données !\n\n(votre création doit être envoyer dans le même message que la commande, mais en pièce jointe (le + situé à gauche de la zone d’écriture))\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
