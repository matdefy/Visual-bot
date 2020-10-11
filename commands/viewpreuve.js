const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        if (message.mentions.users.size === 1) {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('❌ Vous ne pouvez pas voir les preuves d\'une personne ! ❌\n\n**[documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
            return
        }
        if (db.has('pr_' + message.author.id)) {
            const preuve2 = db.get('pr_' + message.author.id)
            const text2 = preuve2.map((crea) => 'Preuve pour la création numéro ' + crea.id)
            message.channel.send({
                embed: new Discord.MessageEmbed()
                    .setDescription(text2)
                    .setColor('#FF0000')
                    .setFooter(config.version, message.client.user.avatarURL()),
                files: preuve2.map((crea) => {
                    return {
                        name: crea.id + '.' + crea.url.split('.').pop(),
                        attachment: crea.url
                    }
                })
            })
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ Vous n\'êtes pas enregistré dans la base de données ! ⚠️\n\n**[documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }

}
