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
        if (!message.member.permissions.has("BAN_MEMBERS")  || (message.guild.roles.cache.get(data.modrole) && !message.member.roles.cache.has(data.modrole)) ) return client.authorPerms(message, ["BAN_MEMBERS"])
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) return client.clientPerms(message, ["BAN_MEMBERS"])


        let user = await client.resolveUser(args[0])

        if (!user) return client.missingArgs(message, "Please provide a user to softban!\n```@user or userID```")
        if (user.id === message.author.id) return message.channel.send(client.baseEmbed(message, {
            title: "Error",
            description: "You can't softban yourself!",
            color: client.colors.red
        }))

        let a = await message.guild.members.fetch(user.id).catch(c => {})
        if (a.roles.highest.position >= message.guild.me.roles.highest.position) return client.error(message, "Provided member has equal or higher role than me.")

        let reason = args.slice(1).join(" ")
        if (!reason) reason = "No reason provided"

        try {
            await a.ban({reason: reason})
            await message.guild.members.unban(a, "Softban reason: " + reason)

            await user.send(`**${client.emoji.misc.xmark} You have been softbanned from ${message.guild.name} for ${reason}**`)
        } catch (err) {
            client.logger.log(`There was an error banning ${user.username}.\n${err}`, "error")
            client.error(message, "There was an error banning this user, please try again")
        }
    }
}