const Discord = require('discord.js')

module.exports = {
    run: (db, message, args) => {
        const user = message.mentions.users.first();
        if (message.mentions.users.size === 1) {
        if (db.has("pr_" + user.id)) {
            message.channel.send(db.get("pr_" + user.id))
        } else {
            message.channel.send(new Discord.MessageEmbed()
            .setTitle('⚠️ Erreur ! ⚠️')
            .setDescription('Ce membre n\'est pas enregistré dans la base de donnée !')
            .setColor('#FF0000')
            .setFooter('Eddroid', 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
        }
    } else {
        message.channel.send(new Discord.MessageEmbed()
        .setTitle('❌ Veuillez entrer 1 utilisateur ❌')
        .setColor('#FF0000')
        .setFooter('Eddroid', 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
    }
    },

}