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
        if (message.channel.type !== 'dm') {
            message.channel.send('💬 **Commande help envoyée en message privé !**')
        }
        client.users.cache.get(message.author.id).send(new Discord.MessageEmbed()
            .setDescription('📖 **- Fonctionnalités** et **commandes** du bot : **https://docs.visualorder.fr**\n\n<:add_visualorder:831550961662427196> **- Ajouter** visualOrder : **https://add.visualorder.fr**\n\n🆘 **-** **Besoin d’aide ?** Le **support** est disponible ici : **https://discord.gg/sKJbqSW**\n\n📩 **-** Rejoindre le **serveur principal** : **https://discord.gg/sKJbqSW**\n\n<:white_check_mark_visualorder:831550961763614731> **-** Le **statut du bot** est visible sur : **https://status.visualorder.fr**\n\n**Bonne utilisation !**')
            .setColor('FF7B00')
            .setFooter(config.version, client.user.avatarURL()))
    }
}
