const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        console.log('commande : "confircreation" activée ✅')
        if (message.member.hasPermission('KICK_MEMBERS')) {
            const user = message.mentions.users.first()
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
        }
    }
}
