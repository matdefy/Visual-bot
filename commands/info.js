const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        if (dbLogs.has('logs')) {
            const logs = dbLogs.get('logs')
            const total = logs.length
            const creation = dbLogs.get('creation').length
            const preuve = dbLogs.get('preuve').length
            const logsDay = logs.filter(log => log.date >= (Date.now() - 24 * 60 * 60 * 1000)).length
            const logscmd = logs.filter(log => log.cmd === ('*cmd')).length
            const logsdescript = logs.filter(log => log.cmd === ('*descript')).length
            const logshelp = logs.filter(log => log.cmd === ('*help')).length
            const logsinfo = logs.filter(log => log.cmd === ('*info')).length
            const logslevel = logs.filter(log => log.cmd === ('*level')).length
            const logsviewcrea = logs.filter(log => log.cmd === ('*viewcrea')).length
            message.channel.send(new Discord.MessageEmbed()
                .setTitle('🔽 Information relative aux commandes tapés 🔽')
                .setDescription('Le nombre de commandes tapées depuis le 13/10/20 est de **' + total + '** commandes ! \n \nCommandes tapées aujourd\'hui : **' + logsDay + '**\n \n**❤️ MERCI ❤️**')
                .addFields(
                    { name: 'créations enregistrées', value: creation + ' créations', inline: true },
                    { name: 'preuves enregistrées', value: preuve + ' preuves', inline: true },
                    { name: 'commande : cmd', value: 'tapée ' + logscmd + ' fois', inline: true },
                    { name: 'commande : descript', value: 'tapée ' + logsdescript + ' fois', inline: true },
                    { name: 'commande : help', value: 'tapée ' + logshelp + ' fois', inline: true },
                    { name: 'commande : info', value: 'tapée ' + logsinfo + ' fois', inline: true },
                    { name: 'commande : level', value: 'tapée ' + logslevel + ' fois', inline: true },
                    { name: 'commande : viewcrea', value: 'tapée ' + logsviewcrea + ' fois', inline: true }
                )
                .setColor('0000FF')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
