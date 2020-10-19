const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        if (dbLogs.has('logs')) {
            const logs = dbLogs.get('logs')
            const total = logs.length
            const logsDay = logs.filter(log => log.date >= (Date.now() - 24 * 60 * 60 * 1000)).length
            message.channel.send(new Discord.MessageEmbed()
                .setTitle('🔽 Information relative aux commandes tapés 🔽')
                .setDescription('Le nombre de commandes tapées depuis le 13/10/20 est de **' + total + '** commandes ! \n \nCommandes tapées aujourd\'hui : **' + logsDay + '**\n \n**❤️ MERCI ❤️**')
                .setColor('0000FF')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
