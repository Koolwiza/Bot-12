const Discord = require('discord.js')

module.exports = class AutomodClient {
    constructor(config = {}) {
        this.config = {
            "invites": config.invites,
            "links": config.links,
            "spoilers": config.spoilers,
            "largemsgs": config.largemsgs,
        }
    }

    init(message, client) {

        const {
            config
        } = this

        if (config.invites) {

            let invRegex = /(https?:\/\/)?(www\.)?(disc(ord)?\.(gg|li|me|io)|discordapp\.com\/invite|invite\.gg)\/.+/gi
            if (invRegex.test(message.content)) {
                if (message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD) || !client.modRole(message, client.guildData.get(message.guild.id))) return;
                message.delete().catch(() => {})
                return message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send invites in this server**`).then(m => {
                    setTimeout(() => {
                        m.delete().catch(() => {})
                    }, 5000)
                })
            }
        } else if (config.links) {
            let urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i
            if (urlRegex.test(message.content)) {
                if (message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD) || !client.modRole(message, client.guildData.get(message.guild.id))) return;
                message.delete().catch(() => {})
                return message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send links in this server**`).then(m => {
                    setTimeout(() => {
                        m.delete().catch(() => {})
                    }, 5000)
                })
            }
        } else if (config.spoilers) {
            let spoilerRegex = /\|\|.*?\|\|/g
            const match = message.content.match(spoilerRegex)
            if (Array.isArray(match) && match.length >= 3) {
                if (message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD) && !client.modRole(message, client.guildData.get(message.guild.id))) return;
                message.delete().catch(() => {})
                return message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send multiple spoilers in this server**`).then(m => {
                    setTimeout(() => {
                        m.delete().catch(() => {})
                    }, 5000)
                })
            }
        } else if (config.largemsgs) {
            if (message.content.length > 1750) {
                if (message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD) && !client.modRole(message, client.guildData.get(message.guild.id))) return;
                message.delete().catch(() => {})
                return message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send messages with over 1750 characters in this server**`).then(m => {
                    setTimeout(() => {
                        m.delete().catch(() => {})
                    }, 5000)
                })
            }
        }
    }
}