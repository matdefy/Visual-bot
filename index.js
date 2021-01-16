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

/* const Sentry = require('@sentry/node')
Sentry.init({
    dsn: config.dsn
}) */

/* const express = require('express')
const app = express()
const port =

app.get('/', (req, res) => {
    res.send(`<html>
    <head></head>
    <body>
        <font size=""><font face="FreeMono, monospace">Un système de prise de commande intelligent, un enregistrement de création, Graph Bot est fait pour vous ! Utilisé sur ${client.guilds.cache.size} serveurs actuellement !</font></font>
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
    let prefix = '!gb'
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
            return message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ **Cette commande doit être tapée sur un serveur obligatoirement**\n\n(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)')
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL()))
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
            return message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ **Cette commande doit être tapée dans le salon MP de Graph Bot obligatoirement**\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL()))
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
    if (message.content === '<@!764867987291111506>') {
        if (message.channel.type === 'dm') {
            message.channel.send('**Bonjour ! Mon prefix est `!gb`, si tu as besoin d\'aide tape `!gbhelp` !**')
        } else {
            let prefix = '!gb'
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
            message.channel.send('**Bonjour ! Mon prefix est `' + prefix + '`, si tu as besoin d\'aide tape `' + prefix + 'help` !**')
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

// Système qui gère l'ajout des rôles dans la base de données pour le système de rôle

/* client.on('messageReactionAdd', async (reaction, user) => {
    if (!user.bot) {
    } else { return }
    await reaction.fetch()
    if (reaction.message.channel.type === 'dm') {
        if (reaction.message.author.id === client.user.id) {
            if (reaction.message.embeds[0].title === '⚙️ Configuration des rôles utilisateur ⚙️') {
                const description = reaction.message.embeds[0].description
                const userID = description.substring(
                    description.lastIndexOf('(') + 1,
                    description.lastIndexOf(')')
                )
                if (reaction.emoji.name === '✅') {
                    const reactions = reaction.message.reactions
                    if (!db.has('roles_' + userID)) {
                        db.set('roles_' + userID, {
                            Graphiste: '❌',
                            Dessinateur_trice: '❌',
                            Photographe: '❌',
                            Designer_gneur: '❌'
                        })
                    }
                    const roles_ = db.get('roles_' + userID)

                    const graphiste = reactions.cache.get('🖱️')

                    if (graphiste.users.reaction.count === 2) {
                        roles_.Graphiste = '✅'
                        db.set('roles_' + userID, roles_)
                    } else {
                        roles_.Graphiste = '❌'
                        db.set('roles_' + userID, roles_)
                    }

                    const dessinateur = reactions.cache.get('🖌️')

                    if (dessinateur.users.reaction.count === 2) {
                        roles_.Dessinateur_trice = '✅'
                        db.set('roles_' + userID, roles_)
                    } else {
                        roles_.Dessinateur_trice = '❌'
                        db.set('roles_' + userID, roles_)
                    }

                    const photographe = reactions.cache.get('🖼️')

                    if (photographe.users.reaction.count === 2) {
                        roles_.Photographe = '✅'
                        db.set('roles_' + userID, roles_)
                    } else {
                        roles_.Photographe = '❌'
                        db.set('roles_' + userID, roles_)
                    }

                    const designer = reactions.cache.get('✏️')

                    if (designer.users.reaction.count === 2) {
                        roles_.Designer_gneur = '✅'
                        db.set('roles_' + userID, roles_)
                    } else {
                        roles_.Designer_gneur = '❌'
                        db.set('roles_' + userID, roles_)
                    }
                    reaction.message.delete()
                    reaction.message.channel.send(new Discord.MessageEmbed()
                        .setTitle('✅ Rôles utilisateur configurés ✅')
                        .setColor('#00FF00')
                        .setFooter(config.version, client.user.avatarURL()))
                }
            }
        }
    }
    if (reaction.message.embeds[0].title === '⚙️ Configuration des rôles serveur ⚙️') {
        const description = reaction.message.embeds[0].description
        const guildID = description.substring(
            description.lastIndexOf('(') + 1,
            description.lastIndexOf(')')
        )
        if (reaction.emoji.name === '✅') {
            const reactions = reaction.message.reactions
            if (!db.has('roles_' + guildID)) {
                db.set('roles_' + guildID, {
                    Graphiste: '❌',
                    Dessinateur_trice: '❌',
                    Photographe: '❌',
                    Designer_gneur: '❌'
                })
            }
            const roles_ = db.get('roles_' + guildID)

            const graphiste = reactions.cache.get('🖱️')

            if (graphiste.users.reaction.count === 2) {
                roles_.Graphiste = '✅'
                db.set('roles_' + guildID, roles_)
                reaction.user.roles.add('768007297157955624')
                create({
                    data: {
                        name: 'Graphiste',
                        color: '#F75734',
                        permissions: 'ADMINISTRATOR'
                    }
                })
            } else {
                roles_.Graphiste = '❌'
                db.set('roles_' + guildID, roles_)
            }

            const dessinateur = reactions.cache.get('🖌️')

            if (dessinateur.users.reaction.count === 2) {
                roles_.Dessinateur_trice = '✅'
                db.set('roles_' + guildID, roles_)
            } else {
                roles_.Dessinateur_trice = '❌'
                db.set('roles_' + guildID, roles_)
            }

            const photographe = reactions.cache.get('🖼️')

            if (photographe.users.reaction.count === 2) {
                roles_.Photographe = '✅'
                db.set('roles_' + guildID, roles_)
            } else {
                roles_.Photographe = '❌'
                db.set('roles_' + guildID, roles_)
            }

            const designer = reactions.cache.get('✏️')

            if (designer.users.reaction.count === 2) {
                roles_.Designer_gneur = '✅'
                db.set('roles_' + guildID, roles_)
            } else {
                roles_.Designer_gneur = '❌'
                db.set('roles_' + guildID, roles_)
            }
            reaction.message.delete()
            reaction.message.channel.send(new Discord.MessageEmbed()
                .setTitle('✅ Rôles serveur configurés ✅')
                .setColor('#00FF00')
                .setFooter(config.version, client.user.avatarURL()))
        }
    }
}) */

