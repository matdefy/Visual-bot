const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        console.log('commande : "confircreation" activée ✅')
        const user = message.mentions.users.first()
        if (message.member.hasPermission('KICK_MEMBERS')) {
            if (message.mentions.users.size === 1) {
                if (db.has(user.id)) {
                    var creations = db.get(user.id)
                    var idcrea = args[0]
                    // Récupérer et modifier une creation
                    creations.find((creation) => creation.id === parseInt(idcrea)).verif = '✅'
                    // Écrire les modifications dans la base de données
                    db.set(user.id, creations)
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('✅ Création ' + idcrea + ' validée ! ✅')
                        .setColor('#FF0000')
                        .setFooter(config.version, message.client.user.avatarURL()))
                    // message.channels.cache.get('751369171849314346').send('création validé pour l\'utilisateur ' + user.id + ' Par ' + message.author.id)
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ Ce membre n\'est pas enregistré dans la base de données ! ⚠️')
                        .setColor('#FF0000')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Veuiller mentionner 1 membre ⚠️')
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
