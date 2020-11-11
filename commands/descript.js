const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        const descript = args.join(' ')
        if (descript.length !== 0) {
            db.set('descript_' + message.author.id, descript)
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('✅ Description modifiée ✅')
                .setColor('#00FF00')
                .setFooter(config.version, message.client.user.avatarURL()))
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 Veuillez entrer une description 🛑\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
