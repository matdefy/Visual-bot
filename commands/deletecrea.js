const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        const creationId = args[0]
        if (db.has('crea_' + message.author.id)) {
            const creationIdverif = db.get('crea_' + message.author.id).some((creation) => creation.id === parseInt(creationId))
            if (creationIdverif) {
                const nouveauTableau = db.get('crea_' + message.author.id).filter((element) => element.id !== parseInt(creationId))
                db.set('crea_' + message.author.id, nouveauTableau)
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('✅ Création et preuve(s) numéro `' + creationId + '` supprimées ! ✅\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                    .setColor('#00FF00')
                    .setFooter(config.version, message.client.user.avatarURL()))
                if (db.get('crea_' + message.author.id).length === 0) {
                    db.delete('crea_' + message.author.id)
                }
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('⚠️ Veuillez entrer le numéro d\'une création valide ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                    .setColor('#e55f2a')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ Aucune création enregistrée dans la base de données ! ⚠️\n\n**[Documentation](https://graphbot.gitbook.io/graph-bot/)**')
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
        if (db.has('pr_' + message.author.id)) {
            const nouveauTableauPr = db.get('pr_' + message.author.id).filter((element2) => element2.id !== parseInt(creationId))
            db.set('pr_' + message.author.id, nouveauTableauPr)
            if (db.get('pr_' + message.author.id).length === 0) {
                db.delete('pr_' + message.author.id)
            }
        }
    }
}
