const Discord = require('discord.js')
config = require('C:/Users/matte/montage_video/bot/Graph-bot/config.json'),

module.exports = {
    run: (db, message, args) => {
        /*const user = message.mentions.users.first();
        if (message.mentions.users.size === 1) {
        if (db.has("pr_" + user.id)) {
            message.channel.send(db.get("pr_" + user.id))
        } else {
            message.channel.send(new Discord.MessageEmbed()
            .setDescription('⚠️ Ce membre n\'est pas enregistré dans la base de donnée ! ⚠️')
            .setColor('#FF0000')
            .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
        }
    } else {
        message.channel.send(new Discord.MessageEmbed()
        .setDescription('❌ Veuillez entrer 1 utilisateur ❌')
        .setColor('#FF0000')
            .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
    }*/
    message.channel.send(new Discord.MessageEmbed()
        .setDescription('🚧 commande en cours d\'amélioration 🚧')
        .setColor('FF7F00')
        .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
    },

}