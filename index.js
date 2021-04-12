const Discord = require('discord.js')
const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})
const config = require('./config.json')
const fs = require('fs')
const Database = require('easy-json-database')
const db = new Database('./database.json')
const dbLogs = new Database('./database_logs.json')
const hastebin = require('hastebin-gen')

client.login(config.token)
client.commands = new Discord.Collection()

const Sentry = require('@sentry/node')
Sentry.init({
    dsn: config.dsn
})

/* const express = require('express')
const app = express()
const port =

app.get('/', (req, res) => {
    res.send(`<html>
    <head></head>
    <body>
        <font size=""><font face="FreeMono, monospace">Un système de prise de commande intelligent, un enregistrement de création, Visual Bot est fait pour vous ! Utilisé sur ${client.guilds.cache.size} serveurs actuellement !</font></font>
    </body>
</html>`)
})

app.listen(port, () => {
    console.log(`GraphBot écoute le web sur le port ${port}`)
}) */

// Système qui gère les commandes dans le dossier

fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(file.split('.')[0], command)
    })
})

// Système qui gère les commandes dans le dossier

// Système qui dirige les commandes tapées

client.on('message', async message => {
    if (message.channel.type !== 'dm') {
        const channelID = db.get('channelcmdclient_' + message.guild.id)
        if (message.channel.id === channelID) {
            await message.channel.messages.fetch()
            const numbermessage = message.channel.messages.cache.size
            if (numbermessage !== 1) {
                message.delete({ timeout: 10000 })
            }
        }
    }
    if (message.type !== 'DEFAULT' || message.author.bot) return
    // système verification blacklist
    let prefix = config.prefix
    if (message.channel.type !== 'dm') {
        if (db.has('prefix_' + message.guild.id)) {
            prefix = db.get('prefix_' + message.guild.id)
        }
    }
    if (message.content.startsWith(prefix + 'cmd') || message.content.startsWith(prefix + 'help') || message.content.startsWith(prefix + 'info') || message.content.startsWith(prefix + 'init') || message.content.startsWith(prefix + 'say') || message.content.startsWith(prefix + 'setprefix')) {
        const usersblacklist = db.get('blacklist')
        if (usersblacklist.includes(message.author.id)) {
            if (message.channel.type !== 'dm') {
                return message.delete()
            } else {
                return
            }
        }
    }
    // système verification blacklist
    if (message.channel.type === 'dm') {
        if (message.content.startsWith(prefix + 'blacklist') || message.content.startsWith(prefix + 'init') || message.content.startsWith(prefix + 'setprefix')) {
            return message.channel.send('⚠️ **Cette commande doit être tapée sur un serveur obligatoirement !**')
        } else {
            const args = message.content.trim().split(/ +/g)
            const commandName = args.shift().toLowerCase()
            if (!commandName.startsWith(prefix)) return
            const command = client.commands.get(commandName.slice(prefix.length))
            if (!command) return
            command.run(db, message, args, client, dbLogs)
            dbLogs.push('logs', {
                date: Date.now(),
                cmd: commandName.slice(prefix.length),
                userId: message.author.id
            })
        }
    } else {
        const args = message.content.trim().split(/ +/g)
        const commandName = args.shift().toLowerCase()
        if (!commandName.startsWith(prefix)) return
        const command = client.commands.get(commandName.slice(prefix.length))
        if (!command) return
        command.run(db, message, args, client, dbLogs)
        dbLogs.push('logs', {
            date: Date.now(),
            cmd: commandName.slice(prefix.length),
            userId: message.author.id
        })
    }
})

// Système qui dirige les commandes tapées

// Système qui envoie un message quand le bot est ajouté sur un serveur

