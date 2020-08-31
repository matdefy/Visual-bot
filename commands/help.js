const Discord = require('discord.js')
const config = require('C:/Users/matte/montage_video/bot/Graph-bot/config.json')

module.exports = {
    run: (db, message, args) => {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('🔽 Voici toute les commandes disponibles 🔽')
            .setDescription('**\*help : Permet de voir toutes les commandes du bot ! \n \n *regle : Affiche toutes les règles à respecter pour l\'enregistrement ! \n \n\*creation {image} : Cela permet d\'enregistrer une création, tout est expliqué dans la commande \*règles pour son utilisation... \n \n\*voircreation {user} : Permet de visualiser toutes les créations d\'une personne, si cette même personne est enregistré dans la base de données ! \n \n\*supp : Cette commande permet de supprimer toutes les créations qui sont enregistrées dans la base de données pour la personne qui la tape. Il est impossible de sélectionner une personne spécifique, seulement vous !**')
            .setColor('00FF00')
            .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
    }

}
