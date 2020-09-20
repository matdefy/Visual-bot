const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('🔽 Voici toutes les commandes disponibles 🔽')
            .setDescription('**(Ceci est un raccourcie de la [documentation](https://graphbot.gitbook.io/graph-bot/) du bot, nous vous conseillons d\'aller directement sur celle ci pour plus d\'information !)** \n \n`*addcrea [le fichier de votre création]` permet d\'ajouter une création !\n \n`*addpreuve [le numéro de la création qui conserne la preuve] [le fichier de la preuve]` permet d\'ajouter des preuves pour une création en particulier !\n \n`*descript [votre description]` permet d\'ajouter une description à votre profil !\n \n`*viewcrea [@membre]<-(facultatif)` permet de voir les créations d\'une personne !\n \n`*viewpreuve` permet de voir toutes les preuves des créations, la personne qui a envoyer les preuves et la seule qui peut les voir !\n \n`*delete` permet de supprimer toutes vos créations et preuves associées !\n \n`*deletecrea [le numéro d\'une création]` permet de supprimer une création et ses preuves en particulié !\n \n`*help` permet de voir cette page !!!')
            .setColor('00FF00')
            .setFooter(config.version, message.client.user.avatarURL()))
    }

}
