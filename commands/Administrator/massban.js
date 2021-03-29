const Discord = require('discord.js')

module.exports = {
    name: 'massban',
    description: 'Massban users',
    usage: 'massban <@user1 @user2 @user3> [reason]',
    aliases: [],
    required: ['BAN_MEMBERS'],
    user: ['BAN_MEMBERS'],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        if (!message.member.permissions.has("BAN_MEMBERS") || client.modRole(message, data.guild)) return client.authorPerms(message, ["BAN_MEMBERS"])
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) return client.clientPerms(message, ["BAN_MEMBERS"])


        let bannedCollection = message.mentions.members
        let banReason = args.slice(1).slice(bannedCollection.size).join(" ")

        if (!banReason) banReason = "No reason provided"

        function checkPerms(collection) {
            let data = []
            collection.forEach(m => {
                if (m.roles.highest.position >= message.member.roles.highest.position || m.roles.highest.position >= message.guild.me.roles.highest.position) data.push(m)
            })
            if (data.length === 0) return false; // Passed
            return data
        }

        let perms = checkPerms(bannedCollection)
        if (Array.isArray(perms)) return client.authorPerms(message, "You don't have permission to ban " + perms.filter(T => T).map(({
            user
        }) => `**${user.tag}**`).join(", "))

        let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id, {
            time: 60 * 1000
        })

        message.channel.send(`${client.emoji.misc.check} **Are you sure you want to ban ${bannedCollection.map(mem => `${mem.toString()}`).join(", ")}?** \nPlease reply with \`y\`/\`yes\` or \`cancel\``)
        collector.on("collect", async msg => {
            if (['yes', 'y'].includes(msg.content.toLowerCase())) {

                try {

                    bannedCollection.forEach(member => {
                        message.guild.members.ban(member, {
                            reason: banReason,
                            days: 7
                        })
                    })
                    return message.sendE("Massban Successful", `I have banned ${bannedCollection.map(m => `**${m.user.tag}**`).join(", ")} | ${banReason}`, client.colors.discord)
                } catch (e) {
                    client.logger.log(`Massban failed \n${e}`, "error")
                }
                return collector.stop()
            } else if (msg.content.toLowerCase() === "cancel") {
                collector.stop()
                return message.sendE("Massban", "I have cancelled the massban on " + bannedCollection.size + " members", client.colors.green)
            } else {
                return message.channel.send(`**PROMPT FAILED**: \n${client.emoji.misc.check} Are you sure you want to ban ${bannedCollection.map(mem => `**${mem.user.username}**`).join(", ")}? \nPlease reply with \`y\`/\`yes\` or \`cancel\``)

            }
        })

        collector.on("end", (_, reason) => {
            if (reason === "time") {
                return message.error("Ran out of time, please try again")
            }
        });
    }
}