const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('ℹ️ Commande help')
            .setDescription('La commande help se partage en **2 parties** :\n\n**- explication et but du bot : 🤖**\n\n**- commandes disponibles : ⌨️**\n\nChaque partie est affichée en cliquant sur la réaction adéquat !\n\nPour faire un retour en arrière dans les messages qui vont suivres, il vous suffit de cliquer sur la réaction avec l\'emoji présent dans le titre du dernier message !\n\nPour avoir plus d\'information, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !')
            .setColor('00FF00')
            .setFooter(config.version, message.client.user.avatarURL())).then(msg => {
            msg.react('🤖')
            msg.react('⌨️')
        })
    }

}
