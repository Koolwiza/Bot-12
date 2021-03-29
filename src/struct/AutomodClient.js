const { discord } = require("../data/colors")

module.exports = class AutomodClient {
    constructor(message, client) {
        this.message = message
        this.client = client
    }

    init() {

        let message = this.message,
            client = this.client

        if (client.plugins.get(message.guild.id, "invites")) {
            
            let invRegex = /(https?:\/\/)?(www\.)?(disc(ord)?\.(gg|li|me|io)|discordapp\.com\/invite|invite\.gg)\/.+/gi
            if (invRegex.test(message.content)) {
                if(message.member.permissions.has("MANAGE_GUILD") || client.modRole(message, client.guildData.get(message.guild.id))) return;
                message.delete().catch(() => {})
                return message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send invites in this server**`).then(m => {
                    setTimeout(() => {
                        m.delete().catch(() => {})
                    }, 5000)
                })
            }
        } else if (client.plugins.get(message.guild.id, "links")) {
            let urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i
            if (urlRegex.test(message.content)) {
                if(message.member.permissions.has("MANAGE_GUILD") || client.modRole(message, client.guildData.get(message.guild.id))) return;
                message.delete().catch(() => {})
                return message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send links in this server**`).then(m => {
                    setTimeout(() => {
                        m.delete().catch(() => {})
                    }, 5000)
                })
            } 
        } else if (client.plugins.get(message.guild.id, "spoilers")) {
            let spoilerRegex = /\|\|.*?\|\|/g
            const match = message.content.match(spoilerRegex)
            if (Array.isArray(match) && match.length >= 3) {
                if(message.member.permissions.has("MANAGE_GUILD") && client.modRole(message, client.guildData.get(message.guild.id))) return;
                message.delete().catch(() => {})
                return message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send multiple spoilers in this server**`).then(m => {
                    setTimeout(() => {
                        m.delete().catch(() => {})
                    }, 5000)
                })
            }
        }
    }
}