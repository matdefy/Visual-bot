const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('🔽 Voici toutes les commandes disponibles 🔽')
            .setDescription('**(Ceci est un raccourci de la [documentation](https://graphbot.gitbook.io/graph-bot/) du bot, nous vous conseillons d\'aller directement sur celle-ci pour plus d\'information !)** \n \n`*addcrea [le fichier de votre création]` permet d\'ajouter une création !\n \n`*addpreuve [le numéro de la création qui concerne la preuve] [le fichier de la preuve]` permet d\'ajouter des preuves pour une création en particulier !\n \n`*descript [votre description]` permet d\'ajouter une description à votre profil !\n \n`*viewcrea [@membre]<-(facultatif)` permet de voir les créations d\'une personne !\n \n`*viewpreuve` permet de voir toutes les preuves des créations ! **(la personne qui a envoyer les preuves est la seule qui peut les voir !)**\n \n`*delete` permet de supprimer toutes vos créations et preuves associées !\n \n`*deletecrea [le numéro d\'une création]` permet de supprimer une création et ses preuves en particulier !\n \n`*info` permet de savoir le nombre de fois qu\'a été tapé les differents commandes disponible !\n \n`*cmd [le chiffre de votre commande]` permet de prendre commande sur le serveur ou vous tapez la commande !\n \n`*setchannelcmd [l\'identifiant d\'un channel]` permet de configurer le système de prise de commandes !\n \n`*setparentcmd [l\'identifiant d\'une catégorie]` permet de configurer le système de prise de commandes !\n \n`*help` permet de voir ce message !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
            .setColor('00FF00')
            .setFooter(config.version, message.client.user.avatarURL()))
    }

}
