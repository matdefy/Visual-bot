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
    let prefix = '!vb'
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
        if (message.content.startsWith(prefix + 'blacklist') || message.content.startsWith(prefix + 'cmd') || message.content.startsWith(prefix + 'init') || message.content.startsWith(prefix + 'level') || message.content.startsWith(prefix + 'setprefix') || message.content.startsWith(prefix + 'tickets') || message.content.startsWith(prefix + 'validcrea')) {
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
        client.channels.cache.get('749985660181544980').send(`Le bot est sur le serveur ${guild.name}, avec ${guild.memberCount} membres ! **❤️Merci❤️**\n\n**Invitation :** https://discord.gg/` + invite.code)
    })
    dbLogs.push('guild', {
        date: Date.now(),
        guild: guild.name
    })
})

// Système qui envoie un message quand le bot est ajouté sur un serveur

// Système qui ajoute les roles utilisateurs

client.on('guildMemberAdd', member => {
    if (db.has('roles_' + member.id)) {
        if (db.has('roles_' + member.guild.id)) {
            if (db.get('roles_' + member.id).graph === true) {
                if (db.get('roles_' + member.guild.id).graph !== 0) {
                    const guildroles = member.guild.roles.cache
                    const rolesId = guildroles.map(roles => roles.id)
                    const roleId = db.get('roles_' + member.guild.id).graph
                    if (rolesId.includes(roleId)) {
                        member.roles.add(roleId)
                        client.users.cache.get(member.id).send('✅ ** Rôle graphiste ajouté sur le serveur `' + member.guild.id + '` !**')
                    } else {
                        const roles = db.get(`roles_${member.guild.id}`) // là tu récupères l'objet
                        roles.graph = 0 // là tu le modifies
                        db.set(`roles_${member.guild.id}`, roles) // là tu le sauvegardes
                    }
                }
            }
            if (db.get('roles_' + member.id).dessin === true) {
                if (db.get('roles_' + member.guild.id).dessin !== 0) {
                    const guildroles = member.guild.roles.cache
                    const rolesId = guildroles.map(roles => roles.id)
                    const roleId = db.get('roles_' + member.guild.id).dessin
                    if (rolesId.includes(roleId)) {
                        member.roles.add(roleId)
                        client.users.cache.get(member.id).send('✅ ** Rôle dessinateur/trice ajouté sur le serveur `' + member.guild.id + '` !**')
                    } else {
                        const roles = db.get(`roles_${member.guild.id}`) // là tu récupères l'objet
                        roles.dessin = 0 // là tu le modifies
                        db.set(`roles_${member.guild.id}`, roles) // là tu le sauvegardes
                    }
                }
            }
            if (db.get('roles_' + member.id).photo === true) {
                if (db.get('roles_' + member.guild.id).photo !== 0) {
                    const guildroles = member.guild.roles.cache
                    const rolesId = guildroles.map(roles => roles.id)
                    const roleId = db.get('roles_' + member.guild.id).photo
                    if (rolesId.includes(roleId)) {
                        member.roles.add(roleId)
                        client.users.cache.get(member.id).send('✅ ** Rôle photographe ajouté sur le serveur `' + member.guild.id + '` !**')
                    } else {
                        const roles = db.get(`roles_${member.guild.id}`) // là tu récupères l'objet
                        roles.photo = 0 // là tu le modifies
                        db.set(`roles_${member.guild.id}`, roles) // là tu le sauvegardes
                    }
                }
            }
            if (db.get('roles_' + member.id).design === true) {
                if (db.get('roles_' + member.guild.id).design !== 0) {
                    const guildroles = member.guild.roles.cache
                    const rolesId = guildroles.map(roles => roles.id)
                    const roleId = db.get('roles_' + member.guild.id).design
                    if (rolesId.includes(roleId)) {
                        member.roles.add(roleId)
                        client.users.cache.get(member.id).send('✅ ** Rôle designer ajouté sur le serveur `' + member.guild.id + '` !**')
                    } else {
                        const roles = db.get(`roles_${member.guild.id}`) // là tu récupères l'objet
                        roles.design = 0 // là tu le modifies
                        db.set(`roles_${member.guild.id}`, roles) // là tu le sauvegardes
                    }
                }
            }
        }
    }
})

