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
        if (args[0] === 'delete') {
            const cmdID = args[1]
            if (args[1]) {
                const cmd = db.get('cmd')
                const cmdid = cmd.find((cmd) => cmd.id === parseInt(cmdID))
                if (cmdid) {
                    if (cmdid.client === message.author.id) {
                        if (cmdid.statue === 'attente') {
                            cmd.find((cmd) => cmd.id === parseInt(cmdID)).statue = 'annulé'
                            // Écrire les modifications dans la base de données
                            db.set('cmd', cmd)
                            return message.channel.send(`✅ **Commande numéro : \`${cmdID}\` annulée !**`)
                        } else {
                            return message.channel.send('⚠️ **Seulement une commande qui n\'a pas encore été acceptée peut être annulée !**')
                        }
                    } else {
                        return message.channel.send(`⚠️ **La commande numéro : \`${cmdID}\` ne vous appartient pas !**`)
                    }
                } else {
                    return message.channel.send(`⚠️ **Commande numéro : \`${cmdID}\` inconnu !**`)
                }
            } else {
                return message.channel.send('⚠️ **Veuillez rentrer le numéro d\'une commande !**')
            }
        }
        const guildOUuser = args[0]
        let prixcmd = null
        let mdepcmd = null
        let delaicmd = null
        let descriptcmd = null
        const user = client.users.cache.find((element) => element.id === guildOUuser)
        const guild = client.guilds.cache.find((element) => element.id === guildOUuser)
        if (guildOUuser !== undefined) {
            if (!user && !guild) {
                return message.channel.send(`⚠️ **Utilisateur ou serveur avec l\'identifiant : \`${guildOUuser}\` inconnu !**`)
            }
            if (guild) {
                const guildchannels = client.guilds.cache.get(guildOUuser).channels.cache
                const channelstout = guildchannels.filter((salon) => salon.type === 'text')
                const channelsId = channelstout.map(channels => channels.id)
                const channelCMD = db.get('channelcmd_' + guildOUuser)
                if (!channelCMD) {
                    return message.channel.send('⚠️ **Le système de commande n\'est pas initialisé sur le serveur sélectionné !**')
                }
                if (!channelsId.includes(channelCMD)) {
                    return message.channel.send('⚠️ **Le système de commande est invalide sur le serveur sélectionné !**')
                }
            }
        }
        message.channel.send(new Discord.MessageEmbed()
            .setDescription('📮 **Commande activé ' + message.author.tag + ' !**\n\nVeuillez répondre aux questions envoyées pour finaliser l\'enregistrement de votre commande !')
            .setColor('FF7B00')
            .setFooter(config.version, message.client.user.avatarURL()))

        const channelMP = await message.author.createDM()
        channelMP.send('**Quelle prix souhaitez-vous ? (en euro/s)**')
        const collector = channelMP.createMessageCollector(
            m => m.author.id === message.author.id,
            {
                time: 120000 // 2 minutes
            }
        )
        collector.on('collect', async msg => {
            if (!prixcmd) {
                if (isNaN(msg.content)) {
                    return channelMP.send('⚠️ **Le prix de votre commande doit être seulement exprimé par un nombre positif !**')
                }
                prixcmd = msg.content
                channelMP.send(`✅ **Le prix de votre commande sera de **\`${prixcmd}€\`** !**`)

                channelMP.send('**Quelle mode de paiement souhaitez-vous ?**')
                return
            }
            if (!mdepcmd) {
                mdepcmd = msg.content
                channelMP.send(`✅ **Le mode de paiement pour votre commande sera par **\`${mdepcmd}\`** !**`)

                channelMP.send('**Quelle délai maximum souhaitez-vous ? (en jour/s)**')
                return
            }
            if (!delaicmd) {
                if (isNaN(msg.content)) {
                    return channelMP.send('⚠️ **Le délai maximum pour votre commande doit être seulement exprimé par un nombre positif !**')
                }
                delaicmd = msg.content
                channelMP.send(`✅ **Le délai maximum pour votre commande sera de **\`${delaicmd}\`** jour/s !**`)
                // questionnaire delai

                // questionnaire description
                channelMP.send('**Quelle est la description de votre commande ? (minimum 15 caractères, maximum 500 caractères)**')
                return
            }
            if (!descriptcmd) {
                // questionnaire description
                if (msg.content.length > 14 && msg.content.length < 500) {
                    descriptcmd = msg.content
                    channelMP.send(`✅ **La description de votre commande sera : **\`${descriptcmd}\`** !**`)
                    collector.stop()
                    let id = 1
                    if (db.has('cmd')) {
                        id = db.get('cmd').length + 1
                    }
                    if (guildOUuser > 0) {
                        db.push('cmd', {
                            id: id,
                            descript: descriptcmd,
                            prix: prixcmd,
                            mdep: mdepcmd,
                            delai: delaicmd,
                            guildOUuser: guildOUuser,
                            client: message.author.id,
                            prestataire: null,
                            statue: 'attente',
                            transcript: null
                        })
                        message.author.createDM().then(channel => {
                            channel.send(new Discord.MessageEmbed()
                                .setDescription(`📮 **Commande (\`${id}\`) enregistré !**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${message.author.id}>\n\n**-Serveur ou utilisateur concerné : **<@${guildOUuser}>`)
                                .setColor('#FF7B00')
                                .setFooter(config.version, message.client.user.avatarURL()))
                            channel.send(`**Pour annuler cette commande, tapez : **\`${prefix}cmd delete ${id}\`**.**`)
                        })
                        if (user) {
                            client.users.cache.get(guildOUuser).send(new Discord.MessageEmbed()
                                .setDescription(`📮 **Commande (\`${id}\`)**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${message.author.id}>\n\n**-Serveur ou utilisateur concerné : **<@${guildOUuser}>`)
                                .setColor('#FF7B00')
                                .setFooter(config.version, client.user.avatarURL())).then((msg) => {
                                msg.react('📩')
                            })
                        }
                        if (guild) {
                            const channelCMD = db.get('channelcmd_' + guildOUuser)
                            message.client.channels.cache.get(channelCMD).send(new Discord.MessageEmbed()
                                .setDescription(`📮 **Commande (\`${id}\`)**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${message.author.id}>\n\n**-Serveur ou utilisateur concerné : **<@${guildOUuser}>`)
                                .setColor('#FF7B00')
                                .setFooter(config.version, client.user.avatarURL())).then((msg) => {
                                msg.react('📩')
                            })
                        }
                    } else {
                        db.push('cmd', {
                            id: id,
                            descript: descriptcmd,
                            prix: prixcmd,
                            mdep: mdepcmd,
                            delai: delaicmd,
                            guildOUuser: null,
                            client: message.author.id,
                            prestataire: null,
                            statue: 'attente',
                            transcript: null
                        })
                        message.author.createDM().then(channel => {
                            channel.send(new Discord.MessageEmbed()
                                .setDescription(`📮 **Commande (\`${id}\`) enregistré !**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${message.author.tag}>`)
                                .setColor('#FF7B00')
                                .setFooter(config.version, message.client.user.avatarURL()))
                            channel.send(`**Pour annuler cette commande, tapez : **\`${prefix}cmd delete ${id}\`**.**`)
                        })
                        message.client.channels.cache.get('829074299406909481').send(new Discord.MessageEmbed()
                            .setDescription(`📮 **Commande (\`${id}\`)**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${message.author.tag}>`)
                            .setColor('#FF7B00')
                            .setFooter(config.version, client.user.avatarURL())).then((msg) => {
                            msg.react('📩')
                        })
                    }
                } else {
                    channelMP.send('⚠️ **La description de votre commande doit faire au minimum 15 caractères et au maximum 500 caractères !**')
                }
            }
        })
        collector.on('end', (_, raison) => {
            if (raison === 'time') {
                channelMP.send('⚠️ **Temps imparti écoulé, votre commande a été désactivé !**')
            }
        })
    }
}
