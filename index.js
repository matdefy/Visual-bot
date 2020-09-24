const Discord = require('discord.js')
const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})
const config = require('./config.json')
const fs = require('fs')
const Database = require('easy-json-database')
const db = new Database('./database.json')

client.login(config.token)
client.commands = new Discord.Collection()

fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(file.split('.')[0], command)
    })
})

const statuses = [
    'créer un 📩 tickets 📩 dans le salon',
    '#demande-enregistrement',
    'pour enregistrer des 🎨 créations 🎨 !'
]
var i = 0
setInterval(() => {
    client.user.setActivity(statuses[i], { type: 'PLAYING' })
    i = ++i % statuses.length
}, 1e4)

client.on('message', message => {
    if (message.channel.type === 'dm') return
    if (message.type !== 'DEFAULT' || message.author.bot) return

    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    command.run(db, message, args, client)
})

client.on('guildCreate', (guild) => {
    client.channels.cache.get('749985660181544980').send(`Le bot est sur le serveur ${guild.name} avec ${guild.memberCount}`)
})

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
                .setTitle('Règle 🔽')
                .setDescription('1 - Pour envoyer vos créations, tapez *creation puis entrez votre image. Le bot va alors vous confirmer que votre création est enregistrée dans la base de donnée. Veuillez réitérer cette opération pour chacune de vos créations !\n \n2 - Après avoir entré toutes vos créations, envoyez une ou plusieurs preuves pour chacune d\'elle. Une preuve peut-être un screen de votre logiciel avec votre création ouverte, ou l\'envoi direct d\'un fichier (Photoshop, ...) de votre création (pour les fichiers Photoshop, GIMP, etc... il est obligatoire que cela soit sous forme de lien. Vous pouvez par exemple créer un lien Mega, ou google drive). Si cela n\'est pas suffisant pour confirmer que c\'est bien vous qui avez les droits de la création, nous pourrons tout simplement refuser votre enregistrement pour la création concernée ! ⚠️ Avant d\'envoyer une preuve veuillez taper *preuve {le numéro de votre création} (si vous l\'avez envoyée en 1er, 2eme, etc...) et ensuite la preuve. Veuillez réitérer l\'opération pour chaque preuve ! ⚠️\n \nVous serez recontacté pour vous informer de la bonne ou mauvaise nouvelle pour l\'enregistrement de vos œuvres, Cela peut prendre 24h au maximum...')
                .setColor('#00FF00')
                .setFooter(config.version, client.user.avatarURL()))
        })
    }
})

/* client.on('guildMemberAdd', member => {
    member.createDM().then(channel => {
        channel.send(new Discord.MessageEmbed()
            .setTitle('Bienvenue sur le serveur de Graph Bot ! ')
            .setDescription('Pour ✅ enregistrer ✅ des créations, il vous suffit de vous rendre dans le salon `#📮demande-enregistrement📮`, et de créé un ticket ! \n \nSi vous voulez voir les créations des gens, rendez vous dans le salon `#🤖commande-bot🤖` , puis taper la commande `*viewcrea [@user]` \n \n(plus d\'informations sur les commandes en tapant `*help` dans le salon `#🤖commande-bot🤖` !')
            .setColor('#00FF00')
            .setFooter(config.version, 'https://cdn.discordapp.com/attachments/749269193425158205/750004928348422254/graph_bot_3.png'))
    })
}) */

console.log('commande : "creation" activé ✅')
console.log('commande : "supp" activé ✅')
console.log('commande : "help" activé ✅')
console.log('commande : "voircreation" activé ✅')
console.log('commande : "preuve" activé ✅')
console.log('commande : "confircreation" activé ✅')
console.log('commande : "voirpreuve" activé ✅')
console.log('commande : bot connecté ✅')
