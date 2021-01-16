const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: async (db, message, args, client) => {
        let prefix = '!gb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        if (message.member.hasPermission('KICK_MEMBERS')) {
            if (!db.has('catcmd_' + message.guild.id) || !db.has('channelcmd_' + message.guild.id) || !db.has('channelcmdclient_' + message.guild.id)) {
                if (!db.has('catcmd_' + message.guild.id)) {
                    await message.guild.channels.create('system_commandes', {
                        type: 'category'
                    }).then((categorie) => {
                        const idparent = categorie.id
                        db.set('catcmd_' + message.guild.id, idparent)
                    })
                }
                if (!db.has('channelcmd_' + message.guild.id)) {
                    const parentid = db.get('catcmd_' + message.guild.id)
                    message.guild.channels.create('commandes_clients', {
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
                            .setDescription('📮 **Les commandes vont maintenant apparaitres ici**\n\nVeuillez autoriser ce channel aux graphistes seulement pour éviter que des personnes non qualifiées puissent prendre des commandes\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                            .setColor('#00FF00')
                            .setFooter(config.version, client.user.avatarURL()))
                        const idchannel = channel.id
                        db.set('channelcmd_' + message.guild.id, idchannel)
                    })
                }
                if (!db.has('channelcmdclient_' + message.guild.id)) {
                    const parentid = db.get('catcmd_' + message.guild.id)
                    message.guild.channels.create('📮 passer_commande 📮', {
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
                            .setDescription('📮 **Pour passer commande taper `' + prefix + 'cmd [description brève et prix alloué à la commande]`**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                            .setColor('#00FF00')
                            .setFooter(config.version, client.user.avatarURL()))
                        const idchannel = channel.id
                        db.set('channelcmdclient_' + message.guild.id, idchannel)
                    })
                }
                return message.channel.send(new Discord.MessageEmbed()
                    .setDescription('✅ **Le système de commande est configuré**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                    .setColor('#00FF00')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
            const guildparents = message.guild.channels.cache
            const categoriestout = guildparents.filter((salon) => salon.type === 'category')
            const categoriesId = categoriestout.map(categorie => categorie.id)
            const dbcatcmd = db.get('catcmd_' + message.guild.id)
            const channelID = db.get('channelcmd_' + message.guild.id)
            const channelclientID = db.get('channelcmdclient_' + message.guild.id)
            const guildchannels = message.guild.channels.cache.map(channel => channel.id)
            if (!categoriesId.includes(dbcatcmd) || !guildchannels.includes(channelID) || !guildchannels.includes(channelclientID)) {
                if (!categoriesId.includes(dbcatcmd)) {
                    await message.guild.channels.create('system_commandes', {
                        type: 'category'
                    }).then((categorie) => {
                        const idparent = categorie.id
                        db.set('catcmd_' + message.guild.id, idparent)
                    })
                    if (guildchannels.includes(channelID)) {
                        client.channels.cache.get(channelID).delete()
                        const parentid = db.get('catcmd_' + message.guild.id)
                        await message.guild.channels.create('commandes_clients', {
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
                                .setDescription('📮 **Les commandes vont maintenant apparaitres ici**\n\nVeuillez autoriser ce channel aux graphistes seulement pour éviter que des personnes non qualifiées puissent prendre des commandes\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                                .setColor('#00FF00')
                                .setFooter(config.version, client.user.avatarURL()))
                            db.set('channelcmd_' + message.guild.id, idchannel)
                        })
                    }
                    if (guildchannels.includes(channelclientID)) {
                        client.channels.cache.get(channelclientID).delete()
                        const parentid = db.get('catcmd_' + message.guild.id)
                        message.guild.channels.create('📮 passer_commande 📮', {
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
                                .setDescription('📮 **Pour passer commande taper `' + prefix + 'cmd [description brève et prix alloué à la commande]`**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                                .setColor('#00FF00')
                                .setFooter(config.version, client.user.avatarURL()))
                            const idchannel = channel.id
                            db.set('channelcmdclient_' + message.guild.id, idchannel)
                        })
                    }
                }
                if (!guildchannels.includes(channelID)) {
                    const parentid = db.get('catcmd_' + message.guild.id)
                    await message.guild.channels.create('commandes_clients', {
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
                            .setDescription('📮 **Les commandes vont maintenant apparaitres ici**\n\nVeuillez autoriser ce channel aux graphistes seulement pour éviter que des personnes non qualifiées puissent prendre des commandes\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                            .setColor('#00FF00')
                            .setFooter(config.version, client.user.avatarURL()))
                        db.set('channelcmd_' + message.guild.id, idchannel)
                    })
                }
                if (!guildchannels.includes(channelclientID)) {
                    const parentid = db.get('catcmd_' + message.guild.id)
                    message.guild.channels.create('📮 passer_commande 📮', {
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
                            .setDescription('📮 **Pour passer commande taper `' + prefix + 'cmd [description brève et prix alloué à la commande]`**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                            .setColor('#00FF00')
                            .setFooter(config.version, client.user.avatarURL()))
                        const idchannel = channel.id
                        db.set('channelcmdclient_' + message.guild.id, idchannel)
                    })
                }
                return message.channel.send(new Discord.MessageEmbed()
                    .setDescription('✅ **Le système de commande viens d\'être reconfiguré**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                    .setColor('#00FF00')
                    .setFooter(config.version, message.client.user.avatarURL()))
            } else {
                const off = args[0]
                if (db.has('catcmd_' + message.guild.id || db.has('channelcmd_' + message.guild.id)) || db.has('channelcmdclient_' + message.guild.id) || off === 'off') {
                    if (db.has('catcmd_' + message.guild.id)) {
                        client.channels.cache.get(dbcatcmd).delete()
                        db.delete('catcmd_' + message.guild.id)
                    }
                    if (db.has('channelcmd_' + message.guild.id)) {
                        client.channels.cache.get(channelID).delete()
                        db.delete('channelcmd_' + message.guild.id)
                    }
                    if (db.has('channelcmdclient_' + message.guild.id)) {
                        client.channels.cache.get(channelclientID).delete()
                        db.delete('channelcmdclient_' + message.guild.id)
                    }
                    return message.channel.send(new Discord.MessageEmbed()
                        .setDescription('✅ **Le système de commande a été désactivé**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                        .setColor('#00FF00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('🛑 **Vous n\'avez pas les permissions suffisantes**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }
}
