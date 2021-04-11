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
            const guildparents = message.guild.channels.cache
            const categoriestout = guildparents.filter((salon) => salon.type === 'category')
            const categoriesId = categoriestout.map(categorie => categorie.id)
            const dbcatcmd = db.get('parent_' + message.guild.id)
            const channelID = db.get('channelcmd_' + message.guild.id)
            const channelclientID = db.get('channelcmdclient_' + message.guild.id)
            const guildchannels = message.guild.channels.cache.map(channel => channel.id)
            let parent = false
            let channelcmd = false
            let channelcmdclient = false
            if (db.has('parent_' + message.guild.id) && db.has('channelcmd_' + message.guild.id) && db.has('channelcmdclient_' + message.guild.id)) {
                if (!categoriesId.includes(dbcatcmd) || !guildchannels.includes(channelID) || !guildchannels.includes(channelclientID)) {
                    if (categoriesId.includes(dbcatcmd)) {
                        parent = true
                    }
                    if (guildchannels.includes(channelID)) {
                        channelcmd = true
                    }
                    if (guildchannels.includes(channelclientID)) {
                        channelcmdclient = true
                    }
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
            }

            if (parent === true) {
                client.channels.cache.get(dbcatcmd).delete()
                db.delete('parent_' + message.guild.id)
            }
            if (channelcmd === true) {
                client.channels.cache.get(channelID).delete()
                db.delete('channelcmd_' + message.guild.id)
            }
            if (channelcmdclient === true) {
                client.channels.cache.get(channelclientID).delete()
                db.delete('channelcmdclient_' + message.guild.id)
            }
            // configuration

            await message.guild.channels.create('📨- commandes', {
                type: 'category'
            }).then((categorie) => {
                const idparent = categorie.id
                db.set('parent_' + message.guild.id, idparent)
            })
            const parentid = db.get('parent_' + message.guild.id)
            message.guild.channels.create('📩 commandes clients', {
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: [
                            'VIEW_CHANNEL'
                        ]
                    }
                ],
                type: 'text',
                parent: parentid
            }).then((channel) => {
                channel.send(new Discord.MessageEmbed()
                    .setDescription('📩 **Les commandes pour ce serveur vont maintenant apparaitres ici !**\n\nVeuillez autoriser ce channel aux personnes compétentes seulement pour éviter que des personnes non qualifiées puissent prendre des commandes')
                    .setColor('#FF7B00')
                    .setFooter(config.version, client.user.avatarURL()))
                const idchannel = channel.id
                db.set('channelcmd_' + message.guild.id, idchannel)
            })
            message.guild.channels.create('📮 passer commande', {
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

            // configuration
            message.channel.send('✅ **Système de commande configuré !**')
        } else {
            message.channel.send('⛔ **Vous n\'avez pas les permissions suffisantes !**')
        }
    }
}
