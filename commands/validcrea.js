const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        let prefix = '!gb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        const user = message.mentions.users.first()
        if (message.member.hasPermission('KICK_MEMBERS') && message.guild.id === '775274490723827712') {
            if (message.mentions.users.size === 1) {
                if (db.has('crea_' + user.id)) {
                    const creations = db.get('crea_' + user.id)
                    const idcrea = args[0]
                    // Récupérer et modifier une creation
                    creations.find((creation) => creation.id === parseInt(idcrea)).verif = '✅'
                    // Écrire les modifications dans la base de données
                    db.set('crea_' + user.id, creations)
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('✅ **Création ' + idcrea + ' validée**')
                        .setColor('#00FF00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                    message.client.channels.cache.get('775411371189862410').send('création validée pour l\'utilisateur ' + user.tag + ' (`' + user.id + '`) Par ' + message.author.tag + ' (`' + message.author.id + '`) ')
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ **Ce membre n\'est pas enregistré dans la base de données**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ **Veuillez mentionner 1 membre**')
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
