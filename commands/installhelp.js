const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        const prefix = db.has('prefix_' + message.guild.id)
        const catcmd = db.has('catcmd_' + message.guild.id)
        const channelcmd = db.has('channelcmd_' + message.guild.id)

        message.channel.send(new Discord.MessageEmbed()
            .setTitle('⚙️ Aide d\'installation')
            .setDescription('Bienvenue dans l\'aide d\'installation, après avoir suivi ce tuto pas à pas, Graph Bot sera entièrement configuré sur votre serveur !\n\nSi vous rencontrez des difficultés pour la configuration du bot, il vous suffit de rejoindre le serveur de support **https://discord.gg/pUj3AK5u5V**, et de créer un ticket dans ce channel <#751360635928838175> !')
            .setColor('#e55f2a')
            .setFooter(config.version, message.client.user.avatarURL()))
        message.channel.send('**Vérification de la configuration actuelle du serveur...**').then(msg => {
            msg.delete({ timeout: 3000 })
        })

        setTimeout(() => {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('Pour suivre la configuration pas à pas, veuillez cliquer sur la réaction ➡️\n\n**Configuration actuelle du serveur :**')
                .addFields(
                    { name: 'prefix', value: prefix, inline: true },
                    { name: 'catégorie des tickets de commandes', value: catcmd, inline: true },
                    { name: 'salon des commandes', value: channelcmd, inline: true }
                )
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL())).then(msg => {
                msg.react('➡️')
            })
        }, 3000)
    }
}
