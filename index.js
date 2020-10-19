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

// Système qui gère les commandes

fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(file.split('.')[0], command)
    })
})

// Système qui gère les commandes

// Système qui gère à quoi joue le bot

const statuses = [
    'créer un 📩 tickets 📩 dans le salon',
    '#demande-enregistrement',
    'pour enregistrer des 🎨 créations 🎨 !'
]
let i = 5
setInterval(() => {
    client.user.setActivity(statuses[i], { type: 'PLAYING' })
    i = ++i % statuses.length
}, 20 * 1000)

// Système qui gère à quoi joue le bot

// Système qui enregistre les commandes tapées

client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return

    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    command.run(db, message, args, client, dbLogs)
    dbLogs.push('logs', {
        date: Date.now(),
        cmd: commandName,
        userId: message.author.id
    })
})

// Système qui enregistre les commandes tapées

// Système qui envoie un message quand le bot est ajouté sur un serveur
client.on('guildCreate', (guild) => {
    client.channels.cache.get('749985660181544980').send(`Le bot est sur le serveur ${guild.name}, avec ${guild.memberCount} membres ! **❤️Merci❤️**`)
})

// Système qui envoie un message quand le bot est ajouté sur un serveur

// Système qui gère la création des tickets pour l'enregistrement des créations (à supp)

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.guild.channels.cache.some((channel) => channel.name === 'ticket-' + user.username.toLowerCase())) {
        return
    }
    await reaction.fetch()
    if (reaction.message.channel.id === '749226677292499035') {
        reaction.message.guild.channels.create('ticket-' + user.username, {
            parent: '748598039001956424',
            permissionOverwrites: [
                {
                    id: reaction.message.guild.id,
                    deny: [
                        'VIEW_CHANNEL'
                    ]
                },
                {
                    id: user.id,
                    allow: [
                        'VIEW_CHANNEL'
                    ]
                }
            ]
        }).then((channel) => {
            channel.send(new Discord.MessageEmbed()
                .setTitle('🔽 Comment enregistrer des créations ? 🔽')
                .setDescription('**(Ceci est un raccourci de la [documentation](https://graphbot.gitbook.io/graph-bot/) du bot, nous vous conseillons d\'aller directement sur celle-ci pour plus d\'information !)** \n \n`*addcrea [le fichier de votre création]` permet d\'ajouter une création dans la base de données! \n \nPar la suite pour pouvoir prouver que la création que vous venez d\'enregistrer est bien la votre, il faut envoyer un screenshot de votre logiciel (photoshop, gimp, etc...), ou une photo (si votre création est un dessin).\n \n`*addpreuve [le numéro de la création qui concerne la preuve] [le fichier de la preuve]` permet d\'ajouter des preuves pour une création en particulier ! Avec un screenshot du projet sur Photoshop par exemple comme dit précédemment ! (le numéro de la création qui concerne la preuve, se trouve dans le message que vous a envoyé le bot pour confirmer l\'enregistrement de votre création)\n \nMaintenant il ne vous reste plus qu\'a ajouter une description à votre profil (la description est facultative)\n \n`*descript [votre description]` permet d\'ajouter une description !\n \nEt voilà vous êtes paré pour vous faire recruter sur des serveurs de graphistes ! Si vous voulez voir toutes les commandes du bot tapez : `*help` \n \nMERCI 😉')
                .setColor('#00FF00')
                .setFooter(config.version, client.user.avatarURL()))
            client.channels.cache.get('751369171849314346').send('ticket créé pour ' + user.tag + ' (`' + user.id + '`)')
        })
    }
})

// Système qui gère la création des tickets pour l'enregistrement des créations (à supp)

// Système qui gère la création des tickets pour le système de commande

client.on('messageReactionAdd', async (reaction, user) => {
    if (!user.bot) {
    } else { return }
    await reaction.fetch()
    if (reaction.message.channel.id === '766663058369413130') {
        const description = reaction.message.embeds[0].description
        const userID = description.substring(
            description.lastIndexOf('(') + 1,
            description.lastIndexOf(')')
        )
        const commandID = description.substring(
            description.lastIndexOf('[') + 1,
            description.lastIndexOf(']')
        )
        reaction.message.guild.channels.create('ticket-' + userID, {
            parent: '766677454344683520',
            permissionOverwrites: [
                {
                    id: reaction.message.guild.id,
                    deny: [
                        'VIEW_CHANNEL'
                    ]
                },
                {
                    id: reaction.message.author.id,
                    allow: [
                        'VIEW_CHANNEL'
                    ]
                }
            ]
        }).then((channel) => {
            channel.send('<@' + userID + '>')
            channel.send(new Discord.MessageEmbed()
                .setTitle('🔽 Comment passer commande ? 🔽')
                .setDescription('Merci d\'avoir créé un ticket de commande sur ce serveur ! Veuillez maintenant décrire précisément votre commande !')
                .setColor('#00FF00')
                .setFooter(config.version, client.user.avatarURL()))
        })
        client.users.cache.get(userID).send(new Discord.MessageEmbed()
            .setTitle('🎉 Bonne nouvelle 🎉')
            .setDescription('Un graphiste a accepté votre commande au numéro `' + commandID + '`, un ticket vous a été créé !')
            .setColor('#00FF00')
            .setFooter(config.version, client.user.avatarURL()))
        client.channels.cache.get('766934052174430218').send('ticket de commande numéro : `' + commandID + '` créé pour l\'utilisateur : (`' + userID + '`)')
        reaction.message.delete()
    }
})

// Système qui gère la création des tickets pour le système de commande

// Système qui gère la validation des créations

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) {
        return
    }
    await reaction.fetch()
    if (reaction.message.channel.id === '764886091295358996') {
        const description = reaction.message.embeds[0].description
        const userID = description.substring(
            description.lastIndexOf('(') + 1,
            description.lastIndexOf(')')
        )
        const creationID = description.substring(
            description.lastIndexOf('[') + 1,
            description.lastIndexOf(']')
        )
        if (reaction.emoji.name === '✅') {
            const creations = db.get(userID)
            creations.find((creation) => creation.id === parseInt(creationID)).verif = '✅'
            db.set(userID, creations)
            client.users.cache.get(userID).send(new Discord.MessageEmbed()
                .setTitle('🎉 Bonne nouvelle 🎉')
                .setDescription('Votre création à l\'id : `' + creationID + '` a été vérifié ! Taper `*viewcrea` pour voir votre nouvelle validation !')
                .setColor('#00FF00')
                .setFooter(config.version, client.user.avatarURL()))
        } else {
            client.users.cache.get(userID).send(new Discord.MessageEmbed()
                .setTitle('❌ Preuve invalide ❌')
                .setDescription('Votre preuve n\'a pas permi de confirmer que la création à l\'id : `' + creationID + '` vous appartenez ! Veuillez donc revoir vos preuves !')
                .setColor('#00FF00')
                .setFooter(config.version, client.user.avatarURL()))
        }
        reaction.message.channel.messages.cache.filter(message => {
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
client.on('ready', async () => {
    client.channels.cache.get('764886091295358996').messages.fetch()
    console.log('✅ bot connecté ✅')
})
