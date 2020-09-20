const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        if (message.guild.id === '747834737527226542' && message.channel.name.startsWith('ticket')) {
            var descript = args.join(' ')
            if (descript.length !== 0) {
                db.set('descript_' + message.author.id, descript)
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('✅ Description modifiée ✅')
                    .setColor('#FF0000')
                    .setFooter(config.version, message.client.user.avatarURL()))
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('❌ Veuillez entrer une description ❌')
                    .setColor('#FF0000')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 Veuillez entrer cette commande dans les channels de tickets sur ce [serveur](https://discord.gg/Xs4kThY) 🛑')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
