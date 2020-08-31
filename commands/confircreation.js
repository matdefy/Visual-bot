const Discord = require('discord.js')
const config = require('C:/Users/matte/montage_video/bot/Graph-bot/config.json')

module.exports = {
    run: (db, message, args) => {
        console.log('commande : "confircreation" activé ✅')
        if (message.member.hasPermission('KICK_MEMBERS')) {
            const user = message.mentions.users.first()
            var creations = db.get(user.id)
            var idcrea = args[0]
            // Récupérer et modifier une creation
            creations.find((creation) => creation.id === parseInt(idcrea)).verif = '✅'
            // Écrire les modifications dans la base de données
            db.set(user.id, creations)
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('✅ Création ' + idcrea + ' validé ! ✅')
                .setColor('#FF0000')
                .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
        }
    }
}
