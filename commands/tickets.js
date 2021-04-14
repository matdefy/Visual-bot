const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        const descriptcmd = message.content.trim().slice(`${config.prefix}tickets `.length)
        // création de la catégorie
        message.guild.channels.create('tickets ' + descriptcmd, {
            type: 'category'
        }).then((categorie) => {
            const idparent = categorie.id
            message.channel.send({
                embed: new Discord.MessageEmbed()
                    .setDescription('📮 **Création ticket ' + descriptcmd + '**\n\n**Pour créer un ticket, cliquer sur la réaction ☑️ !**\n**Pour fermer le système de ticket, cliquer sur la réaction 🔒 (permission de pouvoir gérer le serveur obligatoire)**')
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL())
            }).then(msg => {
                msg.react('☑️')
                msg.react('🔒')
                db.push('parentticket_' + message.guild.id, {
                    idparent: idparent,
                    urlmessage: msg.url
                })
            })
            message.delete()
        })
        // création de la catégorie
    }
}
