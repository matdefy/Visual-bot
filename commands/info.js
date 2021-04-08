const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client, dbLogs) => {
        let prefix = config.prefix
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        if (!args[0]) {
            message.channel.send(new Discord.MessageEmbed()
                .setDescription(`ℹ️ **informations**\n\n**Pour afficher des informations sur un utilisateur tapez :** \`${prefix}info user [id user, mention user, rien]\`\n\n**Pour afficher des informations sur une commande tapez :** \`${prefix}info cmd [id cmd]\``)
                .setColor('#FF7B00')
                .setFooter(config.version, message.client.user.avatarURL()))
        }
        if (args[0] === 'cmd') {
            const cmdID = args[1]
            if (args[1]) {
                const cmd = db.get('cmd')
                const cmdid = cmd.find((cmd) => cmd.id === parseInt(cmdID))
                if (cmdid !== undefined) {
                    const prixcmd = cmdid.prix
                    const guildOUusercmd = cmdid.guildOUuser
                    const mdepcmd = cmdid.mdep
                    const delaicmd = cmdid.delai
                    const descriptcmd = cmdid.descript
                    const clientcmd = cmdid.client
                    const prestatairecmd = cmdid.prestataire
                    const transcriptcmd = cmdid.transcript
                    const statuecmd = cmdid.statue
                    let logo = '📮'
                    if (statuecmd === 'accepté') {
                        logo = '📩'
                    }
                    if (statuecmd === 'fermé') {
                        logo = '🔒'
                    }
                    if (statuecmd === 'signalé') {
                        logo = '☢️'
                    }
                    if (statuecmd === 'annulé') {
                        logo = '🗑️'
                    }
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`${logo} **Commande (\`${cmdID}\`)**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${clientcmd}>\n\n**-Prestataire : **<@${prestatairecmd}>\n\n**-Transcript : ${transcriptcmd}**\n\n**-Statue : **\`${statuecmd}\`\n\n**-Serveur ou utilisateur concerné : **\`${guildOUusercmd}\``)
                        .setColor('#FF7B00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                } else {
                    message.channel.send(`⚠️ **Commande : \`${cmdID}\` inconnue !**`)
                }
            } else {
                message.channel.send('⚠️ **Veuillez rentrer le numéro d\'une commande !**')
            }
        }
        if (args[0] === 'user') {
            let user = 0
            if (message.mentions.users.size === 1) {
                user = message.mentions.users.first().id
            } else {
                if (args[1] > 0) {
                    user = args[1]
                } else {
                    user = message.author.id
                }
            }
            const verifuser = client.users.cache.find((element) => element.id === user)
            if (verifuser) {
                const cmd = db.get('cmd')
                const clientnum = cmd.filter((cmd) => cmd.client === user).length
                const cmds = cmd.filter((cmd) => cmd.client === user)
                let cmdids = cmds.map((element) => element.id)
                const prestatairenum = cmd.filter((cmd) => cmd.prestataire === user).length
                const total = clientnum + prestatairenum
                let logo = '✅'
                const usersblacklist = db.get('blacklist')
                if (usersblacklist.includes(user)) {
                    logo = '☢️'
                }
                let statue = '**(membre valide)**'
                if (logo === '☢️') {
                    statue = '**(membre banni/e)**'
                }
                if (cmdids.length === 0) {
                    cmdids = '**aucune**'
                } else {
                    cmdids = `\`${cmdids.join('\`**,** \`')}\``
                }
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`${logo} **Utilisateur <@${user}>**\n\n**-Nombre de fois client : **\`${clientnum}\`\n\n**-Nombre de fois prestataire : **\`${prestatairenum}\`\n\n**-Commande/s participée/s :** ${cmdids}\n\n**-Statue : **${logo} ${statue}`)
                    .setColor('#FF7B00')
                    .setFooter(config.version, message.client.user.avatarURL()))
            } else {
                message.channel.send(`⚠️ **Utilisateur : \`${user}\` inconnu/e !**`)
            }
        }
    }
}
