const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        const numcmd = args[0]
        const descriptcmd = message.content.trim().slice(`${config.prefix}cmd ${numcmd} `.length)
        const guild = message.guild.name
        if (dbLogs.has('channelcmd_' + message.guild.id)) {
            if (dbLogs.has('catcmd_' + message.guild.id)) {
                // vérification que le salon stockée dans la base de données est valide
                const channelID = dbLogs.get('channelcmd_' + message.guild.id)
                const guildchannels = message.guild.channels.cache.map(channel => channel.id)
                if (guildchannels.includes(channelID)) {
                // vérification que le salon stockée dans la base de données est valide

                    // vérification que la catégorie stockée dans la base de données est valide
                    const guildparents = message.guild.channels.cache
                    const categoriestout = guildparents.filter((salon) => salon.type === 'category')
                    const categoriesId = categoriestout.map(categorie => categorie.id)
                    const dbcatcmd = dbLogs.get('catcmd_' + message.guild.id)
                    if (categoriesId.includes(dbcatcmd)) {
                    // vérification que la catégorie stockée dans la base de données est valide

                        if (numcmd < 6) {
                            if (descriptcmd.length > 14) {
                                const channelCMD = dbLogs.get('channelcmd_' + message.guild.id)
                                client.channels.cache.get(channelCMD).send({
                                    embed: new Discord.MessageEmbed()
                                        .setTitle('🎉 Nouvelle commande 🎉')
                                        .setDescription('Commande numéro : [' + numcmd + ']\nDescription : <' + descriptcmd + '>\nUtilisateur : ' + message.author.tag + ' (' + message.author.id + ')')
                                        .setColor('#00FF00')
                                        .setFooter(config.version, message.client.user.avatarURL())
                                }).then(msg => {
                                    msg.react('✅')
                                })
                                message.channel.send(new Discord.MessageEmbed()
                                    .setTitle('✅ Commande enregistré ✅')
                                    .setDescription('Aller dans les messages privés de Graph Bot pour avoir tous les détails sur votre  📩 commande 📩 !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                                    .setColor('00FF00')
                                    .setFooter(config.version, message.client.user.avatarURL()))
                                message.author.createDM().then(channel => {
                                    channel.send(new Discord.MessageEmbed()
                                        .setTitle('✅ Commande enregistré ✅')
                                        .setDescription(`Votre commande au numéro \`${numcmd}\` avec la description \`${descriptcmd}\` sur le serveur ${guild} a bien été prise en compte, vous serez notifiée 🔽 ici 🔽 lorsqu'un graphiste vous aura pris en charge !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**`)
                                        .setColor('00FF00')
                                        .setFooter(config.version, message.client.user.avatarURL()))
                                })
                            } else {
                                message.channel.send(new Discord.MessageEmbed()
                                    .setDescription('⚠️ La description de votre commande doit faire plus de 15 caractères ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                                    .setColor('#e55f2a')
                                    .setFooter(config.version, message.client.user.avatarURL()))
                            }
                        } else {
                            message.channel.send(new Discord.MessageEmbed()
                                .setDescription('⚠️ Le numéro d\'une commande doit être compris entre `1` et `5`, mais pas `' + numcmd + '` ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                                .setColor('#e55f2a')
                                .setFooter(config.version, message.client.user.avatarURL()))
                        }
                    } else {
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription('⚠️ La catégorie stockée dans la base de données pour afficher les commandes est invalide ! ⚠️\nTapez `*setparentcmd [l\'identifiant d\'une catégorie]` pour ajouter une catégorie dans la base de données !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                            .setColor('#e55f2a')
                            .setFooter(config.version, message.client.user.avatarURL()))
                    }
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ Le salon stocké dans la base de données pour afficher les commandes est invalide ! ⚠️\nTapez `*setchannelcmd [l\'identifiant d\'un salon]` pour ajouter un salon dans la base de données !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Le gérant du serveur n\'a pas sélectionné la catégorie ou créé les tickets de commandes ! ⚠️\nTapez `*setparentcmd [l\'identifiant d\'une catégorie]` pour ajouter une catégorie dans la base de données !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ Le gérant du serveur n\'a pas sélectionné le salon ou afficher les commandes ! ⚠️\nTapez `*setchannelcmd [l\'identifiant d\'un salon]` pour ajouter un salon dans la base de données !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
