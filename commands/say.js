const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        if (message.author.id === '577803218881347613') {
            if (args[0]) {
                message.delete()
                message.channel.send(message.content.trim().slice(`${config.prefix}say`.length))
            } else {
                message.channel.send('<:warning_visualOrder:831154426034913310> **Veuillez entrer du texte !**')
            }
        } else {
            message.channel.send('⛔ **Vous n\'avez pas les permissions suffisantes !**')
        }
    }
}
