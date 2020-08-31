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
                            id: creationIdPr,
                            url: message.attachments.first().url
                        })
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('✅ Preuve enregistrée ✅')
                            .setColor('#00FF00')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    } else {
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('❌ Création introuvable ❌')
                            .setColor('#00FF00')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    }
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('❌ Veuillez entrer 1 preuve ❌')
                        .setColor('#FF0000')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {

            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('❌ Veuillez entrer cette commande dans les channels de tickets sur ce [serveur](https://discord.gg/Xs4kThY) ❌')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
