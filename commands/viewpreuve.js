const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        if (message.mentions.users.size === 1) {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('❌ Vous ne pouvez pas voir les preuves d\'une personne ! ❌')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
            return
        }
        /* if (db.has('pr_' + user.id)) {
                var preuves = db.get('pr_' + user.id)
                var text = preuves.map((crea) => 'Preuve pour la création numéro ' + crea.id + '\n' + crea.url + '\n')
                message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setDescription(text)
                        .setColor('#FF0000')
                        .setFooter(config.version, message.client.user.avatarURL()),
                    files: preuves.map((crea) => {
                        return {
                            name: crea.id + '.png',
                            attachment: crea.url
                        }
                    })
                })
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Ce membre n\'est pas enregistré dans la base de données ! ⚠️')
                    .setColor('#FF0000')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else { */
        if (db.has('pr_' + message.author.id)) {
            var preuve2 = db.get('pr_' + message.author.id)
            var text2 = preuve2.map((crea) => 'Preuve pour la création numéro ' + crea.id)
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
                .setDescription('⚠️ Vous n\'êtes pas enregistré dans la base de données ! ⚠️')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }

}
