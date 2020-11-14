const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            const parentID = args[0]
            const guildparents = message.guild.channels.cache
            const categoriestout = guildparents.filter((categorie) => categorie.type === 'category')
            const categoriesId = categoriestout.map(id => id.id)
            if (categoriesId.includes(parentID)) {
                dbLogs.set('catcmd_' + message.guild.id, parentID)
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('✅ Catégorie pour les tickets de commande à l\'identifiant : `' + parentID + '` enregistré ! ✅\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                    .setColor('#00FF00')
                    .setFooter(config.version, message.client.user.avatarURL()))
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Veuillez entrer l\'identifiant d\'une catégorie ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 Vous n\'avez pas les permissions suffisantes ! 🛑\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
