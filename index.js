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
let i = 5
setInterval(() => {
    client.user.setActivity(statuses[i], { type: 'PLAYING' })
    i = ++i % statuses.length
}, 20 * 1000)

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
    client.channels.cache.get('749985660181544980').send(`Le bot est sur le serveur ${guild.name}, avec ${guild.memberCount} membres ! **❤️Merci❤️**`)
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
                .setTitle('🔽 Comment enregistrer des créations ? 🔽')
                .setDescription('**(Ceci est un raccourci de la [documentation](https://graphbot.gitbook.io/graph-bot/) du bot, nous vous conseillons d\'aller directement sur celle-ci pour plus d\'information !)** \n \n`*addcrea [le fichier de votre création]` permet d\'ajouter une création dans la base de données! \n \nPar la suite pour pouvoir prouver que la création que vous venez d\'enregistrer est bien la votre, il faut envoyer un screen de votre logiciel (photoshop, gimp, etc...), ou une photo (si votre création est un dessin).\n \n`*addpreuve [le numéro de la création qui concerne la preuve] [le fichier de la preuve]` permet d\'ajouter des preuves pour une création en particulier ! (le numéro de la création qui concerne la preuve, se trouve dans le message que vous a envoyé le bot pour confirmer l\'enregistrement de votre création)\n \nMaintenant il ne vous reste plus qu\'a ajouter une description à votre profil (la description est facultative)\n \n`*descript [votre description]` permet d\'ajouter une description !\n \nEt voilà vous êtes paré pour vous faire recruter sur des serveurs de graphistes ! Si vous voulez voir toutes les commandes du bot tapez : `*help` \n \nMERCI 😉')
                .setColor('#00FF00')
                .setFooter(config.version, client.user.avatarURL()))
            client.channels.cache.get('751369171849314346').send('ticket créé pour ' + user.tag + ' (`' + user.id + '`)')
        })
    }
})

const CronJob = require('cron').CronJob
const job = new CronJob('0 0 0 * * *', function () {
    const date = new Date()

    fs.writeFileSync('./backupdatabase/' + date.getDate() + '-' + (date.getMonth() + 1) + '.json', JSON.stringify(db.data, null, 2), 'utf-8')
}, null, true, 'Europe/Paris')
job.start()

console.log('commande : "creation" activé ✅')
console.log('commande : "supp" activé ✅')
console.log('commande : "help" activé ✅')
console.log('commande : "voircreation" activé ✅')
console.log('commande : "preuve" activé ✅')
console.log('commande : "confircreation" activé ✅')
console.log('commande : "voirpreuve" activé ✅')
console.log('commande : bot connecté ✅')
