const Discord = require('discord.js')
config = require('C:/Users/matte/montage_video/bot/Graph-bot/config.json'),

module.exports = {
    run: (db, message, args, client) => {
        var creationId_pr = args[0]
        if (db.has(message.member.id)) {
        const  creationIdverif = db.get(message.author.id).some((creation) => creation.id === parseInt(args[0]));
        if (message.attachments.size === 1) {
            if (creationIdverif) {
        db.push("pr_" + message.author.id, {
            "id": creationId_pr,
            "url": message.attachments.first().url
        })
        message.channel.send(new Discord.MessageEmbed()
        .setDescription('✅ Preuve enregistré ✅')
        .setColor('#00FF00')
        .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
    } else {
        message.channel.send(new Discord.MessageEmbed()
        .setDescription('❌ Création introuvable ❌')
        .setColor('#00FF00')
        .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
    }
        } else {
        message.channel.send(new Discord.MessageEmbed()
        .setDescription('❌ Veuillez entrer 1 preuve ❌')
        .setColor('#FF0000')
        .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
        }
        } else {
            return
        }
    }
}