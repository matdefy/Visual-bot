const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        let prefix = '!gb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        if (message.member.hasPermission('KICK_MEMBERS')) {
            const channelID = args[0]
            const guildchannels = message.guild.channels.cache.map(channel => channel.id)
            if (guildchannels.includes(channelID)) {
                db.set('channelcmd_' + message.guild.id, channelID)
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('✅ **Salon de commande à l\'identifiant `' + channelID + '` enregistré**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                    .setColor('#00FF00')
                    .setFooter(config.version, message.client.user.avatarURL()))
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ **Veuillez entrer l\'identifiant d\'un salon**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 **Vous n\'avez pas les permissions suffisantes**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
