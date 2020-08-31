const Discord = require('discord.js')
const client = new Discord.Client()
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

client.on('ready', () => {
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
})

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

client.on('message', message => {
    if (message.guild.id === '747834737527226542' && message.author.id === '557628352828014614') {
        client.commands.get('regle').run(db, message, null, client)
    }
})

/* client.on('guildMemberRemove', member => {
    if (db.has(member.user.id)) {
        db.delete(member.user.id)
    }
}) */

console.log('commande : "creation" activé ✅')
console.log('commande : "supp" activé ✅')
console.log('commande : "help" activé ✅')
console.log('commande : "voircreation" activé ✅')
console.log('commande : "preuve" activé ✅')
console.log('commande : "confircreation" activé ✅')
console.log('commande : "voirpreuve" activé ✅')
console.log('commande : bot connecté ✅')
