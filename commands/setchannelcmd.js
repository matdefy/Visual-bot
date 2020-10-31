const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            const channelID = args[0]
            const guildchannels = message.guild.channels.cache.map(channel => channel.id)
            if (guildchannels.includes(channelID)) {
                dbLogs.set('channelcmd_' + message.guild.id, channelID)
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('✅ Salon de commande à l\'identifiant : `' + channelID + '` enregistré ! ✅')
                    .setColor('#FF0000')
                    .setFooter(config.version, message.client.user.avatarURL()))
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Veuiller entrer l\'identifiant d\'un salon ⚠️')
                    .setColor('#00FF00')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 Vous n\'avez pas les permissions suffisantes ! 🛑')
                .setColor('#00FF00')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
