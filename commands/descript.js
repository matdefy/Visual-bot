const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        let prefix = '!gb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        const descript = args.join(' ')
        if (descript.length !== 0) {
            db.set('descript_' + message.author.id, descript)
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('✅ **Description modifiée**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                .setColor('#00FF00')
                .setFooter(config.version, message.client.user.avatarURL()))
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ **Veuillez entrer une description**\n\n`' + prefix + 'descript [une description]` : permet d’enregistrer une description de votre profil dans la base de données, elle sera affichée avec vos créations !\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
