const Discord = require('discord.js'),
    client = new Discord.Client(),
    config = require('./config.json'),
    fs = require('fs'),
    Database = require("easy-json-database"),
    db = new Database("./database.json")
 
client.login(config.token)
client.commands = new Discord.Collection()
 
fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(file.split(".")[0], command)
    })
})


client.on('message', message => {
    if(message.channel.type === 'dm') return;
    if (message.type !== 'DEFAULT' || message.author.bot) return
    
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    command.run(db, message, args, client)

})

client.on('message', message => {
    if (message.author.id === '557628352828014614') {
        client.commands.get('regle').run(db, message, null, client) 
        
    }

})


client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`${member} a rejoint. ${member.guild.memberCount} Membre`)
    member.roles.add(config.greeting.role)
})

client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`${member.user.tag} a quitté. ${member.guild.memberCount} Membre`)
    if (db.has(member.user.id)) {
        db.delete(member.user.id)
    }
})