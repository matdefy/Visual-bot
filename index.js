const Discord = require('discord.js')
const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})
const config = require('./config.json')
const fs = require('fs')
const Database = require('easy-json-database')
const db = new Database('./database.json')
const dbLogs = new Database('./database_logs.json')

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

client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return
    if (message.channel.type === 'dm') {
        if (message.content.startsWith(config.prefix + 'cmd') || message.content.startsWith(config.prefix + 'level') || message.content.startsWith(config.prefix + 'validcrea') || message.content.startsWith(config.prefix + 'setparentcmd') || message.content.startsWith(config.prefix + 'setchannelcmd') || message.content.startsWith(config.prefix + 'say') || message.content.startsWith(config.prefix + 'setprefix')) {
            return message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ Cette commande doit être tapée sur un serveur obligatoirement ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL()))
        } else {
            const args = message.content.trim().split(/ +/g)
            const commandName = args.shift().toLowerCase()
            if (!commandName.startsWith(config.prefix)) return
            const command = client.commands.get(commandName.slice(config.prefix.length))
            if (!command) return
            command.run(db, message, args, client, dbLogs)
            dbLogs.push('logs', {
                date: Date.now(),
                cmd: commandName.slice(config.prefix.length),
                userId: message.author.id
            })
        }
    } else {
        if (db.has('prefix_' + message.guild.id)) {
            const prefix = db.get('prefix_' + message.guild.id)
            if (message.content.startsWith(prefix + 'viewpreuve') || message.content.startsWith(prefix + 'addpreuve')) {
                return message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Cette commande doit être tapée dans le salon MP de Graph Bot obligatoirement ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
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
            if (message.content.startsWith(config.prefix + 'viewpreuve') || message.content.startsWith(config.prefix + 'addpreuve')) {
                return message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Cette commande doit être tapée dans le salon MP de Graph Bot obligatoirement ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            } else {
                const args = message.content.trim().split(/ +/g)
                const commandName = args.shift().toLowerCase()
                if (!commandName.startsWith(config.prefix)) return
                const command = client.commands.get(commandName.slice(config.prefix.length))
                if (!command) return
                command.run(db, message, args, client, dbLogs)
                dbLogs.push('logs', {
                    date: Date.now(),
                    cmd: commandName.slice(config.prefix.length),
                    userId: message.author.id
                })
            }
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

// Système qui gère la création des tickets pour le système de commande

client.on('messageReactionAdd', async (reaction, user) => {
    if (!user.bot) {
    } else { return }
    await reaction.fetch()
    if (reaction.message.channel.type === 'dm') return
    if (reaction.emoji.name === '✅' && reaction.message.author.id === client.user.id) {
        const channelID = db.get('channelcmd_' + reaction.message.guild.id)
        if (reaction.message.channel.id !== channelID) return
        // vérification que la catégorie stockée dans la base de données est valide
        const guildparents = reaction.message.guild.channels.cache
        const categoriestout = guildparents.filter((salon) => salon.type === 'category')
        const categoriesId = categoriestout.map(categorie => categorie.id)
        const dbcatcmd = db.get('catcmd_' + reaction.message.guild.id)
        if (categoriesId.includes(dbcatcmd)) {
            // vérification que la catégorie stockée dans la base de données est valide
            if (db.has('catcmd_' + reaction.message.guild.id)) {
                const catticketcmd = db.get('catcmd_' + reaction.message.guild.id)
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
                    parent: catticketcmd,
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
                        .setTitle('🔽 Comment passer commande ? 🔽')
                        .setDescription('client : (' + userID + ')\nDescription : ' + descriptcmd + '\ngraphiste : +' + user.id + '+ \n\nMerci d\'avoir créé un ticket de commande sur ' + guild.name + ' ! Veuillez maintenant décrire précisément votre commande !\n\nPour fermer le ticket cliquer sur la réaction 🔒\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                        .setColor('#00FF00')
                        .setFooter(config.version, client.user.avatarURL())).then(msg => {
                        msg.react('🔒')
                    })
                })

                client.users.cache.get(userID).send(new Discord.MessageEmbed()
                    .setTitle('🎉 Bonne nouvelle 🎉')
                    .setDescription('Un graphiste a accepté votre commande au numéro `' + commandID + '` sur le serveur ' + guild.name + ', un ticket vous a été créé !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                    .setColor('#00FF00')
                    .setFooter(config.version, client.user.avatarURL()))
                client.channels.cache.get('776063705480691722').send('ticket de commande numéro : `' + commandID + '` créé pour l\'utilisateur : (`' + userID + '`)')
                dbLogs.push('cmd', {
                    date: Date.now(),
                    cmd: commandID,
                    userId: userID,
                    guild: guild.id
                })
                reaction.message.delete()
            }
        } else {
            reaction.message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ La catégorie stockée dans la base de données pour afficher les commandes est invalide ! ⚠️\nTapez `!gbsetparentcmd [l\'identifiant d\'une catégorie]` pour ajouter une catégorie dans la base de données !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#e55f2a')
                .setFooter(config.version, client.user.avatarURL()))
        }
    }
})

// Système qui gère la création des tickets pour le système de commande

// Système qui gère la fermeture des tickets pour le système de commande

client.on('messageReactionAdd', async (reaction, user) => {
    if (!user.bot) {
    } else { return }
    await reaction.fetch()
    if (reaction.message.channel.type === 'dm') return
    if (reaction.message.channel.name.startsWith('ticket-')) {
        if (reaction.emoji.name === '🔒' && reaction.message.author.id === client.user.id) {
            reaction.message.channel.delete()
        }
    }
})

// Système qui gère la fermeture des tickets pour le système de commande

// Système qui gère la validation des créations

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) {
        return
    }
    await reaction.fetch()
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
                .setTitle('🎉 Bonne nouvelle 🎉')
                .setDescription('Votre création à l\'id : `' + creationID + '` a été vérifié ! Taper `*viewcrea` pour voir votre nouvelle validation !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#00FF00')
                .setFooter(config.version, client.user.avatarURL()))
            client.channels.cache.get('775411371189862410').send('Création numéro ' + creationID + ' de l\'utilisateur (`' + userID + '`) validée par ' + user.tag + ' (`' + user.id + '`)')
        } else {
            client.users.cache.get(userID).send(new Discord.MessageEmbed()
                .setTitle('⚠️ Preuve invalide ⚠️')
                .setDescription('Votre preuve n\'a pas permis de confirmer que la création à l\'id : `' + creationID + '` vous appartenez, veuillez donc revoir vos preuves !\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
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
})

// Système qui gère la validation des créations

// Système qui gère les sauvegardes de la base de données

const CronJob = require('cron').CronJob
const job = new CronJob('0 0 0 * * *', function () {
    const date = new Date()

    fs.writeFileSync('./backupdatabase/' + date.getDate() + '-' + (date.getMonth() + 1) + '.json', JSON.stringify(db.data, null, 2), 'utf-8')
}, null, true, 'Europe/Paris')
job.start()

// Système qui gère les sauvegardes de la base de données

// Système d'installhelp

client.on('messageReactionAdd', async (reaction, user) => {
    if (!user.bot) {
    } else { return }
    await reaction.fetch()
    if (reaction.message.channel.type === 'dm') return
    if (reaction.emoji.name === '➡️' && reaction.message.author.id === client.user.id) {
        const prefix = db.has('prefix_' + reaction.message.guild.id)
        const catcmd = db.has('catcmd_' + reaction.message.guild.id)
        const channelcmd = db.has('channelcmd_' + reaction.message.guild.id)
        if (prefix === false) {
            return reaction.message.channel.send(new Discord.MessageEmbed()
                .setTitle('⚙️ Configuration du prefix ⚙️')
                .setDescription('Chaque bot à ce que l\'on appelle un prefix, c\'est ce qui est utilisé pour appeler le bot !\nSi vous tapez `viewcrea` le bot ne va rien répondre, mais si vous tapez `!gbviewcrea` le bot va envoyer vos créations ! Le prefix est donc `!gb` pour l\'appelez !\n\nCette commande : `!gbsetprefix [votre prefix]` permet de modifier le prefix du bot sur le serveur ou vous vous situez !\n (Si vous souhaitez garder le prefix par defaut, taper : `!gb`)\n\n**Prérequis** :\n\n - Permission de Gérer le serveur\n\nPour suivre la configuration pas à pas, veuillez cliquer sur la réaction ➡️\n\nExemple d\'utilisation :')
                .setImage('https://cdn.discordapp.com/attachments/749269193425158205/791016477682565170/Capture_decran_2020-12-22_195653.png')
                .setColor('#e55f2a')
                .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                msg.react('➡️')
            })
        }
        if (catcmd === false) {
            return reaction.message.channel.send(new Discord.MessageEmbed()
                .setTitle('⚙️ Configuration de la catégorie pour la création des tickets ⚙️')
                .setDescription('Le système de prise de commande intègre la création de ticket, il faut donc savoir dans quelles catégories les tickets vont être créés !\n\nPour cela, faites un clic droit sur une catégorie et copiez l\'identifiant !\nPar la suite taper : `[le prefix du bot]setparentcmd [l\'identifiant d\'une catégorie]` les tickets vont maintenant être créés dans la catégorie sélectionnée !\n\n**Prérequis** :\n\n - Permission de Gérer le serveur\n\nPour suivre la configuration pas à pas, veuillez cliquer sur la réaction ➡️\n\nExemple d\'utilisation :')
                .setImage('https://cdn.discordapp.com/attachments/749269193425158205/791015381526773790/Capture_decran_2020-12-22_195232.png')
                .setColor('#e55f2a')
                .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                msg.react('➡️')
            })
        }
        if (channelcmd === false) {
            return reaction.message.channel.send(new Discord.MessageEmbed()
                .setTitle('⚙️ Configuration du salon pour la prise de commandes ⚙️')
                .setDescription('Après qu\'une personne ait passé une commande, elle va être stockée dans un salon.\nCe salon permettra au graphiste d\'accepter les commandes des clients en cliquant sur la réaction du message de la commande ! Un ticket va alors être créé pour le graphiste et le client !\n\nPour enregistrer un salon, faites un clic droit sur un salon et copiez l\'identifiant !\nPar la suite taper : `[le prefix du bot]setchannelcmd [l\'identifiant d\'un salon]` les commandes vont maintenant apparaître dans le salon sélectionné !\n\n**Prérequis** :\n\n - Permission de Gérer le serveur\n\nPour suivre la configuration pas à pas, veuillez cliquer sur la réaction ➡️\n\nExemple d\'utilisation :')
                .setImage('https://cdn.discordapp.com/attachments/749269193425158205/791014682407338005/Capture_decran_2020-12-22_194820.png')
                .setColor('#e55f2a')
                .setFooter(config.version, reaction.message.client.user.avatarURL())).then(msg => {
                msg.react('➡️')
            })
        }
        if (prefix === true && catcmd === true && channelcmd === true) {
            return reaction.message.channel.send(new Discord.MessageEmbed()
                .setTitle('✅ Votre serveur est entièrement configuré ✅')
                .setDescription('**Configuration actuelle du serveur :**')
                .addFields(
                    { name: 'prefix', value: prefix, inline: true },
                    { name: 'catégorie des tickets de commandes', value: catcmd, inline: true },
                    { name: 'salon des commandes', value: channelcmd, inline: true }
                )
                .setColor('#00FF00')
                .setFooter(config.version, reaction.message.client.user.avatarURL()))
        }
    }
})

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
