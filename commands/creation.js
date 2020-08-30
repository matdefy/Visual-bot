const Discord = require('discord.js')
config = require('C:/Users/matte/montage_video/bot/Graph-bot/config.json'),

module.exports = {
    run: (db, message, args) => {
        var creationId = 1;
        if (db.has(message.author.id)) {
    creationId = db.get(message.author.id).length + 1
}
        if (message.attachments.size === 1) {
        db.push(message.author.id, {
            "id": creationId,
            "url": message.attachments.first().url,
            "verif": false
        })
        
        message.channel.send(new Discord.MessageEmbed()
        .setDescription('✅ Création enregistré ✅')
        .setColor('#00FF00')
        .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
    } else {
        message.channel.send(new Discord.MessageEmbed()
        .setDescription('❌ Veuillez entrer 1 création ❌')
        .setColor('#FF0000')
        .setFooter(config.version, 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
    }

}

}