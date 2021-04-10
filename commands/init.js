const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: async (db, message, args, client) => {
        let prefix = config.prefix
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        if (message.member.hasPermission('MANAGE_GUILD')) {
            if (!db.has('parent_' + message.guild.id) || !db.has('channelcmd_' + message.guild.id) || !db.has('channelcmdclient_' + message.guild.id)) {
                if (!db.has('parent_' + message.guild.id)) {
                    await message.guild.channels.create('commandes', {
                        type: 'category'
                    }).then((categorie) => {
                        const idparent = categorie.id
                        db.set('parent_' + message.guild.id, idparent)
                    })
                }
                if (!db.has('channelcmd_' + message.guild.id)) {
                    const parentid = db.get('parent_' + message.guild.id)
                    message.guild.channels.create('📮 commandes clients', {
                        permissionOverwrites: [
                            {
                                id: message.guild.id,
                                deny: [
                                    'SEND_MESSAGES'
                                ]
                            },
                            {
                                id: client.user.id,
                                allow: [
                                    'VIEW_CHANNEL',
                                    'ADD_REACTIONS',
                                    'MANAGE_CHANNELS',
                                    'ATTACH_FILES'
                                ]
                            }
                        ],
                        type: 'text',
                        parent: parentid
                    }).then((channel) => {
                        channel.send(new Discord.MessageEmbed()
                            .setDescription('📮 **Les commandes pour ce serveur vont maintenant apparaitres ici !**\n\nVeuillez autoriser ce channel aux personnes compétentes seulement pour éviter que des personnes non qualifiées puissent prendre des commandes')
                            .setColor('#FF7B00')
                            .setFooter(config.version, client.user.avatarURL()))
                        const idchannel = channel.id
                        db.set('channelcmd_' + message.guild.id, idchannel)
                    })
                }
                if (!db.has('channelcmdclient_' + message.guild.id)) {
                    const parentid = db.get('parent_' + message.guild.id)
                    message.guild.channels.create('📮 passer commande', {
                        permissionOverwrites: [
                            {
                                id: client.user.id,
                                allow: [
                                    'VIEW_CHANNEL',
                                    'ADD_REACTIONS',
                                    'MANAGE_CHANNELS',
                                    'ATTACH_FILES'
                                ]
                            }
                        ],
                        type: 'text',
                        parent: parentid
                    }).then((channel) => {
                        channel.send(new Discord.MessageEmbed()
                            .setDescription(`📮 **Pour passer commande aux prestataires de ce serveur, taper \`${prefix}cmd ${message.guild.id}\` !**`)
                            .setColor('#FF7B00')
                            .setFooter(config.version, client.user.avatarURL()))
                        const idchannel = channel.id
                        db.set('channelcmdclient_' + message.guild.id, idchannel)
                    })
                }
                return message.channel.send('✅ **Système de commande configuré !**')
            }
            const guildparents = message.guild.channels.cache
            const categoriestout = guildparents.filter((salon) => salon.type === 'category')
            const categoriesId = categoriestout.map(categorie => categorie.id)
            const dbcatcmd = db.get('parent_' + message.guild.id)
            const channelID = db.get('channelcmd_' + message.guild.id)
            const channelclientID = db.get('channelcmdclient_' + message.guild.id)
            const guildchannels = message.guild.channels.cache.map(channel => channel.id)
            if (!categoriesId.includes(dbcatcmd) || !guildchannels.includes(channelID) || !guildchannels.includes(channelclientID)) {
                if (!categoriesId.includes(dbcatcmd)) {
                    await message.guild.channels.create('commandes', {
                        type: 'category'
                    }).then((categorie) => {
                        const idparent = categorie.id
                        db.set('parent_' + message.guild.id, idparent)
                    })
                    if (guildchannels.includes(channelID)) {
                        client.channels.cache.get(channelID).delete()
                        const parentid = db.get('parent_' + message.guild.id)
                        await message.guild.channels.create('📮 commandes clients', {
                            permissionOverwrites: [
                                {
                                    id: message.guild.id,
                                    deny: [
                                        'SEND_MESSAGES'
                                    ]
                                },
                                {
                                    id: client.user.id,
                                    allow: [
                                        'VIEW_CHANNEL',
                                        'ADD_REACTIONS',
                                        'MANAGE_CHANNELS',
                                        'ATTACH_FILES'
                                    ]
                                }
                            ],
                            type: 'text',
                            parent: parentid
                        }).then((channel) => {
                            const idchannel = channel.id
                            db.set('channelcmd_' + message.guild.id, idchannel)
                            channel.send(new Discord.MessageEmbed()
                                .setDescription('📮 **Les commandes pour ce serveur vont maintenant apparaitres ici !**\n\nVeuillez autoriser ce channel aux personnes compétentes seulement pour éviter que des personnes non qualifiées puissent prendre des commandes')
                                .setColor('#FF7B00')
                                .setFooter(config.version, client.user.avatarURL()))
                            db.set('channelcmd_' + message.guild.id, idchannel)
                        })
                    }
                    if (guildchannels.includes(channelclientID)) {
                        client.channels.cache.get(channelclientID).delete()
                        const parentid = db.get('parent_' + message.guild.id)
                        message.guild.channels.create('📮 passer commande', {
                            permissionOverwrites: [
                                {
                                    id: client.user.id,
                                    allow: [
                                        'VIEW_CHANNEL',
                                        'ADD_REACTIONS',
                                        'MANAGE_CHANNELS',
                                        'ATTACH_FILES'
                                    ]
                                }
                            ],
                            type: 'text',
                            parent: parentid
                        }).then((channel) => {
                            channel.send(new Discord.MessageEmbed()
                                .setDescription(`📮 **Pour passer commande aux prestataires de ce serveur, taper \`${prefix}cmd ${message.guild.id}\` !**`)
                                .setColor('#FF7B00')
                                .setFooter(config.version, client.user.avatarURL()))
                            const idchannel = channel.id
                            db.set('channelcmdclient_' + message.guild.id, idchannel)
                        })
                    }
                }
                if (!guildchannels.includes(channelID)) {
                    const parentid = db.get('parent_' + message.guild.id)
                    await message.guild.channels.create('📮 commandes clients', {
                        permissionOverwrites: [
                            {
                                id: message.guild.id,
                                deny: [
                                    'SEND_MESSAGES'
                                ]
                            },
                            {
                                id: client.user.id,
                                allow: [
                                    'VIEW_CHANNEL',
                                    'ADD_REACTIONS',
                                    'MANAGE_CHANNELS',
                                    'ATTACH_FILES'
                                ]
                            }
                        ],
                        type: 'text',
                        parent: parentid
                    }).then((channel) => {
                        const idchannel = channel.id
                        db.set('channelcmd_' + message.guild.id, idchannel)
                        channel.send(new Discord.MessageEmbed()
                            .setDescription('📮 **Les commandes pour ce serveur vont maintenant apparaitres ici !**\n\nVeuillez autoriser ce channel aux personnes compétentes seulement pour éviter que des personnes non qualifiées puissent prendre des commandes')
                            .setColor('#FF7B00')
                            .setFooter(config.version, client.user.avatarURL()))
                        db.set('channelcmd_' + message.guild.id, idchannel)
                    })
                }
                if (!guildchannels.includes(channelclientID)) {
                    const parentid = db.get('parent_' + message.guild.id)
                    message.guild.channels.create('📮 passer commande', {
                        permissionOverwrites: [
                            {
                                id: client.user.id,
                                allow: [
                                    'VIEW_CHANNEL',
                                    'ADD_REACTIONS',
                                    'MANAGE_CHANNELS',
                                    'ATTACH_FILES'
                                ]
                            }
                        ],
                        type: 'text',
                        parent: parentid
                    }).then((channel) => {
                        channel.send(new Discord.MessageEmbed()
                            .setDescription(`📮 **Pour passer commande aux prestataires de ce serveur, taper \`${prefix}cmd ${message.guild.id}\` !**`)
                            .setColor('#FF7B00')
                            .setFooter(config.version, client.user.avatarURL()))
                        const idchannel = channel.id
                        db.set('channelcmdclient_' + message.guild.id, idchannel)
                    })
                }
                return message.channel.send('✅ **Système de commande reconfiguré !**')
            } else {
                if (db.has('parent_' + message.guild.id)) {
                    client.channels.cache.get(dbcatcmd).delete()
                    db.delete('parent_' + message.guild.id)
                }
                if (db.has('channelcmd_' + message.guild.id)) {
                    client.channels.cache.get(channelID).delete()
                    db.delete('channelcmd_' + message.guild.id)
                }
                if (db.has('channelcmdclient_' + message.guild.id)) {
                    client.channels.cache.get(channelclientID).delete()
                    db.delete('channelcmdclient_' + message.guild.id)
                }
                return message.channel.send('✅ **Système de commande désactivé !**')
            }
        } else {
            message.channel.send('⛔ **Vous n\'avez pas les permissions suffisantes !**')
        }
    }
}
