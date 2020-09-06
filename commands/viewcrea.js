const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        const user = message.mentions.users.first()
        if (message.mentions.users.size === 1) {
            if (db.has(user.id)) {
                var creations = db.get(user.id)
                var text = creations.map((crea) => 'Création numéro ' + crea.id + '\n' + 'vérification ' + crea.verif + '\n')
                message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setDescription(text)
                        .setColor('#FF0000')
                        .setFooter(config.version, message.client.user.avatarURL()),
                    files: creations.map((crea) => {
                        return {
                            name: crea.id + '.' + crea.url.split('.').pop(),
                            attachment: crea.url
                        }
                    })
                })
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('Description :')
                    .setDescription(db.get('descript_' + user.id))
                    .setColor('#FF0000')
                    .setFooter(config.version, message.client.user.avatarURL()))
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Ce membre n\'est pas enregistré dans la base de données ! ⚠️')
                    .setColor('#FF0000')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            if (db.has(message.author.id)) {
                var creations2 = db.get(message.author.id)
                var text2 = creations2.map((crea) => 'Création numéro ' + crea.id + '\n' + 'vérification ' + crea.verif + '\n')
                message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setDescription(text2)
                        .setColor('#FF0000')
                        .setFooter(config.version, message.client.user.avatarURL()),
                    files: creations2.map((crea) => {
                        return {
                            name: crea.id + '.' + crea.url.split('.').pop(),
                            attachment: crea.url
                        }
                    })
                })
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('Description :')
                    .setDescription(db.get('descript_' + message.author.id))
                    .setColor('#FF0000')
                    .setFooter(config.version, message.client.user.avatarURL()))
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Vous n\'êtes pas enregistré dans la base de données ! ⚠️')
                    .setColor('#FF0000')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        }
    }

}
