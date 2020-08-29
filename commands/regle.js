const Discord = require('discord.js')

module.exports = {
    run: (db, message) => {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('Règle 🔽')
            .setDescription('1 - Pour envoyer vos créations, taper *creation puis entrer votre image. Le bot va alors vous confirmez que votre création est enregistré dans la basse de donnée. Veuillez réitérer cette oppération pour chacune de vos créations !\n \n3 - Après avoir entré toutes vos créations, envoyer une ou plusieurs preuves pour chacune d elle. Une preuve peut-être un screen de votre logiciel avec votre création ouverte, ou l envoie direct d un fichier (Photoshop, ...) de votre création. Si cela n est pas suffisant pour confirmer que c est bien vous qui avais les droits de la création, nous pourrons tout simplement refusé votre enregistrement pour l’œuvre concerné ! ⚠️ Avant d envoyer vos preuves veuillez taper *preuve et ensuite toutes les envoyer. Pas besoin d ecrire la commande pour chaque preuve. ⚠️\n \nVous serez recontacté pour vous informer de la bonne ou mauvaise nouvelle pour l enregistrement de vos œuvres, Cela peut prendre 24h au maximum...')
            .setColor('#00FF00')
            .setFooter('Eddroid', 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
    },

}