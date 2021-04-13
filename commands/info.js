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
                    const prestataireconcernecmd = cmdid.prestataireconcerne
                    const guildconcernecmd = cmdid.guildconcerne
                    const mdepcmd = cmdid.mdep
                    const delaicmd = cmdid.delai
                    const descriptcmd = cmdid.descript
                    const clientcmd = cmdid.client
                    const transcriptcmd = cmdid.transcript
                    let prestatairecmd = cmdid.prestataire
                    const statutcmd = cmdid.statut
                    let transcriptview = ''
                    let logo = '📮'
                    if (statutcmd === 'acceptée') {
                        logo = '📩'
                    }
                    if (statutcmd === 'fermée') {
                        logo = '🔒'
                    }
                    if (statutcmd === 'signalée') {
                        logo = '☢️'
                    }
                    if (statutcmd === 'annulée') {
                        logo = '🗑️'
                    }
                    if (statutcmd === 'refusée') {
                        logo = '📪'
                    }
                    let infoprestataireconcerne = 'aucun'
                    if (prestataireconcernecmd) {
                        infoprestataireconcerne = `<@${prestataireconcernecmd}>`
                    }
                    let infoguildconcerne = 'aucun'
                    if (guildconcernecmd) {
                        infoguildconcerne = `\`${guildconcernecmd}\``
                    }
                    if (prestatairecmd === null) {
                        prestatairecmd = 'aucun'
                    } else {
                        prestatairecmd = `<@${prestatairecmd}>`
                    }
                    if (message.guild.id === '747834737527226542' && message.member.hasPermission('BAN_MEMBERS')) {
                        transcriptview = `\n\n**-Transcript : ${transcriptcmd}**`
                    }
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`${logo} **Commande (\`${cmdID}\`)**\n\n**-Description : **\`${descriptcmd}\`\n\n**-Prix : **\`${prixcmd}€\`\n\n**-Mode de paiement : **\`${mdepcmd}\`\n\n**-Délai : **\`${delaicmd} jour/s\`\n\n**-Client : **<@${clientcmd}>\n\n**-Prestataire : **${prestatairecmd}\n\n**-Statut : **\`${statutcmd}\`${transcriptview}\n\n**-Serveur concerné : **${infoguildconcerne}\n\n**-Prestataire concerné : **${infoprestataireconcerne}`)
                        .setColor('#FF7B00')
                        .setFooter(config.version, message.client.user.avatarURL()))
                } else {
                    message.channel.send(`<:warning_visualorder:831550961625464832> **Commande : \`${cmdID}\` inconnue !**`)
                }
            } else {
                message.channel.send('<:warning_visualorder:831550961625464832> **Veuillez entrer le numéro d\'une commande !**')
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
                const clientcmds = cmd.filter((cmd) => cmd.client === user)
                const clientcmdids = clientcmds.map((element) => element.id)
                const prestatairecmds = cmd.filter((cmd) => cmd.prestataire === user)
                const prestatairecmdids = prestatairecmds.map((element) => element.id)
                const prestatairenum = cmd.filter((cmd) => cmd.prestataire === user).length
                let cmds = clientcmdids.concat(prestatairecmdids)
                let logo = '<:white_check_mark_visualorder:831550961763614731>'
                const usersblacklist = db.get('blacklist')
                if (usersblacklist.includes(user)) {
                    logo = '☢️'
                }
                let statut = '**(membre valide)**'
                if (logo === '☢️') {
                    statut = '**(membre banni/e)**'
                }
                if (cmds.length === 0) {
                    cmds = '**aucune**'
                } else {
                    cmds = `\`${cmds.join('\`**,** \`')}\``
                }
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`${logo} **Utilisateur <@${user}>**\n\n**-Nombre de fois client : **\`${clientnum}\`\n\n**-Nombre de fois prestataire : **\`${prestatairenum}\`\n\n**-Commande/s participée/s :** ${cmds}\n\n**-Statut : **${logo} ${statut}`)
                    .setColor('#FF7B00')
                    .setFooter(config.version, message.client.user.avatarURL()))
            } else {
                message.channel.send(`<:warning_visualorder:831550961625464832> **Utilisateur : \`${user}\` inconnu/e !**`)
            }
        }
    }
}
