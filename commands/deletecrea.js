const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        const creationId = args[0]
        if (db.has(message.member.id)) {
            const creationIdverif = db.get(message.author.id).some((creation) => creation.id === parseInt(creationId))
            if (creationIdverif) {
                const nouveauTableau = db.get(message.author.id).filter((element) => element.id !== parseInt(creationId))
                db.set(message.author.id, nouveauTableau)
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('✅ Création et preuve(s) numéro ' + creationId + ' supprimées ✅')
                    .setColor('#00FF00')
                    .setFooter(config.version, message.client.user.avatarURL()))
                if (db.get(message.author.id).length === 0) {
                    db.delete(message.author.id)
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Création introuvable ⚠️\n\n**[documentation](https://graphbot.gitbook.io/graph-bot/)**')
                    .setColor('#00FF00')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ Aucune création enregistrée dans la base de données ⚠️\n\n**[documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#FF0000')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
        if (db.has('pr_' + message.author.id)) {
            const nouveauTableauPr = db.get('pr_' + message.author.id).filter((element2) => element2.id !== parseInt(creationId))
            db.set('pr_' + message.author.id, nouveauTableauPr)
            console.log('test')
            if (db.get('pr_' + message.author.id).length === 0) {
                db.delete('pr_' + message.author.id)
            }
        }
    }
}
