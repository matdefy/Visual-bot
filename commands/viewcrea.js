const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        let prefix = '!vb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        let user = 0
        if (message.mentions.users.size === 1) {
            user = message.mentions.users.first()
        } else {
            if (args[0] > 0) {
                user = args[0]
            } else {
                user = message.author.id
            }
        }
        if (db.has('crea_' + user)) {
            const creations = db.get('crea_' + user)
            const text = creations.map((crea) => 'Création numéro `' + crea.id + '`\n' + 'Vérification ' + crea.verif + '\n')
            message.channel.send({
                embed: new Discord.MessageEmbed()
                    .setDescription(text)
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL()),
                files: creations.map((crea) => {
                    return {
                        name: crea.id + '.' + crea.url.split('.').pop(),
                        attachment: crea.url
                    }
                })
            })
            if (db.has('descript_' + user)) {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('**💬 description : **\n\n' + db.get('descript_' + user))
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
            if (db.has('level_' + user)) {
                const level = db.get('level_' + user)
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('**🔢 level : **' + '`' + level + '`')
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send('⚠️ **Ce membre n\'est pas enregistré dans la base de données !**')
        }
    }
}
