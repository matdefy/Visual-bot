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
        if (dbLogs.has('logs')) {
            const logs = dbLogs.get('logs')
            const total = logs.length
            const creation = db.all().filter((objet) => objet.key.startsWith('crea_')).length
            const logsDay = logs.filter(log => log.date >= (Date.now() - 24 * 60 * 60 * 1000)).length
            message.channel.send(new Discord.MessageEmbed()
                .setTitle('🔽 Information relative au bot 🔽')
                .setDescription('Le nombre de commandes tapées depuis le 13/10/20 est de **' + total + '** commandes ! \n\nCommandes tapées aujourd\'hui : **' + logsDay + '**\n\nCréations enregistrées : **' + creation + '**\n\n📡 Ping 📡 de Visual Bot : **' + client.ws.ping + '**ms\n\n**❤️ MERCI ❤️**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                .setColor('#FEFEFE')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