// Système qui ajoute les roles utilisateurs

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

        if (reaction.message.channel.type !== 'dm') {
            let prefix = '!vb'
            if (db.has('prefix_' + reaction.message.guild.id)) {
                prefix = db.get('prefix_' + reaction.message.guild.id)
            }

            // Système qui gère la création des tickets pour le système de tickets
            if (reaction.emoji.name === '☑️' && reaction.message.guild.id !== '775274490723827712') {
                if (db.has('parentticket_' + reaction.message.guild.id)) {
                    const parentsidguild = db.get('parentticket_' + reaction.message.guild.id)
                    if (parentsidguild.find((message) => message.urlmessage === reaction.message.url)) {
                        const parentid = parentsidguild.find((message) => message.urlmessage === reaction.message.url).idparent
                        reaction.message.guild.channels.create('ticket-' + user.id, {
                            parent: parentid,
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
                                        'ATTACH_FILES'
                                    ]
                                },
                                {
                                    id: '747833110376218624',
                                    allow: [
                                        'VIEW_CHANNEL',
                                        'ADD_REACTIONS',
                                        'MANAGE_CHANNELS',
                                        'ATTACH_FILES'
                                    ]
                                }
                            ]
                        }).then((channel) => {
                            channel.send('<@' + user.id + '>')
                            channel.send(new Discord.MessageEmbed()
                                .setDescription('📮 **Ticket créé avec succès**\n\n**Pour fermer le ticket cliquer sur la réaction 🔒\nPour enregistrer les 100 dernier messages cliquer sur la réaction 📝**')
                                .setColor('#FEFEFE')
                                .setFooter(config.version, client.user.avatarURL())).then(msg => {
                                msg.react('🔒')
                                msg.react('📝')
                            })
                        })
                        client.channels.cache.get('776063705480691722').send('ticket créé pour l\'utilisateur : (`' + user.id + '`)')
                        dbLogs.push('tickets', {
                            date: Date.now(),
                            userId: user.id,
                            guild: reaction.message.guild.id
                        })
                        reaction.message.reactions.removeAll()
                        reaction.message.react('☑️')
                        reaction.message.react('🔒')
                    }
                }
            }
            // Système qui gère la création des tickets pour le système de tickets

            // Système qui gère la création des tickets pour le système de commande

            if (reaction.emoji.name === '✅' && reaction.message.guild.id !== '775274490723827712') {
                const channelID = db.get('channelcmd_' + reaction.message.guild.id)
                if (reaction.message.channel.id !== channelID) return
                // vérification que la catégorie stockée dans la base de données est valide
                const guildparents = reaction.message.guild.channels.cache
                const categoriestout = guildparents.filter((salon) => salon.type === 'category')
                const categoriesId = categoriestout.map(categorie => categorie.id)
                const dbcatcmd = db.get('catcmd_' + reaction.message.guild.id)
                if (dbcatcmd) {
                    if (categoriesId.includes(dbcatcmd)) {
                        // vérification que la catégorie stockée dans la base de données est valide
                        const parentcmd = db.get('catcmd_' + reaction.message.guild.id)
                        const description = reaction.message.embeds[0].description
                        const userID = description.substring(
                            description.lastIndexOf('(') + 1,
                            description.lastIndexOf(')')
                        )
                        const commandID = description.substring(
                            description.lastIndexOf('[') + 1,
                            description.lastIndexOf(']')
                        )
                        const descriptcmd = description.substring(
                            description.lastIndexOf('<') + 1,
                            description.lastIndexOf('>')
                        )
                        const guild = reaction.message.guild
                        reaction.message.guild.channels.create('ticket-' + userID, {
                            parent: parentcmd,
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
                                        'ATTACH_FILES'
                                    ]
                                },
                                {
                                    id: userID,
                                    allow: [
                                        'VIEW_CHANNEL',
                                        'ATTACH_FILES'
                                    ]
                                },
                                {
                                    id: '747833110376218624',
                                    allow: [
                                        'VIEW_CHANNEL',
                                        'ADD_REACTIONS',
                                        'MANAGE_CHANNELS',
                                        'ATTACH_FILES'
                                    ]
                                }
                            ]
                        }).then((channel) => {
                            channel.send('<@' + userID + '>')
                            channel.send(new Discord.MessageEmbed()
                                .setDescription('🔽 **Comment passer commande ?**\n\nDescription : ' + descriptcmd + '\n\nMerci d\'avoir créé un ticket de commande sur ' + guild.name + ', veuillez maintenant décrire précisément votre commande !')
                                .setColor('#FEFEFE')
                                .setFooter(config.version, client.user.avatarURL()))
                            channel.send(new Discord.MessageEmbed()
                                .setDescription('Client : (' + userID + ')\nGraphiste : {' + user.id + '}\n\n**Pour fermer le ticket cliquer sur la réaction 🔒\nPour signaler le client ou le graphiste cliquer sur la réaction ☢️**')
                                .setColor('#FEFEFE')
                                .setFooter(config.version, client.user.avatarURL())).then(msg => {
                                msg.react('🔒')
                                msg.react('☢️')
                            })
                        })

                        client.users.cache.get(userID).send(new Discord.MessageEmbed()
                            .setDescription('🎉 **Bonne nouvelle !**\n\nUn graphiste a accepté votre commande sur le serveur ' + guild.name + ', un ticket vous a été créé !\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                            .setColor('#00FF00')
                            .setFooter(config.version, client.user.avatarURL()))
                        client.channels.cache.get('776063705480691722').send('ticket de commande créé pour l\'utilisateur : (`' + userID + '`)')
                        dbLogs.push('cmd', {
                            date: Date.now(),
                            cmd: commandID,
                            userId: userID,
                            guild: guild.id
                        })
                        reaction.message.delete()
                    } else {
                        reaction.message.channel.send(new Discord.MessageEmbed()
                            .setDescription('⚠️ **Le système de commande est invalide !**\n\n`' + prefix + 'init` : permet de reconfigurer le système de commande !\n\n⚠️ **Permission de pouvoir gérer le serveur obligatoire !**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                            .setColor('#e55f2a')
                            .setFooter(config.version, client.user.avatarURL()))
                    }
                } else {
                    reaction.message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ **Le système de commande n\'est pas initialisé sur ce serveur !**\n\n`' + prefix + 'init` : permet de configurer le système de commande. Après l’avoir tapé, le bot va créer un channel ou les clients pourront passer commande, un channel permettant au graphiste d\'accepter les commandes des clients, ainsi qu’une catégorie qui stockera les tickets de commandes et les 2 channels décrits ci-dessus.\n\n(pour supprimer le système sur votre serveur, retaper la commande)\n\n(si par erreur vous supprimez un channel ou la catégorie créée par le bot, retaper la commande. Le bot va automatiquement détecter qu’il y a une anomalie et corriger le problème)\n\n⚠️ **Permission de pouvoir gérer le serveur obligatoire !**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, reaction.message.client.user.avatarURL()))
                }
            }

            // Système qui gère la création des tickets pour le système de commande

            // Système qui gère la fermeture des tickets manuels

            if (reaction.emoji.name === '🔒' && !reaction.message.channel.name.startsWith('ticket-')) {
                const nouveauTableau = db.get('parentticket_' + reaction.message.guild.id).filter((element) => element.urlmessage !== reaction.message.url)
                const idparent = db.get('parentticket_' + reaction.message.guild.id).filter((element) => element.urlmessage === reaction.message.url)
                reaction.message.delete()
                const idparentgood = idparent.map((element) => element.idparent)
                client.channels.cache.get(idparentgood.toString()).delete()
                db.set('parentticket_' + reaction.message.guild.id, nouveauTableau)
            }

            // Système qui gère la fermeture des tickets manuels

            // Système qui gère la fermeture des tickets
            if (reaction.message.channel.name.startsWith('ticket-')) {
                if (reaction.emoji.name === '🔒') {
                    reaction.message.channel.delete()
                }

                // Système qui gère la fermeture des tickets

                // Système qui gère l'enregistrement des tickets

                if (reaction.emoji.name === '📝') {
                    await reaction.message.channel.messages.fetch()
                    const content = '[Transcript messages channel : ' + reaction.message.channel.id + ' / serveur : ' + reaction.message.guild.id + ' / membres : ' + reaction.message.channel.members.array().map((member) => member.id) + ' ]\n\n' + reaction.message.channel.messages.cache.map((c) => `${c.author.tag} (${c.author.id}) : ${c.content}`).join('\n\n')

                    hastebin(content, { url: 'https://hastebin.androz2091.fr/', extension: 'txt' }).then(haste => {
                        reaction.message.channel.send('**Transcript (' + reaction.message.channel.id + ') : ' + haste + '**')
                    })
                }

                // Système qui gère l'enregistrement des tickets

                // Système qui gère le signalement des membres

                if (reaction.emoji.name === '☢️') {
                    const description = reaction.message.embeds[0].description
                    const clientID = description.substring(
                        description.lastIndexOf('(') + 1,
                        description.lastIndexOf(')')
                    )
                    const graphisteID = description.substring(
                        description.lastIndexOf('{') + 1,
                        description.lastIndexOf('}')
                    )
                    await reaction.message.channel.messages.fetch()
                    const content = '[Transcript messages channel : ' + reaction.message.channel.id + ' / serveur : ' + reaction.message.guild.id + ' / membres : ' + reaction.message.channel.members.array().map((member) => member.id) + ' ]\n\n' + reaction.message.channel.messages.cache.map((c) => `${c.author.tag} (${c.author.id}) : ${c.content}`).join('\n\n')
                    hastebin(content, { url: 'https://hastebin.androz2091.fr/', extension: 'txt' }).then(haste => {
                        if (user.id === clientID) {
                            client.users.cache.get(user.id).send(new Discord.MessageEmbed()
                                .setDescription('☢️ **Signalement enregistré !**\n\nPour que le signalement puisse être pris en compte veuillez taper `' + prefix + 'signalement ' + graphisteID + ' ' + haste + ' [description de votre signalement]`')
                                .setColor('#e55f2a')
                                .setFooter(config.version, reaction.message.client.user.avatarURL()))
                            reaction.message.client.channels.cache.get('797853971162595339').send('Client à l\'identifiant `' + clientID + '` a signalé le graphiste `' + graphisteID + '`')
                            reaction.message.channel.delete()
                        } else {
                            client.users.cache.get(user.id).send(new Discord.MessageEmbed()
                                .setDescription('☢️ **Signalement enregistré !**\n\nPour que le signalement puisse être pris en compte veuillez taper `' + prefix + 'signalement ' + clientID + ' ' + haste + ' [description de votre signalement]`')
                                .setColor('#e55f2a')
                                .setFooter(config.version, reaction.message.client.user.avatarURL()))
                            reaction.message.client.channels.cache.get('797853971162595339').send('Graphiste à l\'identifiant `' + graphisteID + '` a signalé le client `' + clientID + '`')
                            reaction.message.channel.delete()
                        }
                    })
                }
            }
            if (reaction.message.channel.id === '797845739472027658') {
                const description = reaction.message.content
                const memberID = description.substring(
                    description.lastIndexOf('[') + 1,
                    description.lastIndexOf(']')
                )
                const signalementID = description.substring(
                    description.lastIndexOf('<') + 1,
                    description.lastIndexOf('>')
                )
                const descriptionSi = description.substring(
                    description.lastIndexOf('{') + 1,
                    description.lastIndexOf('}')
                )
                if (reaction.emoji.name === '⛔') {
                    client.users.cache.get(signalementID).send(`🎉 **Votre signalement a permi de bannir le membre à l\'identifiant **\`${memberID}\`** ! Merci ❤️**`)
                    db.push('blacklist', memberID)
                    client.users.cache.get(memberID).send(new Discord.MessageEmbed()
                        .setDescription('🛑 **Bonjour, suite à votre bannissement de Visual Bot l\'utilisation de celui-ci vous est maintenant bloqué !**\n\nRaison : ' + descriptionSi)
                        .setColor('#FF0000')
                        .setFooter(config.version, reaction.message.client.user.avatarURL()))
                    reaction.message.delete()
                    reaction.message.client.channels.cache.get('797853971162595339').send('Utilisateur à l\'identifiant `' + memberID + '` banni par ' + user.tag + ' (`' + user.id + '`) ')
                }
                if (reaction.emoji.name === '❌') {
                    client.users.cache.get(signalementID).send(`⚠️ **Votre signalement pour l\'utilisateur **\`${memberID}\`** n\'a pas permis de confirmer que le membre devait être banni !**`)
                    reaction.message.delete()
                }
            }

            // Système qui gère le signalement des membres

            // Système qui gère la validation des créations

            if (reaction.message.channel.id === '775274490723827715') {
                const description = reaction.message.embeds[0].description
                const userID = description.substring(
                    description.lastIndexOf('(') + 1,
                    description.lastIndexOf(')')
                )
                const creationID = description.substring(
                    description.lastIndexOf('[') + 1,
                    description.lastIndexOf(']')
                )
                const lienpreuveID = description.substring(
                    description.indexOf('-') + 1,
                    description.lastIndexOf('-')
                )
                if (reaction.emoji.name === '✅') {
                    const creations = db.get('crea_' + userID)
                    creations.find((creation) => creation.id === parseInt(creationID)).verif = '✅'
                    db.set('crea_' + userID, creations)
                    client.users.cache.get(userID).send(new Discord.MessageEmbed()
                        .setDescription('🎉 **Bonne nouvelle**\n\nVotre création à l\'identifiant `' + creationID + '` a été vérifié !\n\nTaper `' + prefix + 'viewcrea` pour voir votre nouvelle validation !\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                        .setColor('#00FF00')
                        .setFooter(config.version, client.user.avatarURL()))
                    client.channels.cache.get('775411371189862410').send('Création numéro ' + creationID + ' de l\'utilisateur (`' + userID + '`) vérifiée par ' + user.tag + ' (`' + user.id + '`)')
                } else {
                    client.users.cache.get(userID).send(new Discord.MessageEmbed()
                        .setDescription('⚠️ **Preuve invalide**\n\nVotre preuve n\'a pas permis de confirmer que la création à l\'identifiant `' + creationID + '` vous appartenez !\n\n`' + prefix + 'addpreuve ' + creationID + ' [votre preuve]` : permet d’enregistrer une preuve dans la base de données, une preuve est un screen du projet (photoshop, gimp, etc…) de la création ou l’on peut voir les calques, elle est relié au numéro de la création entré dans la commande !\n\n(votre preuve doit être envoyer dans le même message que la commande, mais en pièce jointe (le + situé à gauche de la zone d’écriture))\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, client.user.avatarURL()))
                    // ici on récupère toutes les preuves de l'utilisateur et on garde que celles ou preuve.url n'est pas égal à celle qu'on veut enlever
                    const preuvedb = db.get('pr_' + userID).filter((preuve) => preuve.url !== lienpreuveID)
                    // on met à jour la db
                    db.set('pr_' + userID, preuvedb)
                }
                reaction.message.channel.messages.cache.filter(message => {
                    if (message.embeds.length === 0) return false
                    const description2 = message.embeds[0].description
                    const userID2 = description2.substring(
                        description2.lastIndexOf('(') + 1,
                        description2.lastIndexOf(')')
                    )
                    const creationID2 = description2.substring(
                        description2.lastIndexOf('[') + 1,
                        description2.lastIndexOf(']')
                    )
                    return userID2 === userID && creationID2 === creationID
                }).forEach(message => message.delete())
            }
            // Système qui gère la validation des créations
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
