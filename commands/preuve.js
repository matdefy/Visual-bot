const Discord = require('discord.js')

module.exports = {
    run: (db, message, args) => {
        if (message.attachments.size === 1) {
        db.push("pr_" + message.author.id, message.attachments.first().url)
        message.channel.send(new Discord.MessageEmbed()
        .setTitle('✅ Preuve enregistré ✅')
        .setColor('#00FF00')
        .setFooter('Eddroid', 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
    } else {
        message.channel.send(new Discord.MessageEmbed()
        .setTitle('❌ Veuillez entrer 1 preuve ❌')
        .setColor('#FF0000')
        .setFooter('Eddroid', 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
    }

},

}