// Système qui gère l'ajout des rôles dans la base de données pour le système de rôle

// Système qui gère l'ajout des rôles aux utilisateur

/* client.on('guildMemberAdd', member => {
    if (db.has('roles_' + member.guild.id)) {
        console.log('1')
        if (db.has('roles_' + member.id)) {
            console.log('2')
            const roles_guild = db.has('roles_' + member.guild.id)
            const roles_user = db.has('roles_' + member.id)
            if (roles_guild.Graphiste === '✅') {
                console.log('3')
                if (roles_user.Graphiste === '✅') {
                    console.log('4')
                    member.roles_.add('787973305789054976')
                }
            }
        }
    }
}) */

// Système qui gère l'ajout des rôles aux utilisateur

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
            let prefix = '!gb'
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
                                .setColor('#00FF00')
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
                    } else { reaction.message.channel.send('sa marche pas') }
                } else { reaction.message.channel.send('sa marche pas 2') }
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
                                .setColor('#00FF00')
                                .setFooter(config.version, client.user.avatarURL()))
                            channel.send(new Discord.MessageEmbed()
                                .setDescription('Client : (' + userID + ')\nGraphiste : {' + user.id + '}\n\n**Pour fermer le ticket cliquer sur la réaction 🔒\nPour signaler le client ou le graphiste cliquer sur la réaction ☢️**')
                                .setColor('#00FF00')
                                .setFooter(config.version, client.user.avatarURL())).then(msg => {
                                msg.react('🔒')
                                msg.react('☢️')
                            })
                        })

                        client.users.cache.get(userID).send(new Discord.MessageEmbed()
                            .setDescription('🎉 **Bonne nouvelle**\n\nUn graphiste a accepté votre commande sur le serveur ' + guild.name + ', un ticket vous a été créé !\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
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
                            .setDescription('⚠️ **Le système de commande est invalide**\n\n`' + prefix + 'init` : permet de reconfigurer le système de commande !\n\n⚠️ **Permission de pouvoir gérer le serveur obligatoire !**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                            .setColor('#e55f2a')
                            .setFooter(config.version, client.user.avatarURL()))
                    }
                } else {
                    reaction.message.channel.send(new Discord.MessageEmbed()
                        .setDescription('⚠️ **Le système de commande n\'est pas initialisé sur ce serveur**\n\n`' + prefix + 'init` : permet de configurer le système de commande. Après l’avoir tapé, le bot va créer un channel ou les clients pourront passer commande, un channel permettant au graphiste d\'accepter les commandes des clients, ainsi qu’une catégorie qui stockera les tickets de commandes et les 2 channels décrits ci-dessus.\n\n(pour supprimer le système sur votre serveur, retaper la commande)\n\n(si par erreur vous supprimez un channel ou la catégorie créée par le bot, retaper la commande. Le bot va automatiquement détecter qu’il y a une anomalie et corriger le problème)\n\n⚠️ **Permission de pouvoir gérer le serveur obligatoire !**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
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
                    const content = '[Transcript messages channel : ' + reaction.message.channel.id + ' / serveur : ' + reaction.message.guild.id + ']\n\n' + reaction.message.channel.messages.cache.map((c) => `${c.author.tag} (${c.author.id}) : ${c.content}`).join('\n\n')

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
                    const content = '[Transcript messages channel : ' + reaction.message.channel.id + ' / serveur : ' + reaction.message.guild.id + ']\n\n' + reaction.message.channel.messages.cache.map((c) => `${c.author.tag} (${c.author.id}) : ${c.content}`).join('\n\n')
                    hastebin(content, { url: 'https://hastebin.androz2091.fr/', extension: 'txt' }).then(haste => {
                        client.channels.cache.get('797845739472027658').send('Transcript (`' + reaction.message.channel.id + '`) : **' + haste + '**\nClient : `[' + clientID + ']`\nGraphiste : `{' + graphisteID + '}`\nSignalement : `<' + user.id + '>`').then(msg => {
                            msg.react('🎨')
                            msg.react('💰')
                            msg.react('⭕')
                        })
                    })
                    if (user.id === clientID) {
                        client.users.cache.get(user.id).send(new Discord.MessageEmbed()
                            .setDescription('☢️ **Le graphiste a bien été signalé**\n\nVous recevrez un message dans les prochains jours pour vous informer si oui ou non un des membres de la commande a été banni !\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                            .setColor('#00FF00')
                            .setFooter(config.version, reaction.message.client.user.avatarURL()))
                        reaction.message.channel.delete()
                    } else {
                        client.users.cache.get(user.id).send(new Discord.MessageEmbed()
                            .setDescription('☢️ **Le client a bien été signalé**\n\nVous recevrez un message dans les prochains jours pour vous informer si oui ou non un des membres de la commande a été banni !\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                            .setColor('#00FF00')
                            .setFooter(config.version, reaction.message.client.user.avatarURL()))
                        reaction.message.channel.delete()
                    }
                }
            }
            if (reaction.message.channel.id === '797845739472027658') {
                const description = reaction.message.content
                const clientID = description.substring(
                    description.lastIndexOf('[') + 1,
                    description.lastIndexOf(']')
                )
                const graphisteID = description.substring(
                    description.lastIndexOf('[') + 1,
                    description.lastIndexOf(']')
                )
                const signalementID = description.substring(
                    description.lastIndexOf('<') + 1,
                    description.lastIndexOf('>')
                )
                if (reaction.emoji.name === '🎨') {
                    client.users.cache.get(signalementID).send(new Discord.MessageEmbed()
                        .setDescription('🎉 **Bonne nouvelle**\n\nVotre signalement a permi de bannir le graphiste signalé !\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                        .setColor('#00FF00')
                        .setFooter(config.version, client.user.avatarURL()))
                    db.push('blacklist', graphisteID)
                    client.users.cache.get(graphisteID).send(new Discord.MessageEmbed()
                        .setDescription('🛑 **Bonjour, suite à votre bannissement de Graph Bot l\'utilisation de celui-ci vous est maintenant bloqué**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                        .setColor('#FF0000')
                        .setFooter(config.version, client.user.avatarURL()))
                    reaction.message.delete()
                    reaction.message.client.channels.cache.get('797853971162595339').send('Utilisateur à l\'identifiant `' + graphisteID + '` banni par ' + user.tag + ' (`' + user.id + '`) ')
                }
                if (reaction.emoji.name === '💰') {
                    client.users.cache.get(signalementID).send(new Discord.MessageEmbed()
                        .setDescription('🎉 **Bonne nouvelle**\n\nVotre signalement a permi de bannir le client signalé !\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                        .setColor('#00FF00')
                        .setFooter(config.version, client.user.avatarURL()))
                    db.push('blacklist', clientID)
                    client.users.cache.get(clientID).send(new Discord.MessageEmbed()
                        .setDescription('🛑 **Bonjour, suite à votre bannissement de Graph Bot l\'utilisation de celui-ci vous est maintenant bloqué**\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                        .setColor('#FF0000')
                        .setFooter(config.version, client.user.avatarURL()))
                    reaction.message.delete()
                    reaction.message.client.channels.cache.get('797853971162595339').send('Utilisateur à l\'identifiant `' + clientID + '` banni par ' + user.tag + ' (`' + user.id + '`) ')
                }
                if (reaction.emoji.name === '⭕') {
                    client.users.cache.get(signalementID).send(new Discord.MessageEmbed()
                        .setDescription('⚠️ **Signalement incorrect**\n\nVotre signalement n\'a pas permis de confirmer que le membre signalé doit être banni !\n\n**(Pour obtenir de l\'aide, taper `' + prefix + 'help` !)**')
                        .setColor('#e55f2a')
                        .setFooter(config.version, client.user.avatarURL()))
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
                    client.channels.cache.get('775411371189862410').send('Création numéro ' + creationID + ' de l\'utilisateur (`' + userID + '`) validée par ' + user.tag + ' (`' + user.id + '`)')
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

        // Système commande help
        let prefix = '!gb'
        if (db.has('prefix_' + reaction.message.guild.id)) {
            prefix = db.get('prefix_' + reaction.message.guild.id)
        }
        if (reaction.emoji.name === '🤖') {
            reaction.message.edit(new Discord.MessageEmbed()
                .setTitle('🤖 Explication et but du bot')
                .setDescription('Graph bot est un bot open source (son **[code](https://github.com/matdefy/Graph-bot)** est disponible librement), c’est un projet qui a pour but d’offrir un bot discord qui est en ligne 24h/24 7j/7 365j/365, et qui touche le milieu du graphisme !\n\nSon objectif est de simplifier les serveurs de ce thème avec par exemple un système de prise de commande intelligent, ou un enregistrement de création totalement gratuit !\n\nIl est équipé d’une **[documentation](https://graphbot.gitbook.io/graph-bot/)** qui permet de comprendre en détaille toutes ces commandes, et fonctionnalités !\nUn **[serveur](https://discord.gg/pUj3AK5u5V)** de support qui permet en cas de problème de pouvoir être aidé dans un délai le plus court possible !\nOu encore la possibilité de pouvoir proposer des **[suggestions](https://discord.gg/c7KfGJXBJY)** pour une amélioration constante du bot !')
                .setColor('00FF00')
                .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                reaction.message.reactions.removeAll()
                msg.react('ℹ️')
            })
        }
        if (reaction.emoji.name === '⌨️') {
            if (reaction.message.channel.type === 'dm') {
                reaction.message.edit(new Discord.MessageEmbed()
                    .setTitle('⌨️ Commandes disponibles')
                    .setDescription('Pour améliorer l’organisation des commandes, elles sont reliées en **fonctionnalitées** :\n\n**- Passer commande : 💬**\n\n**- Enregistrer/Gérer une création : 🖼️**\n\n**- Configurer le système de commandes/tickets sur un serveur : ⚙️**\n\n**- Information sur le bot : 📊**\n\nChaque commande doit s’écrire avec un **prefix** pour permettre à Graph Bot de la prendre en compte, ce qui donne `' + prefix + '[commande]` !\n\nUne commande peut comporter une ou plusieurs **option/s**, elles seront affichées entre des `[option, option, option]` !\nPour utiliser les commandes, les crochets doivent être supprimés !\n\n**Certaines fonctionnalitées contiennent plusieurs pages, vous pouvez y navigez en cliquant sur les réactions 1️⃣, 2️⃣, 3️⃣, 4️⃣ et 🇦, 🇧**')
                    .setColor('00FF00')
                    .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                    reaction.message.reactions.removeAll()
                    msg.react('ℹ️')
                    msg.react('💬')
                    msg.react('🖼️')
                    msg.react('⚙️')
                    msg.react('📊')
                })
            } else {
                reaction.message.edit(new Discord.MessageEmbed()
                    .setTitle('⌨️ Commandes disponibles')
                    .setDescription('Pour améliorer l’organisation des commandes, elles sont groupées en **fonctionnalitées** :\n\n**- Passer commande : 💬**\n\n**- Enregistrer/Gérer une création : 🖼️**\n\n**- Configurer le système de commandes/tickets sur un serveur : ⚙️**\n\n**- Information sur le bot : 📊**\n\nChaque commande doit s’écrire avec un **prefix** pour permettre à Graph Bot de la prendre en compte, ce qui donne `' + prefix + '[commande]` !\n\nUne commande peut comporter une ou plusieurs **option/s**, elles seront affichées entre des `[option, option, option]` !\nPour utiliser les commandes, les crochets doivent être supprimés !\n\n**Certaines fonctionnalitées contiennent plusieurs pages, vous pouvez y navigez en cliquant sur les réactions 1️⃣, 2️⃣, 3️⃣, 4️⃣ et 🇦, 🇧**')
                    .setColor('00FF00')
                    .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                    reaction.message.reactions.removeAll()
                    msg.react('ℹ️')
                    msg.react('💬')
                    msg.react('🖼️')
                    msg.react('⚙️')
                    msg.react('📊')
                })
            }
        }
        if (reaction.emoji.name === 'ℹ️') {
            reaction.message.edit(new Discord.MessageEmbed()
                .setTitle('ℹ️ Commande help')
                .setDescription('La commande help se partage en **2 parties** :\n\n**- explication et but du bot : 🤖**\n\n**- commandes disponibles : ⌨️**\n\nChaque partie est affichée en cliquant sur la réaction adéquat !\n\nPour faire un retour en arrière dans les messages qui vont suivres, il vous suffit de cliquer sur la réaction avec l\'emoji présent dans le titre du dernier message !\n\nPour avoir plus d\'information, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !')
                .setColor('00FF00')
                .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                reaction.message.reactions.removeAll()
                msg.react('🤖')
                msg.react('⌨️')
            })
        }
        if (reaction.emoji.name === '💬') {
            reaction.message.edit(new Discord.MessageEmbed()
                .setTitle('💬 Passer commande')
                .setDescription('`' + prefix + 'cmd [la description de votre commande]` : permet de passer commande sur un serveur, par la suite si un graphiste accepte votre commande un ticket sera créé entre vous et lui ! Votre description doit comprendre le prix minimum que vous pouvez allouer à votre demande, ainsi qu’une brève description de celle-ci !\n\n**⚠️ Cette commande doit être tapée sur un serveur obligatoirement !**')
                .setColor('00FF00')
                .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                reaction.message.reactions.removeAll()
                msg.react('⌨️')
            })
        }
        if (reaction.emoji.name === '🖼️' || reaction.emoji.name === '1️⃣') {
            reaction.message.edit(new Discord.MessageEmbed()
                .setTitle('🖼️ Enregistrer/Gérer une création (page 1️⃣)')
                .setDescription('`' + prefix + 'addcrea [votre création]` : permet d’enregistrer une création dans la base de données !\n\n(votre création doit être envoyer dans le même message que la commande, mais en pièce jointe (le + situé à gauche de la zone d’écriture))\n\n`' + prefix + 'addpreuve [numéro de votre création] [votre preuve]` : permet d’enregistrer une preuve dans la base de données, une preuve est un screen du projet (photoshop, gimp, etc…) de la création ou l’on peut voir les calques, elle est relié au numéro de la création entré dans la commande !\n\n(votre preuve doit être envoyer dans le même message que la commande, mais en pièce jointe (le + situé à gauche de la zone d’écriture))\n\n(le numéro d’une création s’obtient en tapant `' + prefix + 'viewcrea`)\n\n⚠️ **Cette commande doit être tapée dans les messages MP avec Graph Bot obligatoirement !**\n\nLorsqu\'une preuve est enregistrée, elle est envoyée en examen pour déterminer si oui ou non, elle permet de confirmer que la création qui lui est reliée vous appartient ! Si oui, votre création sera **validée**, un emoji ✅ sera affiché avec votre création !')
                .setColor('00FF00')
                .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                reaction.message.reactions.removeAll()
                msg.react('⌨️')
                msg.react('2️⃣')
                msg.react('3️⃣')
                msg.react('4️⃣')
            })
        }
        if (reaction.emoji.name === '2️⃣') {
            reaction.message.edit(new Discord.MessageEmbed()
                .setTitle('🖼️ Enregistrer/Gérer une création (page 2️⃣)')
                .setDescription('`' + prefix + 'viewcrea [@membre, ID d’un utilisateur, rien]` : permet d’afficher les créations, description, d’un utilisateur ! Si vous ne rentrez aucunes options, cela affichera vos créations !\n\n`' + prefix + 'viewpreuve` : permet d’afficher les preuves qui sont reliées à vos créations ! Comme une preuve est privée pour des raisons de sécurité, seul vous pouvez les voir !\n\n⚠️ **Cette commande doit être tapée dans les messages MP avec Graph Bot obligatoirement !**\n\n`' + prefix + 'descript [une description]` : permet d’enregistrer une description de votre profil dans la base de données, elle sera affichée avec vos créations !')
                .setColor('00FF00')
                .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                reaction.message.reactions.removeAll()
                msg.react('⌨️')
                msg.react('1️⃣')
                msg.react('3️⃣')
                msg.react('4️⃣')
            })
        }
        if (reaction.emoji.name === '3️⃣') {
            reaction.message.edit(new Discord.MessageEmbed()
                .setTitle('🖼️ Enregistrer/Gérer une création (page 3️⃣)')
                .setDescription('`' + prefix + 'setadvance [numéro d’une création]` : permet d’avertir les utilisateurs que la création au numéro entrer dans la commande n’est pas terminée ! Un emoji 🛠️ sera affiché avec votre création !\n\n(le numéro d’une création s’obtient en tapant `' + prefix + 'viewcrea`)\n\n`' + prefix + 'setadvance [numéro d’une création] [création finalisé]` : permet de remplacer votre création non terminée par celle finalisé ! L’emoji 🛠️ sera remplacer par ✅ quand votre création sera affiché !\n\n(le numéro d’une création s’obtient en tapant `' + prefix + 'viewcrea`)\n\n(votre création doit être envoyer dans le même message que la commande, mais en pièce jointe (le + situé à gauche de la zone d’écriture))\n\n⚠️ **Cette commande ne fonctionne que si vous avez tapé au par avant `' + prefix + 'setadvance [numéro d\'une création]` !**\n\n⚠️ **La validation de la création saute automatiquement à chaque modification de celles-ci !**')
                .setColor('00FF00')
                .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                reaction.message.reactions.removeAll()
                msg.react('⌨️')
                msg.react('1️⃣')
                msg.react('2️⃣')
                msg.react('4️⃣')
            })
        }
        if (reaction.emoji.name === '4️⃣') {
            reaction.message.edit(new Discord.MessageEmbed()
                .setTitle('🖼️ Enregistrer/Gérer une création (page 4️⃣)')
                .setDescription('`' + prefix + 'deletecrea [numéro d’une création]` : permet de supprimer de la base de données la création et les/la preuve/s entré dans la commande !\n\n(le numéro d’une création s’obtient en tapant `' + prefix + 'viewcrea`)\n\n⚠️ **Lorsque cette commande est tapée, aucun retour en arrière n\'est possible !**\n\n`' + prefix + 'delete` : permet de supprimer toutes les créations, preuves, description, de la base de données !\n\n⚠️ **Lorsque cette commande est tapée, aucun retour en arrière n\'est possible !**')
                .setColor('00FF00')
                .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                reaction.message.reactions.removeAll()
                msg.react('⌨️')
                msg.react('1️⃣')
                msg.react('2️⃣')
                msg.react('3️⃣')
            })
        }
        if (reaction.emoji.name === '⚙️' || reaction.emoji.name === '🇦') {
            reaction.message.edit(new Discord.MessageEmbed()
                .setTitle('⚙️ Configurer le système de commandes/tickets sur un serveur (page 🇦)')
                .setDescription('`' + prefix + 'init` : permet de configurer le système de commande. Après l’avoir tapé, le bot va créer un channel ou les clients pourront passer commande, un channel permettant au graphiste d\'accepter les commandes des clients, ainsi qu’une catégorie qui stockera les tickets de commandes et les 2 channels décrits ci-dessus.\n\n(pour supprimer le système sur votre serveur, retaper la commande)\n\n(si par erreur vous supprimez un channel ou la catégorie créée par le bot, retaper la commande. Le bot va automatiquement détecter qu’il y a une anomalie et corriger le problème)\n\n⚠️ **Permission de pouvoir gérer le serveur obligatoire !**\n\n⚠️ **Cette commande doit être tapée sur un serveur obligatoirement !**')
                .setColor('00FF00')
                .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                reaction.message.reactions.removeAll()
                msg.react('⌨️')
                msg.react('🇧')
            })
        }
        if (reaction.emoji.name === '🇧') {
            reaction.message.edit(new Discord.MessageEmbed()
                .setTitle('⚙️ Configurer le système de commandes/tickets sur un serveur (page 🇧)')
                .setDescription('`' + prefix + 'tickets [nom des tickets]` : permet de créer une catégorie et d’envoyer un message avec une réaction dans le channel ou la commande a été tapée. Lorsque la réaction du message est cliquée, un ticket sera créé dans la catégorie.\n\n(le nom des tickets est facultatif)\n\n⚠️ **Permission de pouvoir gérer le serveur obligatoire !**\n\n⚠️ **Cette commande doit être tapée sur un serveur obligatoirement !**\n\n`' + prefix + 'setprefix [un prefix]` : permet de configurer un prefix sur le serveur ou vous vous situez !\n\n⚠️ **Permission de pouvoir gérer le serveur obligatoire !**\n\n⚠️ **Cette commande doit être tapée sur un serveur obligatoirement !**')
                .setColor('00FF00')
                .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                reaction.message.reactions.removeAll()
                msg.react('⌨️')
                msg.react('🇦')
            })
        }
        if (reaction.emoji.name === '📊') {
            reaction.message.edit(new Discord.MessageEmbed()
                .setTitle('📊 Information sur le bot')
                .setDescription('`' + prefix + 'help` : permet d’avoir des informations sur le bot est sur les commandes disponibles !\n**⚠️ Cela ne sert à rien de taper cette commande comme vous êtes déjà à l’intérieur de celles-ci !**\n\n`' + prefix + 'info` : permet d’avoir des informations sur le nombre de commandes tapées de manière individuelle, ou groupées ! Ainsi que le ping du bot ! (Actuellement `' + client.ws.ping + 'ms`.)')
                .setColor('00FF00')
                .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                reaction.message.reactions.removeAll()
                msg.react('⌨️')
            })
        }

    // Système commande help
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
        'regarder !gbhelp'
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
