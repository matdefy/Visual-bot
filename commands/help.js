const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: (db, message, args, client) => {
        let prefix = '!vb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        if (!args[0]) {
            message.channel.send(new Discord.MessageEmbed()
                .setTitle('ℹ️ Commande help')
                .setDescription('La commande help se partage en **2 parties** :\n\n**- explication et but du bot : `' + prefix + 'help bot`**\n\n**- commandes disponibles : `' + prefix + 'help cmd`**\n\nChaque partie est affichée en tapant la commande associée !\n\nPour faire un retour en arrière dans les messages qui vont suivres, il vous suffit de taper la commande qui sera affiché à chaque fin des messages !\n\nLes messages de la commande help se supprime après 1:30 pour limiter l\'engorgement des channels ! (seulement sur les serveurs)\n\nPour avoir plus d\'information, une **[documentation](https://graphbot.gitbook.io/graph-bot/)** est disponible !')
                .setColor('#FEFEFE')
                .setFooter(config.version, message.client.user.avatarURL())).then((msg) => {
                if (message.channel.type !== 'dm') {
                    message.delete({ timeout: 100000 })
                    msg.delete({ timeout: 100000 })
                }
            })
        } else {
            if (args[0] === 'bot') {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('🤖 Explication et but du bot')
                    .setDescription('Visual Bot est un bot open source (son **[code](https://github.com/matdefy/Graph-bot)** est disponible librement), c’est un projet qui a pour but d’offrir un bot discord qui est en ligne 24h/24 7j/7 365j/365, et qui touche le milieu du graphisme !\n\nSon objectif est de simplifier les serveurs de ce thème avec par exemple un système de prise de commande intelligent, ou un enregistrement de création totalement gratuit !\n\nIl est équipé d’une **[documentation](https://graphbot.gitbook.io/graph-bot/)** qui permet de comprendre en détaille toutes ces commandes, et fonctionnalités !\nUn **[serveur](https://discord.gg/pUj3AK5u5V)** de support qui permet en cas de problème de pouvoir être aidé dans un délai le plus court possible !\nOu encore la possibilité de pouvoir proposer des **[suggestions](https://discord.gg/c7KfGJXBJY)** pour une amélioration constante du bot !\n\nPour revenir à la page principale taper `' + prefix + 'help`')
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL())).then((msg) => {
                    if (message.channel.type !== 'dm') {
                        message.delete({ timeout: 100000 })
                        msg.delete({ timeout: 100000 })
                    }
                })
            }
            if (args[0] === 'cmd') {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('⌨️ Commandes disponibles')
                    .setDescription('Pour améliorer l’organisation des commandes, elles sont groupées en **fonctionnalitées** :\n\n**- Passer commande/Signalement : `' + prefix + 'help createcmd`**\n\n**- Enregistrer/Gérer une création : `' + prefix + 'help crea [1, 2, 3, 4]`**\n\n**- Configurer les systèmes : `' + prefix + 'help config [1, 2, 3]`**\n\n**- Information sur le bot : `' + prefix + 'help info`**\n\nChaque commande doit s’écrire avec un **prefix** pour permettre à Visual Bot de la prendre en compte, ce qui donne `' + prefix + '[commande]` !\n\nUne commande peut comporter une ou plusieurs **option/s**, elles seront affichées entre des `[option, option, option]` !\nPour utiliser les commandes, les crochets doivent être supprimés !\n\nPour revenir à la page principale taper `' + prefix + 'help`')
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL())).then((msg) => {
                    if (message.channel.type !== 'dm') {
                        message.delete({ timeout: 100000 })
                        msg.delete({ timeout: 100000 })
                    }
                })
            }
        }
        if (args[0] === 'createcmd') {
            message.channel.send(new Discord.MessageEmbed()
                .setTitle('💬 Passer commande/Signalement')
                .setDescription('`' + prefix + 'cmd [la description de votre commande]` : permet de passer commande sur un serveur, par la suite si un graphiste accepte votre commande un ticket sera créé entre vous et lui ! Votre description doit comprendre le prix minimum que vous pouvez allouer à votre demande, ainsi qu’une brève description de celle-ci !\n\n**⚠️ Cette commande doit être tapée sur un serveur obligatoirement !**\n\n`' + prefix + 'signalement [ID de la personne signalé] [description du signalement] [preuve (cette option est falcultative)]` : permet de signaler un utilisateur, si votre signalement est correct l\'utilisateur sera banni de Visual Bot ! Une preuve est obligatoirement un screen d\'un channel ou l\'utilisateur est en tort, elle est obligatoire si la description ne contient pas un transcript d\'un salon créé par Visual Bot ou l\'utilisateur est en tort.\n\n(votre preuve doit être envoyer dans le même message que la commande, mais en pièce jointe (le + situé à gauche de la zone d’écriture))\n\nPour revenir à la page des commandes taper `' + prefix + 'help cmd`')
                .setColor('#FEFEFE')
                .setFooter(config.version, message.client.user.avatarURL())).then((msg) => {
                if (message.channel.type !== 'dm') {
                    message.delete({ timeout: 100000 })
                    msg.delete({ timeout: 100000 })
                }
            })
        }
        if (args[0] === 'crea') {
            if (args[1] === undefined || args[1] === '1') {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('🖼️ Enregistrer/Gérer une création (page 1️⃣)')
                    .setDescription('`' + prefix + 'addcrea [votre création]` : permet d’enregistrer une création dans la base de données !\n\n(votre création doit être envoyer dans le même message que la commande, mais en pièce jointe (le + situé à gauche de la zone d’écriture))\n\n`' + prefix + 'addpreuve [numéro de votre création] [votre preuve]` : permet d’enregistrer une preuve dans la base de données, une preuve est un screen du projet (photoshop, gimp, etc…) de la création ou l’on peut voir les calques, elle est relié au numéro de la création entré dans la commande !\n\n(votre preuve doit être envoyer dans le même message que la commande, mais en pièce jointe (le + situé à gauche de la zone d’écriture))\n\n(le numéro d’une création s’obtient en tapant `' + prefix + 'viewcrea`)\n\n⚠️ **Cette commande doit être tapée dans les messages MP avec Visual Bot obligatoirement !**\n\nLorsqu\'une preuve est enregistrée, elle est envoyée en examen pour déterminer si oui ou non, elle permet de confirmer que la création qui lui est reliée vous appartient ! Si oui, votre création sera **vérifiée**, un emoji `✅` sera affiché avec votre création !\n\nPour revenir à la page des commandes taper `' + prefix + 'help cmd`, pour passer à la page suivante taper `' + prefix + 'help crea 2`')
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL())).then((msg) => {
                    if (message.channel.type !== 'dm') {
                        message.delete({ timeout: 100000 })
                        msg.delete({ timeout: 100000 })
                    }
                })
            }
        }
        if (args[0] === 'crea') {
            if (args[1] === '2') {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('🖼️ Enregistrer/Gérer une création (page 2️⃣)')
                    .setDescription('`' + prefix + 'viewcrea [@membre, ID d’un utilisateur, rien]` : permet d’afficher les créations, description, d’un utilisateur ! Si vous ne rentrez aucunes options, cela affichera vos créations !\n\n`' + prefix + 'viewpreuve` : permet d’afficher les preuves qui sont reliées à vos créations ! Comme une preuve est privée pour des raisons de sécurité, seul vous pouvez les voir !\n\n⚠️ **Cette commande doit être tapée dans les messages MP avec Visual Bot obligatoirement !**\n\n`' + prefix + 'descript [une description]` : permet d’enregistrer une description de votre profil dans la base de données, elle sera affichée avec vos créations !\n\nPour revenir à la page des commandes taper `' + prefix + 'help cmd`, pour passer à la page suivante taper `' + prefix + 'help crea 3`')
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL())).then((msg) => {
                    if (message.channel.type !== 'dm') {
                        message.delete({ timeout: 100000 })
                        msg.delete({ timeout: 100000 })
                    }
                })
            }
        }
        if (args[0] === 'crea') {
            if (args[1] === '3') {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('🖼️ Enregistrer/Gérer une création (page 3️⃣)')
                    .setDescription('`' + prefix + 'setadvance [numéro d’une création] [création finalisé]` : permet de remplacer votre ancienne création par une nouvelle version de celle-ci !\n\n(le numéro d’une création s’obtient en tapant `' + prefix + 'viewcrea`)\n\n(votre création doit être envoyée dans le même message que la commande, mais en pièce jointe (le + situé à gauche de la zone d’écriture))\n\n⚠️ **La validation de la création saute automatiquement à chaque modification de celles-ci !**\n\n⚠️ **Cette commande doit être tapée dans les messages MP avec Visual Bot obligatoirement !**\n\nPour revenir à la page des commandes taper `' + prefix + 'help cmd`, pour passer à la page suivante taper `' + prefix + 'help crea 4`')
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL())).then((msg) => {
                    if (message.channel.type !== 'dm') {
                        message.delete({ timeout: 100000 })
                        msg.delete({ timeout: 100000 })
                    }
                })
            }
        }
        if (args[0] === 'crea') {
            if (args[1] === '4') {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('🖼️ Enregistrer/Gérer une création (page 4️⃣)')
                    .setDescription('`' + prefix + 'deletecrea [numéro d’une création]` : permet de supprimer de la base de données la création et les/la preuve/s entrées dans la commande !\n\n(le numéro d’une création s’obtient en tapant `' + prefix + 'viewcrea`)\n\n⚠️ **Lorsque cette commande est tapée, aucun retour en arrière n\'est possible !**\n\n`' + prefix + 'delete` : permet de supprimer toutes les créations, preuves, description, de la base de données !\n\n⚠️ **Lorsque cette commande est tapée, aucun retour en arrière n\'est possible !**\n\nPour revenir à la page des commandes taper `' + prefix + 'help cmd`')
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL())).then((msg) => {
                    if (message.channel.type !== 'dm') {
                        message.delete({ timeout: 100000 })
                        msg.delete({ timeout: 100000 })
                    }
                })
            }
        }
        if (args[0] === 'config') {
            if (args[1] === '1') {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('⚙️ Configurer les systèmes (page 🇦)')
                    .setDescription('`' + prefix + 'init` : permet de configurer le système de commande. Après l’avoir tapé, le bot va créer un channel ou les clients pourront passer commande, un channel permettant au graphiste d\'accepter les commandes des clients, ainsi qu’une catégorie qui stockera les tickets de commandes et les 2 channels décrits ci-dessus.\n\n(pour supprimer le système sur votre serveur, retaper la commande)\n\n(si par erreur vous supprimez un channel ou la catégorie créée par le bot, retaper la commande. Le bot va automatiquement détecter qu’il y a une anomalie et corriger le problème)\n\n⚠️ **Permission de pouvoir gérer le serveur obligatoire !**\n\n⚠️ **Cette commande doit être tapée sur un serveur obligatoirement !**\n\nPour revenir à la page des commandes taper `' + prefix + 'help cmd`, pour passer à la page suivante taper `' + prefix + 'help config 2`')
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL())).then((msg) => {
                    if (message.channel.type !== 'dm') {
                        message.delete({ timeout: 100000 })
                        msg.delete({ timeout: 100000 })
                    }
                })
            }
        }
        if (args[0] === 'config') {
            if (args[1] === '2') {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('⚙️ Configurer les systèmes (page 🇧)')
                    .setDescription('`' + prefix + 'tickets [nom des tickets (option falcultative)]` : permet de créer une catégorie et d’envoyer un message avec une réaction dans le channel ou la commande a été tapée. Lorsque la réaction du message est cliquée, un ticket sera créé dans la catégorie.\n\n(Si vous souhaitez désactiver un système de tickets, il vous suffit de cliquer sur la réaction `🔒` dans le message envoyé par le bot !)\n\n⚠️ **Permission de pouvoir gérer le serveur obligatoire !**\n\n⚠️ **Cette commande doit être tapée sur un serveur obligatoirement !**\n\n`' + prefix + 'setprefix [un prefix]` : permet de configurer un prefix sur le serveur ou vous vous situez !\n\n⚠️ **Permission de pouvoir gérer le serveur obligatoire !**\n\n⚠️ **Cette commande doit être tapée sur un serveur obligatoirement !**\n\nPour revenir à la page des commandes taper `' + prefix + 'help cmd`')
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL())).then((msg) => {
                    if (message.channel.type !== 'dm') {
                        message.delete({ timeout: 100000 })
                        msg.delete({ timeout: 100000 })
                    }
                })
            }
        }
        if (args[0] === 'config') {
            if (args[1] === '3') {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('⚙️ Configurer les systèmes (page )')
                    .setDescription('`' + prefix + 'setroles` : permet de configurer les rôles d\'un utilisateur/serveur. Quand cet utilisateur rejoint un serveur, si ce serveur a configuré les mêmes rôles que l\'utilisateur, automatiquement les rôles correspondants lui seront ajoutés ! Lorsque les rôles d\'un serveur sont configurés, ils sont automatiquement créés par le bot.\n\n(si vous supprimez un rôle créé par le bot, il sera automatiquement supprimé de la base de données)\n\n⚠️ **Permission de pouvoir gérer le serveur obligatoire pour configurer les rôles serveur !**\n\n⚠️ **Cette commande doit être tapée sur un serveur obligatoirement pour configurer les rôles serveur !**\n\n⚠️ **Cette commande doit être tapée dans les messages MP avec Visual Bot obligatoirement pour configurer les rôles utilisateur !**\n\nPour revenir à la page des commandes taper `' + prefix + 'help cmd`')
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL())).then((msg) => {
                    if (message.channel.type !== 'dm') {
                        message.delete({ timeout: 100000 })
                        msg.delete({ timeout: 100000 })
                    }
                })
            }
        }
        if (args[0] === 'info') {
            message.channel.send(new Discord.MessageEmbed()
                .setTitle('📊 Information sur le bot')
                .setDescription('`' + prefix + 'help` : permet d’avoir des informations sur le bot est sur les commandes disponibles !\n**⚠️ Cela ne sert à rien de taper cette commande comme vous êtes déjà à l’intérieur de celles-ci !**\n\n`' + prefix + 'info` : permet d’avoir des informations sur le nombre de commandes tapées de manière individuelle, ou groupées ! Ainsi que le ping du bot ! (Actuellement `' + client.ws.ping + 'ms`.)\n\nPour revenir à la page des commandes taper `' + prefix + 'help cmd`')
                .setColor('#FEFEFE')
                .setFooter(config.version, message.client.user.avatarURL())).then((msg) => {
                if (message.channel.type !== 'dm') {
                    message.delete({ timeout: 100000 })
                    msg.delete({ timeout: 100000 })
                }
            })
        }

        // Système commande help
    }

}
