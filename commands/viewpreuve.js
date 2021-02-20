const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args) => {
        let prefix = '!vb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        if (message.mentions.users.size === 1) {
            return message.channel.send('🛑 **Vous ne pouvez pas voir les preuves d\'une personne !**')
        }
        if (db.has('pr_' + message.author.id)) {
            const preuve2 = db.get('pr_' + message.author.id)
            const text2 = preuve2.map((crea) => 'Preuve pour la création numéro : `' + crea.id + '`')
            message.channel.send({
                embed: new Discord.MessageEmbed()
                    .setDescription(text2)
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL()),
                files: preuve2.map((crea) => {
                    return {
                        name: crea.id + '.' + crea.url.split('.').pop(),
                        attachment: crea.url
                    }
                })
            })
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription('⚠️ **Aucunes preuves enregistrées dans la base de données !**\n\n`' + prefix + 'addpreuve [numéro de votre création] [votre preuve]` : permet d’enregistrer une preuve dans la base de données, une preuve est un screen du projet (photoshop, gimp, etc…) de la création ou l’on peut voir les calques, elle est relié au numéro de la création entré dans la commande !\n\n(votre preuve doit être envoyer dans le même message que la commande, mais en pièce jointe (le + situé à gauche de la zone d’écriture))\n\n(le numéro d’une création s’obtient en tapant `' + prefix + 'viewcrea`)\n\nLorsqu\'une preuve est enregistrée, elle est envoyée en examen pour déterminer si oui ou non, elle permet de confirmer que la création qui lui est reliée vous appartient ! Si oui, votre création sera **vérifiée**, un emoji ✅ sera affiché avec votre création !\n\n**(Pour obtenir de l\'aide, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !)**')
                .setColor('#e55f2a')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
    }

}
