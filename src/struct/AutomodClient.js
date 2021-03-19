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
            
            if (inviteRegex.test(message.content) && !message.member.permissions.has("MANAGE_GUILD") && !client.modRole(message, client.guildData)) {
                
                message.delete().catch(() => {})
                return message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send invites in this server**`).then(m => {
                    setTimeout(() => {
                        m.delete().catch(() => {})
                    }, 5000)
                })
            }
        } else if (client.plugins.get(message.guild.id, "links")) {
            
            let urlReg = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/ig
            if (urlReg.test(message.content) && !message.member.permissions.has("MANAGE_GUILD") && !client.modRole(message, client.guildData)) {
                
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
            if (Array.isArray(match) && match.length >= 3 && !message.member.permissions.has("MANAGE_GUILD")&& !client.modRole(message, client.guildData)) {
                
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