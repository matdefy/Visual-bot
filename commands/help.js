const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        if (message.channel.type !== 'dm') {
            message.channel.send('💬 **Commande help envoyé en message privé !**')
        }
        client.users.cache.get(message.author.id).send(new Discord.MessageEmbed()
            .setDescription('ℹ️ **commande help**\n\n⌨️ **Utilisation**\n\n🎛️ **Installation**\n\n')
            .setColor('FF7B00')
            .setFooter(config.version, client.user.avatarURL()))
    }
}
