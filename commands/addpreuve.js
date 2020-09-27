const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        if (message.guild.id === '747834737527226542' && message.channel.name.startsWith('ticket')) {
            var creationIdPr = args[0]
            if (db.has(message.member.id)) {
                const creationIdverif = db.get(message.author.id).some((creation) => creation.id === parseInt(args[0]))
                if (message.attachments.size === 1) {
                    if (creationIdverif) {
                        db.push('pr_' + message.author.id, {
                            id: parseInt(creationIdPr),
                            url: message.attachments.first().url
                        })
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('✅ Preuve enregistrée pour la création num\éro : ' + creationIdPr + ' ✅\nTapez `*viewpreuve` pour voir toutes les preuves des créations !\n\n**[documentation](https://graphbot.gitbook.io/graph-bot/)**')
                            .setColor('#00FF00')
                            .setFooter(config.version, message.client.user.avatarURL()))
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
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 Veuillez entrer cette commande dans les channels de tickets sur ce **[serveur](https://discord.gg/Xs4kThY)** 🛑\n\n**[documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
