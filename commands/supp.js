const Discord = require('discord.js')

module.exports = {
    run: (db, message, args) => {
        if (db.has("pr_" + message.member.id) || db.has(message.member.id)) {
            db.delete("pr_" + message.member.id)
            db.delete(message.member.id)
            message.channel.send(new Discord.MessageEmbed()
            .setTitle('✅ Vous n\'êtes plus enregistré dans la basse de donnée ! ✅')
            .setColor('#00FF00')
            .setFooter('Eddroid', 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
        } else {
            message.channel.send(new Discord.MessageEmbed()
            .setTitle('⚠️ Erreur ! ⚠️')
            .setDescription('Vous n\'êtes pas enregistré dans la base de donnée !')
            .setColor('#FF0000')
            .setFooter('Eddroid', 'https://cdn.discordapp.com/attachments/577866353030201355/749204835982770206/logo2_8.png'))
        }

}
}