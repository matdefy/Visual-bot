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
    if (message.content.startsWith(prefix + 'addcrea') || message.content.startsWith(prefix + 'addpreuve') || message.content.startsWith(prefix + 'cmd') || message.content.startsWith(prefix + 'descript') || message.content.startsWith(prefix + 'eval') || message.content.startsWith(prefix + 'filigrane') || message.content.startsWith(prefix + 'help') || message.content.startsWith(prefix + 'info') || message.content.startsWith(prefix + 'init') || message.content.startsWith(prefix + 'level') || message.content.startsWith(prefix + 'say') || message.content.startsWith(prefix + 'setadvance') || message.content.startsWith(prefix + 'setprefix') || message.content.startsWith(prefix + 'tickets') || message.content.startsWith(prefix + 'validcrea') || message.content.startsWith(prefix + 'viewcrea') || message.content.startsWith(prefix + 'viewpreuve')) {
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
        if (message.content.startsWith(prefix + 'blacklist') || message.content.startsWith(prefix + 'init') || message.content.startsWith(prefix + 'level') || message.content.startsWith(prefix + 'setprefix') || message.content.startsWith(prefix + 'tickets') || message.content.startsWith(prefix + 'validcrea')) {
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
        if (message.content.startsWith(prefix + 'addcrea') || message.content.startsWith(prefix + 'addpreuve') || message.content.startsWith(prefix + 'setadvance') || message.content.startsWith(prefix + 'viewpreuve')) {
            return message.channel.send('⚠️ **Cette commande doit être tapée dans le salon MP de Visual Bot obligatoirement !**')
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
    }
})

// Système qui dirige les commandes tapées

// Système qui envoie un message quand le bot est ajouté sur un serveur

client.on('guildCreate', (guild) => {
    const channelInvite = guild.channels.cache.filter((channel) => channel.type !== 'category').first()
    channelInvite.createInvite({
        maxAge: 0
    }).then(invite => {
        client.channels.cache.get('819631330266185819').send(`Le bot est sur le serveur ${guild.name}, avec ${guild.memberCount} membres ! **❤️Merci❤️**\n\n**Invitation :** https://discord.gg/` + invite.code)
    })
    dbLogs.push('guild', {
        date: Date.now(),
        guild: guild.name
    })
    console.log(channelInvite)
})

// Système qui envoie un message quand le bot est ajouté sur un serveur

// Système reaction

