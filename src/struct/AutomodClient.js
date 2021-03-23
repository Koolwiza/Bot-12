module.exports = class AutomodClient {
    constructor(message, client) {
        this.message = message
        this.client = client
    }

    init() {

        let message = this.message
        let client = this.client
        if (client.plugins.get(message.guild.id, "invites")) {
            let inviteRegex = /(https?:\/\/)?(www\.)?(disc(ord)?\.(gg|li|me|io)|discordapp\.com\/invite|invite\.gg)\/.+/gi

            if (inviteRegex.test(message.content) && !message.member.permissions.has("MANAGE_GUILD") && !client.modRole(message, client.guildData.get(message.guild.id))) {

                message.delete().catch(() => {})
                return message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send invites in this server**`).then(m => {
                    setTimeout(() => {
                        m.delete().catch(() => {})
                    }, 5000)
                })
            }
        } else if (client.plugins.get(message.guild.id, "links")) {

            let urlReg = /http?(s)?:(\/\/)?(www\..+)/i
            if (urlReg.test(message.content) && !message.member.permissions.has("MANAGE_GUILD") && !client.modRole(message, client.guildData.get(message.guild.id))) {

                message.delete().catch(() => {})
                return message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send links in this server**`).then(m => {
                    setTimeout(() => {
                        m.delete().catch(() => {})
                    }, 5000)
                })
            }
        } else if (client.plugins.get(message.guild.id, "spoilers")) {

            let spoilerRegex = /\|\|.*?\|\|/gmi
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