client.on('guildCreate', (guild) => {
    const user = guild.ownerID
    client.users.cache.get(user).send(new Discord.MessageEmbed()
        .setDescription(`❤️ **Installation**\n\nBonjour,\n\nMerci d’avoir ajouté visualOrder à votre serveur !\n\nSi vous avez des questions avec le bot, le **[support](https://discord.gg/sKJbqSW)** sera ravi de pouvoir vous aidez !\n\nL’équipe de visualOrder.\n\n**Pour configurer automatiquement visualOrder sur **\`${guild.name}\`(\`${guild.id}\`)**, cliquez sur la réaction : ❤️**`)
        .setColor('FF7B00')
        .setFooter(config.version, client.user.avatarURL())).then((msg) => {
        msg.react('❤️')
    })
})

// Système qui envoie un message quand le bot est ajouté sur un serveur

// Système reaction

client.on('messageReactionAdd', async (reaction, user) => {
    if (!user.bot) {
    } else { return }
    await reaction.fetch()
    if (reaction.message.author.id === client.user.id) {
    // système verification blacklist
        if (reaction.emoji.name === '📩' || reaction.emoji.name === '🔒' || reaction.emoji.name === '🗑️' || reaction.emoji.name === '☢️' || reaction.emoji.name === '📪') {
            const usersblacklist = db.get('blacklist')
            if (usersblacklist.includes(user.id)) {
                return
            }
        }
        // système verification blacklist

        dbLogs.push('reaction', {
            date: Date.now(),
            reaction: reaction.emoji.name,
            user: user.id
        })

        let prefix = config.prefix
        if (reaction.message.channel.type !== 'dm') {
            if (db.has('prefix_' + reaction.message.guild.id)) {
                prefix = db.get('prefix_' + reaction.message.guild.id)
            }
        }

        // Système qui initialise visualOrder automatiquement

        if (reaction.emoji.name === '❤️') {
            const description = reaction.message.embeds[0].description
            const guildid = description.substring(
                description.lastIndexOf('(\`') + 2,
                description.lastIndexOf('\`)')
            )
            const guild = client.guilds.cache.get(guildid)

            if (db.has('parent_' + guild.id)) {
                db.delete('parent_' + guild.id)
            }
            if (db.has('channelcmd_' + guild.id)) {
                db.delete('channelcmd_' + guild.id)
            }
            if (db.has('channelcmdclient_' + guild.id)) {
                db.delete('channelcmdclient_' + guild.id)
            }
            // création catégorie
            await guild.channels.create('📨- commandes', {
                type: 'category'
            }).then((categorie) => {
                const idparent = categorie.id
                db.set('parent_' + guild.id, idparent)
            })
            // création catégorie
            // création commande clients
            const parentid = db.get('parent_' + guild.id)
            guild.channels.create('📩 commandes clients', {
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [
                            'VIEW_CHANNEL'
                        ]
                    }
                ],
                type: 'text',
                parent: parentid
            }).then((channel) => {
                channel.send(new Discord.MessageEmbed()
                    .setDescription('📩 **Les commandes pour ce serveur vont maintenant apparaître ici !**\n\nVeuillez autoriser ce channel aux personnes compétentes seulement pour éviter que des personnes non qualifiées puissent prendre des commandes')
                    .setColor('#FF7B00')
                    .setFooter(config.version, client.user.avatarURL()))
                const idchannel = channel.id
                db.set('channelcmd_' + guild.id, idchannel)
            })
            // création commande clients
            // création passer commande
            guild.channels.create('📮 passer commande', {
                type: 'text',
                parent: parentid
            }).then((channel) => {
                channel.send(new Discord.MessageEmbed()
                    .setDescription(`📮 **Pour passer commande aux prestataires de ce serveur, tapez \`${prefix}cmd ${guild.id}\` !**`)
                    .setColor('#FF7B00')
                    .setFooter(config.version, client.user.avatarURL()))
                const idchannel = channel.id
                db.set('channelcmdclient_' + guild.id, idchannel)
            })
            // création passer commande
            return reaction.message.channel.send(new Discord.MessageEmbed()
                .setDescription(`✅ **Système de commande configuré !**\n\nPour finaliser la configuration du bot sur ${guild.name}, la partie **[installation](https://docs.visualorder.fr/installation)** de la documentation vous indiquera la dernière étape à effectuer !\n\n**(n\'hésitez pas à faire un tour complet de la doc pour connaître toutes les fonctionnalités du bot)**`)
                .setColor('FF7B00')
                .setFooter(config.version, client.user.avatarURL()))
        }

        // Système qui initialise visualOrder automatiquement

        // Système qui gère la création des tickets pour le système de commande

        if (reaction.emoji.name === '📩') {
            const description = reaction.message.embeds[0].description
            const cmdID = description.substring(
                description.lastIndexOf('(\`') + 2,
                description.lastIndexOf('\`)')
            )
            const cmd = db.get('cmd')
            const cmdid = cmd.find((cmd) => cmd.id === parseInt(cmdID))
            const prestataireconcernecmd = cmdid.prestataireconcerne
            const guildconcernecmd = cmdid.guildconcerne
            const prixcmd = cmdid.prix
            const mdepcmd = cmdid.mdep
            const delaicmd = cmdid.delai
            const descriptcmd = cmdid.descript
            const clientcmd = cmdid.client
            cmd.find((cmd) => cmd.id === parseInt(cmdID)).prestataire = user.id
            // Écrire les modifications dans la base de données
            db.set('cmd', cmd)
            const prestatairecmd = cmdid.prestataire
            cmd.find((cmd) => cmd.id === parseInt(cmdID)).statut = 'acceptée'
            // Écrire les modifications dans la base de données
            db.set('cmd', cmd)
            const guild = client.guilds.cache.find((element) => element.id === guildconcernecmd)
            let guildid = '764869621982691329'
            let parentid = '819631253670068234'
            if (guild) {
                const guildparents = client.guilds.cache.get(guildconcernecmd).channels.cache
                const parentstout = guildparents.filter((salon) => salon.type === 'category')
                const parentsId = parentstout.map(parents => parents.id)
                const parentsCMD = db.get('parent_' + guildconcernecmd)
                if (parentsCMD) {
                    if (parentsId.includes(parentsCMD)) {
                        guildid = guildconcernecmd
                        parentid = parentsCMD
                    } else {
                        reaction.message.channel.send('⚠️ **Le système de commande est invalide sur le serveur sélectionné !**')
                    }
                } else {
                    reaction.message.channel.send('⚠️ **Le système de commande n\'est pas initialisé sur le serveur sélectionné !**')
                }
            }
            client.guilds.cache.get(guildid).channels.create('cmd_' + cmdID, {
                parent: parentid,
                permissionOverwrites: [
                    {
                        id: guildid,
                        deny: [
                            'VIEW_CHANNEL'
                        ]
                    },
                    {
                        id: user.id,
                        allow: [
                            'VIEW_CHANNEL',
                            'ATTACH_FILES'
                        ]
                    },
                    {
                        id: clientcmd,
                        allow: [
                            'VIEW_CHANNEL',
                            'ATTACH_FILES'
                        ]
                    }
                ]
            }).then((channel) => {
                channel.send(new Discord.MessageEmbed()
                    .setDescription(`📮 **Commande (\`${cmdID}\`)**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${clientcmd}>\n\n**-Prestataire : **<@${prestatairecmd}>\n\n**Pour fermer le ticket, le client __et__ le prestataire doivent cliquer sur la réaction 🔒\n\nPour signaler un des membres de la commande, cliquez sur la réaction ☢️\n\nBonne commande !**`)
                    .setColor('#FF7B00')
                    .setFooter(config.version, client.user.avatarURL())).then(msg => {
                    msg.react('🔒')
                    msg.react('☢️')
                })
                channel.createInvite({
                    maxAge: 172800
                }).then(invite => {
                    client.users.cache.get(clientcmd).send(`📩 **Commande (\`${cmdID}\`) acceptée, cliquez sur l'invitation pour rejoindre le ticket : ${invite} !**`)
                    client.users.cache.get(user.id).send(`📩 **Commande (\`${cmdID}\`) acceptée, cliquez sur l'invitation pour rejoindre le ticket : ${invite} !**`)
                })
                cmd.find((cmd) => cmd.id === parseInt(cmdID)).channel = channel.id
                // Écrire les modifications dans la base de données
                db.set('cmd', cmd)
                client.channels.cache.get('829764751084748811').send(`📩 **Commande (\`${cmdID}\`) acceptée**`)
            })
            reaction.message.delete()
        }

        // Système qui gère la création des tickets pour le système de commande

        // Système qui gère l'annulation de commande

        if (reaction.emoji.name === '🗑️') {
            const description = reaction.message.embeds[0].description
            const cmdID = description.substring(
                description.lastIndexOf('(\`') + 2,
                description.lastIndexOf('\`)')
            )
            const cmd = db.get('cmd')
            const cmdid = cmd.find((cmd) => cmd.id === parseInt(cmdID))
            if (cmdid.statut === 'attente') {
                cmd.find((cmd) => cmd.id === parseInt(cmdID)).statut = 'annulée'
                // Écrire les modifications dans la base de données
                db.set('cmd', cmd)
                const channelmessagecmd = cmdid.channelmessage
                const messagecmd = cmdid.message
                await client.channels.cache.get(channelmessagecmd).messages.fetch()
                client.channels.cache.get(channelmessagecmd).messages.cache.get(messagecmd).delete()
                return reaction.message.channel.send(`🗑️ **Commande numéro : \`${cmdID}\` annulée !**`)
            } else {
                return reaction.message.channel.send('⚠️ **Seulement une commande qui n\'a pas encore été acceptée peut-être annulée !**')
            }
        }

        // Système qui gère l'annulation de commande

        // Système qui gère le refus des commandes

        if (reaction.emoji.name === '📪') {
            const description = reaction.message.embeds[0].description
            const cmdID = description.substring(
                description.lastIndexOf('(\`') + 2,
                description.lastIndexOf('\`)')
            )
            const cmd = db.get('cmd')
            const cmdid = cmd.find((cmd) => cmd.id === parseInt(cmdID))
            if (cmdid.statut === 'attente') {
                cmd.find((cmd) => cmd.id === parseInt(cmdID)).statut = 'refusée'
                // Écrire les modifications dans la base de données
                db.set('cmd', cmd)
                const channelmessagecmd = cmdid.channelmessage
                const messagecmd = cmdid.message
                await client.channels.cache.get(channelmessagecmd).messages.fetch()
                client.channels.cache.get(channelmessagecmd).messages.cache.get(messagecmd).delete()
                client.users.cache.get(cmdid.client).send(`📪 **Commande numéro : \`${cmdID}\` refusée !**`)
            } else {
                return reaction.message.channel.send('⚠️ **Seulement une commande qui n\'a pas encore été acceptée peut-être refusée !**')
            }
        }

        // Système qui gère le refus des commandes

        // Système qui gère la fermeture des tickets
        if (reaction.message.channel.type !== 'dm') {
            if (reaction.message.channel.name.startsWith('cmd_') && !reaction.message.channel.name.startsWith('cmd_signalement_')) {
                if (reaction.emoji.name === '🔒') {
                    const description = reaction.message.embeds[0].description
                    const cmdID = description.substring(
                        description.lastIndexOf('(\`') + 2,
                        description.lastIndexOf('\`)')
                    )
                    const cmd = db.get('cmd')
                    const cmdid = cmd.find((cmd) => cmd.id === parseInt(cmdID))
                    const clientcmd = cmdid.client
                    const prestatairecmd = cmdid.prestataire
                    const verifReact = reaction.users.cache.map((element) => element.id)
                    if (verifReact.includes(clientcmd) && verifReact.includes(prestatairecmd)) {
                        cmd.find((cmd) => cmd.id === parseInt(cmdID)).statut = 'fermée'
                        // Écrire les modifications dans la base de données
                        db.set('cmd', cmd)
                        reaction.message.channel.messages.fetch()
                        const content = '[Transcript messages channel : ' + reaction.message.channel.id + ' / serveur : ' + reaction.message.guild.id + ' / membres : ' + reaction.message.channel.members.array().map((member) => member.id) + ' ]\n\n' + reaction.message.channel.messages.cache.map((c) => `${c.author.tag} (${c.author.id}) : ${c.content} ${c.embeds}`).join('\n\n')
                        hastebin(content, { url: 'https://hastebin.androz2091.fr/', extension: 'txt' }).then(haste => {
                            cmd.find((cmd) => cmd.id === parseInt(cmdID)).transcript = haste
                            // Écrire les modifications dans la base de données
                            db.set('cmd', cmd)
                        })
                        reaction.message.channel.delete()
                        client.users.cache.get(clientcmd).send(`🔒 **Commande (\`${cmdID}\`) fermée avec succès !**`)
                        client.users.cache.get(prestatairecmd).send(`🔒 **Commande (\`${cmdID}\`) fermée avec succès !**`)
                        client.channels.cache.get('829764790812672070').send(`🔒 **Commande (\`${cmdID}\`) fermée**`)
                    }
                }

                // Système qui gère la fermeture des tickets

                // Système qui gère le signalement des membres

                if (reaction.emoji.name === '☢️') {
                    const description = reaction.message.embeds[0].description
                    const cmdID = description.substring(
                        description.lastIndexOf('(\`') + 2,
                        description.lastIndexOf('\`)')
                    )
                    const cmd = db.get('cmd')
                    const cmdid = cmd.find((cmd) => cmd.id === parseInt(cmdID))
                    const prixcmd = cmdid.prix
                    const mdepcmd = cmdid.mdep
                    const delaicmd = cmdid.delai
                    const descriptcmd = cmdid.descript
                    const clientcmd = cmdid.client
                    const prestatairecmd = cmdid.prestataire
                    let transcriptcmd = cmdid.transcript
                    cmd.find((cmd) => cmd.id === parseInt(cmdID)).statut = 'signalée'
                    // Écrire les modifications dans la base de données
                    db.set('cmd', cmd)
                    const content = '[Transcript messages channel : ' + reaction.message.channel.id + ' / serveur : ' + reaction.message.guild.id + ' / membres : ' + reaction.message.channel.members.array().map((member) => member.id) + ' ]\n\n' + reaction.message.channel.messages.cache.map((c) => `${c.author.tag} (${c.author.id}) : ${c.content} ${c.embeds}`).join('\n\n')
                    hastebin(content, { url: 'https://hastebin.androz2091.fr/', extension: 'txt' }).then(haste => {
                        cmd.find((cmd) => cmd.id === parseInt(cmdID)).transcript = haste
                        // Écrire les modifications dans la base de données
                        db.set('cmd', cmd)
                        transcriptcmd = haste
                    })
                    client.guilds.cache.get('764869621982691329').channels.create('cmd_signalement_' + cmdID, {
                        parent: '819631253670068234',
                        permissionOverwrites: [
                            {
                                id: '764869621982691329',
                                deny: [
                                    'VIEW_CHANNEL'
                                ]
                            },
                            {
                                id: user.id,
                                allow: [
                                    'VIEW_CHANNEL',
                                    'ATTACH_FILES'
                                ]
                            }
                        ]
                    }).then((channel) => {
                        channel.send(new Discord.MessageEmbed()
                            .setDescription(`☢️ **Commande (\`${cmdID}\`)**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${clientcmd}>\n\n**-Prestataire : **<@${prestatairecmd}>\n\n**-Transcript : ${transcriptcmd}**\n\n**Bonjour, veuillez écrire le pourquoi de votre signalement.**`)
                            .setColor('FF7B00')
                            .setFooter(config.version, reaction.message.client.user.avatarURL())).then((msg) => {
                            msg.react('🔒')
                        })
                        channel.createInvite({
                            maxAge: 172800
                        }).then(invite => {
                            client.users.cache.get(user.id).send(`☢️ **Signalement envoyé avec succès, cliquez sur l'invitation pour rejoindre le ticket : ${invite} !**`)
                        })
                        if (user.id === clientcmd) {
                            client.users.cache.get(prestatairecmd).send(`☢️ **Commande (\`${cmdID}\`) signalée par <@${user.id}>. Vous recevrez un prochain message vous informant des sanctions prises !**`)
                        }
                        if (user.id === prestatairecmd) {
                            client.users.cache.get(clientcmd).send(`☢️ **Commande (\`${cmdID}\`) signalée par <@${user.id}>. Vous recevrez un prochain message vous informant des sanctions prises !**`)
                        }
                        client.channels.cache.get('829764837625954315').send(`☢️ **Commande (\`${cmdID}\`) signalée**`)
                    })
                    reaction.message.channel.delete()
                }

                // Système qui gère le signalement des membres
            }
            if (reaction.message.channel.name.startsWith('cmd_signalement_')) {
                if (reaction.emoji.name === '🔒') {
                    if (reaction.message.member.hasPermission('MANAGE_GUILD')) {
                        const description = reaction.message.embeds[0].description
                        const cmdID = description.substring(
                            description.lastIndexOf('(\`') + 2,
                            description.lastIndexOf('\`)')
                        )
                        reaction.message.channel.messages.fetch()
                        const content = '[Transcript messages channel : ' + reaction.message.channel.id + ' / serveur : ' + reaction.message.guild.id + ' / membres : ' + reaction.message.channel.members.array().map((member) => member.id) + ' ]\n\n' + reaction.message.channel.messages.cache.map((c) => `${c.author.tag} (${c.author.id}) : ${c.content} ${c.embeds}`).join('\n\n')
                        hastebin(content, { url: 'https://hastebin.androz2091.fr/', extension: 'txt' }).then(haste => {
                            client.channels.cache.get('829764963828498482').send(`☢️ **Ticket signalement pour commande (\`${cmdID}\`) fermé par <@${user.id}> / transcript : ${haste}**`)
                        })
                        reaction.message.channel.delete()
                    } else {
                        reaction.message.channel.send('⛔ **Vous n\'avez pas les permissions suffisantes !**')
                    }
                }
            }
        }
    }
})

// Système reaction

// Système qui gère les sauvegardes de la base de données

const CronJob = require('cron').CronJob
const { brotliDecompress } = require('zlib')
const job = new CronJob('0 0 0 * * *', function () {
    const date = new Date()

    fs.writeFileSync('./backupdatabase/' + date.getDate() + '-' + (date.getMonth() + 1) + '.json', JSON.stringify(db.data, null, 2), 'utf-8')
}, null, true, 'Europe/Paris')
job.start()

// Système qui gère les sauvegardes de la base de données

// Système activé lors du démarrage du bot

client.on('ready', async () => {
    client.channels.cache.get('775274490723827715').messages.fetch()

    Object.keys(dbLogs.data).forEach(element => {
        if (element.startsWith('channelcmd_')) {
            const channelID = dbLogs.data[element]
            const channel = client.channels.cache.get(channelID)
            if (!channel) return
            channel.messages.fetch()
        }
    })

    // Système qui gère le jeu du bot

    client.user.setActivity('visualorder.fr / -help', { type: 'PLAYING' })

    // Système qui gère le jeu du bot

    console.log('✅ bot connecté ✅')
})

// Système activé lors du démarrage du bot
