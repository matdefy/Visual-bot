/* eslint-disable prefer-const */
const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    run: async (db, message, args, client, dbLogs) => {
        let prefix = '!vb'
        if (message.channel.type !== 'dm') {
            if (db.has('prefix_' + message.guild.id)) {
                prefix = db.get('prefix_' + message.guild.id)
            }
        }
        if (message.channel.type === 'dm') {
            if (!db.has(`roles_${message.author.id}`)) {
                db.set(`roles_${message.author.id}`, {
                    graph: false,
                    dessin: false,
                    monteur: false,
                    design: false
                })
            }
            if (args[0] === undefined) {
                let graph = db.get('roles_' + message.author.id).graph
                let dessin = db.get('roles_' + message.author.id).dessin
                let monteur = db.get('roles_' + message.author.id).monteur
                let design = db.get('roles_' + message.author.id).design
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription('**⚙️ Configuration des rôles utilisateur**\n\nChaque rôle à une réaction attitrée, il vous suffit **d\'envoyer la commande** d\'un rôle pour vous le **rajoutez/enlever** :\n\n- **Graphiste** (' + graph + ') : `' + prefix + 'setroles graph`\n\n- **Dessinateur/trice** (' + dessin + ') : `' + prefix + 'setroles dessin`\n\n- **Monteur** (' + monteur + ') : `' + prefix + 'setroles monteur`\n\n- **Designer** (' + design + ') : `' + prefix + 'setroles design`\n\nSi vous souhaitez **mettre à jour** vos rôles (par exemple, si vous vous êtes ajouté/enlevé un rôle alors que vous étiez déjà sur des serveurs), il vous suffit de taper `' + prefix + 'setroles refresh` sur les différents serveurs !')
                    .setColor('#FEFEFE')
                    .setFooter(config.version, message.client.user.avatarURL()))
            }
            if (args[0] === 'graph') {
                if (db.get('roles_' + message.author.id).graph === true) {
                    const roles = db.get(`roles_${message.author.id}`) // là tu récupères l'objet
                    roles.graph = false // là tu le modifies
                    db.set(`roles_${message.author.id}`, roles) // là tu le sauvegardes
                    return message.channel.send('✅ **Role graphiste supprimé à l\'utilisateur **`' + message.author.id + '` **!**')
                }
                const roles = db.get(`roles_${message.author.id}`) // là tu récupères l'objet
                roles.graph = true // là tu le modifies
                db.set(`roles_${message.author.id}`, roles) // là tu le sauvegardes
                message.channel.send('✅ **Role graphiste ajouté à l\'utilisateur **`' + message.author.id + '` **!**')
            }
            if (args[0] === 'dessin') {
                if (db.get('roles_' + message.author.id).dessin === true) {
                    const roles = db.get(`roles_${message.author.id}`) // là tu récupères l'objet
                    roles.dessin = false // là tu le modifies
                    db.set(`roles_${message.author.id}`, roles) // là tu le sauvegardes
                    return message.channel.send('✅ **Role dessinateur/trice supprimé à l\'utilisateur **`' + message.author.id + '` **!**')
                }
                const roles = db.get(`roles_${message.author.id}`) // là tu récupères l'objet
                roles.dessin = true // là tu le modifies
                db.set(`roles_${message.author.id}`, roles) // là tu le sauvegardes
                message.channel.send('✅ **Role dessinateur/trice ajouté à l\'utilisateur **`' + message.author.id + '` **!**')
            }
            if (args[0] === 'monteur') {
                if (db.get('roles_' + message.author.id).monteur === true) {
                    const roles = db.get(`roles_${message.author.id}`) // là tu récupères l'objet
                    roles.monteur = false // là tu le modifies
                    db.set(`roles_${message.author.id}`, roles) // là tu le sauvegardes
                    return message.channel.send('✅ **Role monteur supprimé à l\'utilisateur **`' + message.author.id + '` **!**')
                }
                const roles = db.get(`roles_${message.author.id}`) // là tu récupères l'objet
                roles.monteur = true // là tu le modifies
                db.set(`roles_${message.author.id}`, roles) // là tu le sauvegardes
                message.channel.send('✅ **Role monteur ajouté à l\'utilisateur **`' + message.author.id + '` **!**')
            }
            if (args[0] === 'design') {
                if (db.get('roles_' + message.author.id).design === true) {
                    const roles = db.get(`roles_${message.author.id}`) // là tu récupères l'objet
                    roles.design = false // là tu le modifies
                    db.set(`roles_${message.author.id}`, roles) // là tu le sauvegardes
                    return message.channel.send('✅ **Role designer supprimé à l\'utilisateur **`' + message.author.id + '` **!**')
                }
                const roles = db.get(`roles_${message.author.id}`) // là tu récupères l'objet
                roles.design = true // là tu le modifies
                db.set(`roles_${message.author.id}`, roles) // là tu le sauvegardes
                message.channel.send('✅ **Role designer ajouté à l\'utilisateur **`' + message.author.id + '` **!**')
            }
        } else {
            if (args[0] === 'refresh') {
                if (db.has('roles_' + message.author.id)) {
                    if (db.has('roles_' + message.guild.id)) {
                        const roleaffiche = {
                            graph: 'graphiste',
                            dessin: 'dessinateur',
                            monteur: 'monteur',
                            design: 'designer'
                        }
                        const roles = [
                            'graph',
                            'dessin',
                            'monteur',
                            'design'
                        ]
                        roles.forEach(role => {
                            if (db.get('roles_' + message.author.id)[role] === true) {
                                if (db.get('roles_' + message.guild.id)[role] !== 0) {
                                    const guildroles = message.guild.roles.cache
                                    const rolesId = guildroles.map(roles => roles.id)
                                    const roleId = db.get('roles_' + message.guild.id)[role]
                                    if (rolesId.includes(roleId)) {
                                        if (!message.member.roles.cache.get(roleId)) {
                                            message.member.roles.add(roleId)
                                            client.users.cache.get(message.author.id).send(`✅ **Rôle ${roleaffiche[role]} ajouté sur le serveur **\`${message.guild.id}\`** !**`)
                                        }
                                    } else {
                                        const roles = db.get(`roles_${message.guild.id}`) // là tu récupères l'objet
                                        roles[role] = 0 // là tu le modifies
                                        db.set(`roles_${message.guild.id}`, roles) // là tu le sauvegardes
                                    }
                                }
                            } else {
                                if (db.get('roles_' + message.guild.id)[role] !== 0) {
                                    const guildroles = message.guild.roles.cache
                                    const rolesId = guildroles.map(roles => roles.id)
                                    const roleId = db.get('roles_' + message.guild.id)[role]
                                    if (rolesId.includes(roleId)) {
                                        if (message.member.roles.cache.get(roleId)) {
                                            message.member.roles.remove(roleId)
                                            client.users.cache.get(message.author.id).send(`✅ **Rôle ${roleaffiche[role]} enlevé sur le serveur **\`${message.guild.id}\`** !**`)
                                        }
                                    } else {
                                        const roles = db.get(`roles_${message.guild.id}`) // là tu récupères l'objet
                                        roles[role] = 0 // là tu le modifies
                                        db.set(`roles_${message.guild.id}`, roles) // là tu le sauvegardes
                                    }
                                }
                            }
                        })
                        return message.channel.send('✅ **Refresh effectué avec succès !**')
                    }
                }
            }
            if (message.member.hasPermission('KICK_MEMBERS')) {
                if (!db.has(`roles_${message.guild.id}`)) {
                    db.set(`roles_${message.guild.id}`, {
                        graph: 0,
                        dessin: 0,
                        monteur: 0,
                        design: 0
                    })
                }
                if (args[0] === undefined) {
                    let graph = db.get('roles_' + message.guild.id).graph !== 0
                    let dessin = db.get('roles_' + message.guild.id).dessin !== 0
                    let monteur = db.get('roles_' + message.guild.id).monteur !== 0
                    let design = db.get('roles_' + message.guild.id).design !== 0
                    const roles = [
                        'graph',
                        'dessin',
                        'monteur',
                        'design'
                    ]
                    roles.forEach(role => {
                        const guildroles = message.guild.roles.cache
                        const rolesId = guildroles.map(roles => roles.id)
                        // verif rôles
                        if (role) {
                            const roleIdverif = db.get('roles_' + message.guild.id)[role]
                            if (!rolesId.includes(roleIdverif)) {
                                const roles = db.get(`roles_${message.guild.id}`) // là tu récupères l'objet
                                roles[role] = 0 // là tu le modifies
                                db.set(`roles_${message.guild.id}`, roles) // là tu le sauvegardes
                            }
                        }
                    // verif rôles
                    })
                    graph = db.get('roles_' + message.guild.id).graph !== 0
                    dessin = db.get('roles_' + message.guild.id).dessin !== 0
                    monteur = db.get('roles_' + message.guild.id).monteur !== 0
                    design = db.get('roles_' + message.guild.id).design !== 0
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription('**⚙️ Configuration des rôles serveur**\n\nChaque rôle à une réaction attitrée, il vous suffit **d\'envoyer la commande** d\'un rôle pour le **rajoutez/enlever** au serveur :\n\n- **Graphiste** (' + graph + ') : `' + prefix + 'setroles graph`\n\n- **Dessinateur/trice** (' + dessin + ') : `' + prefix + 'setroles dessin`\n\n- **Monteur** (' + monteur + ') : `' + prefix + 'setroles monteur`\n\n- **Designer** (' + design + ') : `' + prefix + 'setroles design`\n\nN\'hésitez pas à **modifier** les rôles créés par le bot pour leurs donner le style de votre serveur ! 😉')
                        .setColor('#FEFEFE')
                        .setFooter(config.version, message.client.user.avatarURL()))
                }
                if (args[0] === 'graph') {
                    const guildroles = message.guild.roles.cache
                    const rolesId = guildroles.map(roles => roles.id)
                    if (db.has('roles_' + message.guild.id)) {
                        const roleIdverif = db.get('roles_' + message.guild.id).graph
                        if (rolesId.includes(roleIdverif)) {
                            message.guild.roles.cache.get(roleIdverif).delete()
                            const roles = db.get(`roles_${message.guild.id}`) // là tu récupères l'objet
                            roles.graph = 0 // là tu le modifies
                            db.set(`roles_${message.guild.id}`, roles) // là tu le sauvegardes
                            return message.channel.send('✅ **Role graphiste supprimé du serveur !**')
                        }
                    }
                    await message.guild.roles.create({
                        data: {
                            name: 'Graphiste',
                            color: 'WHITE'
                        }
                    }).then((role) => {
                        const roles = db.get(`roles_${message.guild.id}`) // là tu récupères l'objet
                        roles.graph = role.id // là tu le modifies
                        db.set(`roles_${message.guild.id}`, roles) // là tu le sauvegardes
                    })
                    message.channel.send('✅ **Role graphiste ajouté au serveur **`' + message.guild.id + '` **!**')
                }
                if (args[0] === 'dessin') {
                    const guildroles = message.guild.roles.cache
                    const rolesId = guildroles.map(roles => roles.id)
                    if (db.has('roles_' + message.guild.id)) {
                        const roleIdverif = db.get('roles_' + message.guild.id).dessin
                        if (rolesId.includes(roleIdverif)) {
                            message.guild.roles.cache.get(roleIdverif).delete()
                            const roles = db.get(`roles_${message.guild.id}`) // là tu récupères l'objet
                            roles.dessin = 0 // là tu le modifies
                            db.set(`roles_${message.guild.id}`, roles) // là tu le sauvegardes
                            return message.channel.send('✅ **Role dessinateur/trice supprimé du serveur !**')
                        }
                    }
                    await message.guild.roles.create({
                        data: {
                            name: 'Dessinateur/trice',
                            color: 'WHITE'
                        }
                    }).then((role) => {
                        const roles = db.get(`roles_${message.guild.id}`) // là tu récupères l'objet
                        roles.dessin = role.id // là tu le modifies
                        db.set(`roles_${message.guild.id}`, roles) // là tu le sauvegardes
                    })
                    message.channel.send('✅ **Role dessinateur/trice ajouté au serveur **`' + message.guild.id + '` **!**')
                }
                if (args[0] === 'monteur') {
                    const guildroles = message.guild.roles.cache
                    const rolesId = guildroles.map(roles => roles.id)
                    if (db.has('roles_' + message.guild.id)) {
                        const roleIdverif = db.get('roles_' + message.guild.id).monteur
                        if (rolesId.includes(roleIdverif)) {
                            message.guild.roles.cache.get(roleIdverif).delete()
                            const roles = db.get(`roles_${message.guild.id}`) // là tu récupères l'objet
                            roles.monteur = 0 // là tu le modifies
                            db.set(`roles_${message.guild.id}`, roles) // là tu le sauvegardes
                            return message.channel.send('✅ **Role monteur supprimé du serveur !**')
                        }
                    }
                    await message.guild.roles.create({
                        data: {
                            name: 'Monteur',
                            color: 'WHITE'
                        }
                    }).then((role) => {
                        const roles = db.get(`roles_${message.guild.id}`) // là tu récupères l'objet
                        roles.monteur = role.id // là tu le modifies
                        db.set(`roles_${message.guild.id}`, roles) // là tu le sauvegardes
                    })
                    message.channel.send('✅ **Role monteur ajouté au serveur **`' + message.guild.id + '` **!**')
                }
                if (args[0] === 'design') {
                    const guildroles = message.guild.roles.cache
                    const rolesId = guildroles.map(roles => roles.id)
                    if (db.has('roles_' + message.guild.id)) {
                        const roleIdverif = db.get('roles_' + message.guild.id).design
                        if (rolesId.includes(roleIdverif)) {
                            message.guild.roles.cache.get(roleIdverif).delete()
                            const roles = db.get(`roles_${message.guild.id}`) // là tu récupères l'objet
                            roles.dessin = 0 // là tu le modifies
                            db.set(`roles_${message.guild.id}`, roles) // là tu le sauvegardes
                            return message.channel.send('✅ **Role designer supprimé du serveur !**')
                        }
                    }
                    await message.guild.roles.create({
                        data: {
                            name: 'Designer',
                            color: 'WHITE'
                        }
                    }).then((role) => {
                        const roles = db.get(`roles_${message.guild.id}`) // là tu récupères l'objet
                        roles.design = role.id // là tu le modifies
                        db.set(`roles_${message.guild.id}`, roles) // là tu le sauvegardes
                    })
                    message.channel.send('✅ **Role designer ajouté au serveur **`' + message.guild.id + '` **!**')
                }
            } else {
                message.channel.send('🛑 **Vous n\'avez pas les permissions suffisantes !**')
            }
        }
    }
}