client.on('messageReactionAdd', async (reaction, user) => {
    if (!user.bot) {
    } else { return }
    await reaction.fetch()
    if (reaction.message.author.id === client.user.id) {
    // système verification blacklist
        if (reaction.emoji.name === '📊' || reaction.emoji.name === '🇧' || reaction.emoji.name === '⚙️' || reaction.emoji.name === '🇦' || reaction.emoji.name === '4️⃣' || reaction.emoji.name === '3️⃣' || reaction.emoji.name === '2️⃣' || reaction.emoji.name === '🖼️' || reaction.emoji.name === '1️⃣' || reaction.emoji.name === '💬' || reaction.emoji.name === 'ℹ️' || reaction.emoji.name === '⌨️' || reaction.emoji.name === '☑️' || reaction.emoji.name === '✅' || reaction.emoji.name === '🔒' || reaction.emoji.name === '📝' || reaction.emoji.name === '☢️' || reaction.emoji.name === '🤖') {
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

        // Système qui gère la création des tickets pour le système de commande

        if (reaction.emoji.name === '📩') {
            const description = reaction.message.embeds[0].description
            const cmdID = description.substring(
                description.lastIndexOf('(\`') + 2,
                description.lastIndexOf('\`)')
            )
            const cmd = db.get('cmd')
            const cmdid = cmd.find((cmd) => cmd.id === parseInt(cmdID))
            const guildOUuser = cmdid.guildOUuser
            const prixcmd = cmdid.prix
            const mdepcmd = cmdid.mdep
            const delaicmd = cmdid.delai
            const descriptcmd = cmdid.descript
            const clientcmd = cmdid.client
            const statuecmd = cmdid.statue
            if (statuecmd === 'annulé') {
                return client.users.cache.get(clientcmd).send(`⚠️ **Commande numéro : \`${cmdID}\` annulé par le client !**`)
            }
            cmd.find((cmd) => cmd.id === parseInt(cmdID)).prestataire = user.id
            // Écrire les modifications dans la base de données
            db.set('cmd', cmd)
            const prestatairecmd = cmdid.prestataire
            cmd.find((cmd) => cmd.id === parseInt(cmdID)).statue = 'accepté'
            // Écrire les modifications dans la base de données
            db.set('cmd', cmd)
            reaction.message.client.channels.cache.get('776063705480691722').send(`📩 **Commande (\`${cmdID}\`) accepté par <@${prestatairecmd}>**`)
            if (guildOUuser !== null) {
                const user1 = client.users.cache.find((element) => element.id === guildOUuser)
                const guild = client.guilds.cache.find((element) => element.id === guildOUuser)
                if (user1 || guild) {
                    if (user1) {
                        client.guilds.cache.get('764869621982691329').channels.create('cmd_' + cmdID, {
                            parent: '819631253670068234',
                            permissionOverwrites: [
                                {
                                    id: '764869621982691329',
                                    deny: [
                                        'VIEW_CHANNEL',
                                        'ATTACH_FILES'
                                    ]
                                },
                                {
                                    id: user.id,
                                    allow: [
                                        'VIEW_CHANNEL',
                                        'ATTACH_FILES',
                                        'MANAGE_CHANNELS',
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
                                .setDescription(`📮 **Commande (\`${cmdID}\`)**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${clientcmd}>\n\n**-Prestataire : **<@${prestatairecmd}>\n\n**Pour fermer le ticket, cliquer sur la réaction 🔒\nPour signaler un des membres de la commande, cliquer sur la réaction ☢️\n\nBonne commande !**`)
                                .setColor('#FF7B00')
                                .setFooter(config.version, client.user.avatarURL())).then(msg => {
                                msg.react('🔒')
                                msg.react('☢️')
                            })
                            channel.createInvite({
                                maxAge: 172800
                            }).then(invite => {
                                client.users.cache.get(clientcmd).send(`📩 **Commande (\`${cmdID}\`) accepté, cliquez sur l'invitation pour rejoindre le ticket : ${invite} !**`)
                                client.users.cache.get(user.id).send(`📩 **Commande (\`${cmdID}\`) accepté, cliquez sur l'invitation pour rejoindre le ticket : ${invite} !**`)
                            })
                        })
                        reaction.message.delete()
                    }
                    if (guild) {
                        const guildparents = client.guilds.cache.get(guildOUuser).channels.cache
                        const parentstout = guildparents.filter((salon) => salon.type === 'category')
                        const parentsId = parentstout.map(parents => parents.id)
                        const parentsCMD = db.get('catcmd_' + guildOUuser)
                        if (parentsCMD) {
                            if (parentsId.includes(parentsCMD)) {
                                client.guilds.cache.get(guildOUuser).channels.create('cmd_' + cmdID, {
                                    parent: parentsCMD,
                                    permissionOverwrites: [
                                        {
                                            id: guildOUuser,
                                            deny: [
                                                'VIEW_CHANNEL',
                                                'ATTACH_FILES'
                                            ]
                                        },
                                        {
                                            id: user.id,
                                            allow: [
                                                'VIEW_CHANNEL',
                                                'ATTACH_FILES',
                                                'MANAGE_CHANNELS',
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
                                        .setDescription(`📮 **Commande (\`${cmdID}\`)**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${clientcmd}>\n\n**-Prestataire : **<@${prestatairecmd}>\n\n**Pour fermer le ticket, cliquer sur la réaction 🔒\n**Pour signaler un des membres de la commande, cliquer sur la réaction ☢️\n\nBonne commande !**`)
                                        .setColor('#FF7B00')
                                        .setFooter(config.version, client.user.avatarURL())).then(msg => {
                                        msg.react('🔒')
                                        msg.react('☢️')
                                    })
                                    channel.createInvite({
                                        maxAge: 172800
                                    }).then(invite => {
                                        client.users.cache.get(clientcmd).send(`📩 **Commande (\`${cmdID}\`) accepté, cliquez sur l'invitation pour rejoindre le ticket : ${invite} !**`)
                                        client.users.cache.get(user.id).send(`📩 **Commande (\`${cmdID}\`) accepté, cliquez sur l'invitation pour rejoindre le ticket : ${invite} !**`)
                                    })
                                })
                                reaction.message.delete()
                            } else {
                                reaction.message.channel.send('⚠️ **Le système de commande n\'est pas initialisé sur le serveur sélectionné !**')
                            }
                        } else {
                            reaction.message.channel.send('⚠️ **Le système de commande est invalide sur le serveur sélectionné !**')
                        }
                    }
                }
            } else {
                client.guilds.cache.get('764869621982691329').channels.create('cmd_' + cmdID, {
                    parent: '819631253670068234',
                    permissionOverwrites: [
                        {
                            id: '764869621982691329',
                            deny: [
                                'VIEW_CHANNEL',
                                'ATTACH_FILES'
                            ]
                        },
                        {
                            id: user.id,
                            allow: [
                                'VIEW_CHANNEL',
                                'ATTACH_FILES',
                                'MANAGE_CHANNELS',
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
                        .setDescription(`📮 **Commande (\`${cmdID}\`)**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${clientcmd}>\n\n**-Prestataire : **<@${prestatairecmd}>\n\n**Pour fermer le ticket, cliquer sur la réaction 🔒\nPour signaler un des membres de la commande, cliquer sur la réaction ☢️\n\nBonne commande !**`)
                        .setColor('#FF7B00')
                        .setFooter(config.version, client.user.avatarURL())).then(msg => {
                        msg.react('🔒')
                        msg.react('☢️')
                    })
                    channel.createInvite({
                        maxAge: 172800
                    }).then(invite => {
                        client.users.cache.get(clientcmd).send(`📩 **Commande (\`${cmdID}\`) accepté, cliquez sur l'invitation pour rejoindre le ticket : ${invite} !**`)
                        client.users.cache.get(user.id).send(`📩 **Commande (\`${cmdID}\`) accepté, cliquez sur l'invitation pour rejoindre le ticket : ${invite} !**`)
                    })
                })
                reaction.message.delete()
            }
        }

        // Système qui gère la création des tickets pour le système de commande

        // Système qui gère la fermeture des tickets
        if (reaction.message.channel.type !== 'dm') {
            if (reaction.message.channel.name.startsWith('cmd_')) {
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
                    cmd.find((cmd) => cmd.id === parseInt(cmdID)).statue = 'fermé'
                    // Écrire les modifications dans la base de données
                    db.set('cmd', cmd)
                    const content = '[Transcript messages channel : ' + reaction.message.channel.id + ' / serveur : ' + reaction.message.guild.id + ' / membres : ' + reaction.message.channel.members.array().map((member) => member.id) + ' ]\n\n' + reaction.message.channel.messages.cache.map((c) => `${c.author.tag} (${c.author.id}) : ${c.content}`).join('\n\n')
                    hastebin(content, { url: 'https://hastebin.androz2091.fr/', extension: 'txt' }).then(haste => {
                        client.channels.cache.get('776063705480691722').send(`🔒 **Commande (\`${cmdID}\`) fermé par <@${user.id}> / transcript : ${haste}**`)
                        cmd.find((cmd) => cmd.id === parseInt(cmdID)).transcript = haste
                        // Écrire les modifications dans la base de données
                        db.set('cmd', cmd)
                    })
                    reaction.message.channel.delete()
                    client.users.cache.get(user.id).send(`🔒 **Commande (\`${cmdID}\`) fermé avec succès !**`)
                    if (user.id === clientcmd) {
                        client.users.cache.get(prestatairecmd).send(`🔒 **Commande (\`${cmdID}\`) fermé par <@${clientcmd}> !**`)
                    }
                    if (user.id === prestatairecmd) {
                        client.users.cache.get(clientcmd).send(`🔒 **Commande (\`${cmdID}\`) fermé par <@${prestatairecmd}> !**`)
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
                    cmd.find((cmd) => cmd.id === parseInt(cmdID)).statue = 'signalé'
                    // Écrire les modifications dans la base de données
                    db.set('cmd', cmd)
                    const content = '[Transcript messages channel : ' + reaction.message.channel.id + ' / serveur : ' + reaction.message.guild.id + ' / membres : ' + reaction.message.channel.members.array().map((member) => member.id) + ' ]\n\n' + reaction.message.channel.messages.cache.map((c) => `${c.author.tag} (${c.author.id}) : ${c.content}`).join('\n\n')
                    hastebin(content, { url: 'https://hastebin.androz2091.fr/', extension: 'txt' }).then(haste => {
                        client.channels.cache.get('808414479913713697').send(`☢️ **Commande (\`${cmdID}\`) signalé par <@${user.id}> / transcript : ${haste}**`)
                        cmd.find((cmd) => cmd.id === parseInt(cmdID)).transcript = haste
                        // Écrire les modifications dans la base de données
                        db.set('cmd', cmd)
                    })
                    client.guilds.cache.get('764869621982691329').channels.create('cmd_signalement_' + cmdID, {
                        parent: '819631253670068234',
                        permissionOverwrites: [
                            {
                                id: reaction.message.guild.id,
                                deny: [
                                    'VIEW_CHANNEL',
                                    'ATTACH_FILES'
                                ]
                            },
                            {
                                id: user.id,
                                allow: [
                                    'VIEW_CHANNEL',
                                    'ATTACH_FILES',
                                    'MANAGE_CHANNELS',
                                    'ATTACH_FILES'
                                ]
                            }
                        ]
                    }).then((channel) => {
                        const cmd = db.get('cmd')
                        const cmdid = cmd.find((cmd) => cmd.id === parseInt(cmdID))
                        const transcriptcmd = cmdid.transcript
                        channel.send(new Discord.MessageEmbed()
                            .setDescription(`☢️ **Commande (\`${cmdID}\`)**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${clientcmd}>\n\n**-Prestataire : **<@${prestatairecmd}>\n\n**-Transcript : ${transcriptcmd}**\n\n**Bonjour, veuillez écrire le pourquoi de votre signalement.**`)
                            .setColor('FF7B00')
                            .setFooter(config.version, reaction.message.client.user.avatarURL())).then((msg) => {
                            msg.react('🔒')
                        })
                        client.users.cache.get(user.id).send(`☢️ **Signalement envoyé avec succès, un ticket vous a été créé : ${channel} !**`)
                        if (user.id === clientcmd) {
                            client.users.cache.get(prestatairecmd).send(`☢️ **Commande (\`${cmdID}\`) signalé par <@${user.id}>, vous recevrez un prochain message vous informant des dispositions prises !**`)
                        }
                        if (user.id === prestatairecmd) {
                            client.users.cache.get(clientcmd).send(`☢️ **Commande (\`${cmdID}\`) signalé par <@${user.id}>, vous recevrez un prochain message vous informant des dispositions prises !**`)
                        }
                    })
                    reaction.message.channel.delete()
                }
                // Système qui gère le signalement des membres
            }
            if (reaction.message.channel.name.startsWith('cmd_signalement_')) {
                if (reaction.emoji.name === '🔒') {
                    reaction.message.channel.delete()
                }
            }
        }
    }
})

// Système reaction

// Système qui gère les sauvegardes de la base de données

const CronJob = require('cron').CronJob
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

    const statuses = [
        'MP le bot',
        'pour enregistrer des 🎨 créations 🎨 !',
        'regarder !vbhelp'
    ]
    let i = 5
    setInterval(() => {
        client.user.setActivity(statuses[i], { type: 'PLAYING' })
        i = ++i % statuses.length
    }, 20 * 1000)

    // Système qui gère le jeu du bot

    console.log('✅ bot connecté ✅')
})

// Système activé lors du démarrage du bot
