const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        const numcmd = args[0]
        if (numcmd < 6) {
            client.channels.cache.get('766663058369413130').send({
                embed: new Discord.MessageEmbed()
                    .setTitle(message.author.id)
                    .setDescription('Commande numéro : [' + numcmd + '] / Utilisateur : ' + message.author.tag + ' (' + message.author.id + ')')
                    .setColor('#E4534E')
                    .setFooter(config.version, message.client.user.avatarURL())
            }).then(msg => {
                msg.react('✅')
            })
            message.author.createDM().then(channel => {
                channel.send(new Discord.MessageEmbed()
                    .setTitle('✅ Commande enregistré ✅')
                    .setDescription('Votre commande au numéro `' + numcmd + '` a bien été prise en compte, vous serez notifiée 🔽 ici 🔽 lorsqu\'un graphiste vous auras pris en charge !')
                    .setColor('00FF00')
                    .setFooter(config.version, message.client.user.avatarURL()))
            })
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('Le numéro d\'une commande doit être compris entre `1` et `5`, mais pas `' + numcmd + '` !')
                .setColor('FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
