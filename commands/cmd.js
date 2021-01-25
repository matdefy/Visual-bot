const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        let prefix = '!gb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        const descriptcmd = message.content.trim().slice(`${config.prefix}cmd `.length)
        const guild = message.guild.name
        if (db.has('channelcmd_' + message.guild.id)) {
            // vérification que le salon stockée dans la base de données est valide
            const channelID = db.get('channelcmd_' + message.guild.id)
            const guildchannels = message.guild.channels.cache.map(channel => channel.id)
            if (guildchannels.includes(channelID)) {
                if (descriptcmd.length > 14) {
                    const channelCMD = db.get('channelcmd_' + message.guild.id)
                    client.channels.cache.get(channelCMD).send({
                        embed: new Discord.MessageEmbed()
                            .setDescription('🎉 **Nouvelle commande**\n\nDescription : <' + descriptcmd + '>\nUtilisateur : ' + message.author.tag + ' (' + message.author.id + ')')
                            .setColor('#00FF00')
                            .setFooter(config.version, message.client.user.avatarURL())
                    }).then(msg => {
                        msg.react('✅')
                    })
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('✅ **Commande enregistré ' + message.author.tag + '**\n\nAller dans les messages privés de Visual Bot pour avoir tous les détails sur votre  📩 commande 📩 !\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                        .setColor('00FF00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                    message.author.createDM().then(channel => {
                        channel.send(new Discord.MessageEmbed()
                            .setDescription(`✅ **Commande enregistré**\n\nVotre commande avec la description \`${descriptcmd}\` sur le serveur ${guild} a bien été prise en compte, vous serez notifiée 🔽 ici 🔽 lorsqu'un graphiste vous aura pris en charge !\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**`)
                            .setColor('00FF00')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    })
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ **La description de votre commande doit faire plus de 15 caractères**\n\n(votre description doit comprendre le prix minimum que vous pouvez allouer à votre demande, ainsi qu’une brève description de celle-ci)\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ **Le système de commande est invalide**\n\n`' + prefix + 'init` : permet de reconfigurer le système de commande !\n\n⚠️ **Permission de pouvoir gérer le serveur obligatoire !**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ **Le système de commande n\'est pas initialisé sur ce serveur**\n\n`' + prefix + 'init` : permet de configurer le système de commande. Après l’avoir tapé, le bot va créer un channel ou les clients pourront passer commande, un channel permettant au graphiste d\'accepter les commandes des clients, ainsi qu’une catégorie qui stockera les tickets de commandes et les 2 channels décrits ci-dessus.\n\n(pour supprimer le système sur votre serveur, retaper la commande)\n\n(si par erreur vous supprimez un channel ou la catégorie créée par le bot, retaper la commande. Le bot va automatiquement détecter qu’il y a une anomalie et corriger le problème)\n\n⚠️ **Permission de pouvoir gérer le serveur obligatoire !**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
