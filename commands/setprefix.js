const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        let prefix2 = '!gb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix2 = db.get('prefix_' + message.guild.id)
            }
        }
        if (message.member.hasPermission('KICK_MEMBERS')) {
            const prefix = args[0]
            if (args[0]) {
                if (prefix.length < 6) {
                    db.set('prefix_' + message.guild.id, prefix)
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('✅ **Le prefix pour le serveur ' + message.guild.name + ' et maintenant `' + prefix + '`**\n\n**(Pour obtenir de l\'aide, taper `' + prefix2 + 'help` !)**')
                        .setColor('#00FF00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ **Le prefix doit faire au maximum 5 caractères**\n\n**(Pour obtenir de l\'aide, taper `' + prefix2 + 'help` !)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ **Le prefix doit faire 5 caractères**\n\n**(Pour obtenir de l\'aide, taper `' + prefix2 + 'help` !)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 **Vous n\'avez pas les permissions suffisantes**\n\n**(Pour obtenir de l\'aide, taper `' + prefix2 + 'help` !)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
