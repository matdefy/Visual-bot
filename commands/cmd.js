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
        const numcmd = args[0]
        const descriptcmd = message.content.trim().slice(`${config.prefix}cmd ${numcmd} `.length)
        const guild = message.guild.name
        if (db.has('channelcmd_' + message.guild.id)) {
            if (db.has('catcmd_' + message.guild.id)) {
                // vérification que le salon stockée dans la base de données est valide
                const channelID = db.get('channelcmd_' + message.guild.id)
                const guildchannels = message.guild.channels.cache.map(channel => channel.id)
                if (guildchannels.includes(channelID)) {
                // vérification que le salon stockée dans la base de données est valide

                    // vérification que la catégorie stockée dans la base de données est valide
                    const guildparents = message.guild.channels.cache
                    const categoriestout = guildparents.filter((salon) => salon.type === 'category')
                    const categoriesId = categoriestout.map(categorie => categorie.id)
                    const dbcatcmd = db.get('catcmd_' + message.guild.id)
                    if (categoriesId.includes(dbcatcmd)) {
                    // vérification que la catégorie stockée dans la base de données est valide

                        if (numcmd < 6) {
                            if (descriptcmd.length > 14) {
                                const channelCMD = db.get('channelcmd_' + message.guild.id)
                                client.channels.cache.get(channelCMD).send({
                                    embed: new Discord.MessageEmbed()
                                        .setDescription('🎉 **Nouvelle commande**\n\nCommande numéro : [' + numcmd + ']\nDescription : <' + descriptcmd + '>\nUtilisateur : ' + message.author.tag + ' (' + message.author.id + ')')
                                        .setColor('#00FF00')
                                        .setFooter(config.version, message.client.user.avatarURL())
                                }).then(msg => {
                                    msg.react('✅')
                                })
                                message.channel.send(new Discord.MessageEmbed()
                                    .setDescription('✅ **Commande enregistré**\n\nAller dans les messages privés de Graph Bot pour avoir tous les détails sur votre  📩 commande 📩 !\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                                    .setColor('00FF00')
                                    .setFooter(config.version, message.client.user.avatarURL()))
                                message.author.createDM().then(channel => {
                                    channel.send(new Discord.MessageEmbed()
                                        .setDescription(`✅ **Commande enregistré**\n\nVotre commande au numéro \`${numcmd}\` avec la description \`${descriptcmd}\` sur le serveur ${guild} a bien été prise en compte, vous serez notifiée 🔽 ici 🔽 lorsqu'un graphiste vous aura pris en charge !\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**`)
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
                                .setDescription('⚠️ **Le numéro d\'une commande doit être compris entre `1` et `5`, mais pas `' + numcmd + '`**\n\n(le chiffre de votre commande et le type de commande, logo, bannière, etc… Renseignez vous auprès du staff pour obtenir le numéro correspondant à votre demande)\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                                .setColor('#e55f2a')
                                .setFooter(config.version, message.client.user.avatarURL()))
                        }
                    } else {
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('⚠️ **La catégorie stockée dans la base de données pour afficher les commandes est invalide**\n\n`' + prefix + 'installhelp` : permet de vous guider dans la configuration de Graph Bot, en vous expliquant pas à pas les différentes fonctionnalités à configurer !\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                            .setColor('#e55f2a')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    }
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ **Le salon stocké dans la base de données pour afficher les commandes est invalide**\n\n`' + prefix + 'installhelp` : permet de vous guider dans la configuration de Graph Bot, en vous expliquant pas à pas les différentes fonctionnalités à configurer !\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ **Le gérant du serveur n\'a pas sélectionné la catégorie ou créé les tickets de commandes**\n\n`' + prefix + 'installhelp` : permet de vous guider dans la configuration de Graph Bot, en vous expliquant pas à pas les différentes fonctionnalités à configurer !\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ **Le gérant du serveur n\'a pas sélectionné le salon ou afficher les commandes**\n\n`' + prefix + 'installhelp` : permet de vous guider dans la configuration de Graph Bot, en vous expliquant pas à pas les différentes fonctionnalités à configurer !\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
