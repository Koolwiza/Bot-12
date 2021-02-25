const Discord = require('discord.js')

module.exports = {
    name: 'softban',
    description: 'Remove all messages from the user',
    usage: 'softban <user> [reason]',
    aliases: [],
    required: ['BAN_MEMBERS'],
    user: ['BAN_MEMBERS'],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        if (!message.member.permissions.has("BAN_MEMBERS")  || client.modRole(message, data) ) return client.authorPerms(message, ["BAN_MEMBERS"])
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) return client.clientPerms(message, ["BAN_MEMBERS"])


        let user = await client.resolveUser(args[0])

        if (!user) return client.missingArgs(message, "Please provide a user to softban!\n```@user or userID```")
        if (user.id === message.author.id) return message.sendE("Returned", "You can't softban yourself", client.colors.red)

        let a = await message.guild.members.fetch(user.id).catch(c => {})
        if (a.roles.highest.position >= message.guild.me.roles.highest.position) return message.error("Provided member has equal or higher role than me.")

        let reason = args.slice(1).join(" ")
        if (!reason) reason = "No reason provided"

        try {
            await user.send(`**${client.emoji.misc.xmark} You have been softbanned from ${message.guild.name} for ${reason}**`)

            await a.ban({reason: reason})
            await message.guild.members.unban(a, "Softban reason: " + reason)
            return message.sendE("Success", `I have softbanned ${user.tag} | ${reason}`, client.colors.green)
            
        } catch (err) {
            client.logger.log(`There was an error banning ${user.username}.\n${err}`, "error")
            message.error("There was an error banning this user, please try again")
        }
    }
}