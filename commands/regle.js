const Discord = require('discord.js')
const config = require('C:/Users/matte/montage_video/bot/Graph-bot/config.json')

module.exports = {
    run: (db, message) => {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('Règle 🔽')
            .setDescription('1 - Pour envoyer vos créations, taper *creation puis entrer votre image. Le bot va alors vous confirmez que votre création est enregistré dans la basse de donnée. Veuillez réitérer cette oppération pour chacune de vos créations !\n \n2 - Après avoir entré toutes vos créations, envoyer une ou plusieurs preuves pour chacune d\'elle. Une preuve peut-être un screen de votre logiciel avec votre création ouverte, ou l\'envoie direct d\'un fichier (Photoshop, ...) de votre création (pour les fichier Photoshop, GIMP, etc... il est obligatoire que cela soit sous forme de lien. Vous pouvez par exemple créé un lien Mega, ou google drive). Si cela n\'est pas suffisant pour confirmer que c\'est bien vous qui avais les droits de la création, nous pourrons tout simplement refusé votre enregistrement pour la création concerné ! ⚠️ Avant d\'envoyer une preuves veuillez taper *preuve {le numéro de votre création} (si vous l\'avez envoyé en 1er, 2eme, etc...) et ensuite la preuve. Veuillez réitérer l\'opération pour chaque preuve ! ⚠️\n \nVous serez recontacté pour vous informer de la bonne ou mauvaise nouvelle pour l enregistrement de vos œuvres, Cela peut prendre 24h au maximum...')
            .setColor('#00FF00')
            .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
    }

}
