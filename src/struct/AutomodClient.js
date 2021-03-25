module.exports = class AutomodClient {
    constructor(message, client) {
        this.message = message
        this.client = client
    }

    init() {

        let message = this.message,
            client = this.client,
            regex = {
                invite: /(https?:\/\/)?(www\.)?(disc(ord)?\.(gg|li|me|io)|discordapp\.com\/invite|invite\.gg)\/.+/gi,
                link: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i,
                spoiler: /\|\|.*?\|\|/g
            }

        if (client.plugins.get(message.guild.id, "invites")) {
            if (regex.invite.test(message.content) && !message.member.permissions.has("MANAGE_GUILD") && !client.modRole(message, client.guildData.get(message.guild.id))) {

                message.delete().catch(() => {})
                return message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send invites in this server**`).then(m => {
                    setTimeout(() => {
                        m.delete().catch(() => {})
                    }, 5000)
                })
            }
        } else if (client.plugins.get(message.guild.id, "links")) {

            if (regex.link.test(message.content) && !message.member.permissions.has("MANAGE_GUILD") && !client.modRole(message, client.guildData.get(message.guild.id))) {

                message.delete().catch(() => {})
                return message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send links in this server**`).then(m => {
                    setTimeout(() => {
                        m.delete().catch(() => {})
                    }, 5000)
                })
            } 
        } else if (client.plugins.get(message.guild.id, "spoilers")) {

            const match = message.content.match(spoilerRegex)
            if (Array.isArray(match) && match.length >= 3 && !message.member.permissions.has("MANAGE_GUILD") && !client.modRole(message, client.guildData.get(message.guild.id))) {

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