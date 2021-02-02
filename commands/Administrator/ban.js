const Discord = require('discord.js')

module.exports = {
    name: 'ban',
    description: 'Ban a member from the server',
    usage: 'ban <user> [reason]',
    aliases: [],
    required: ['BAN_MEMBERS'],
    user: ['BAN_MEMBERS'],
    category: __dirname.split("commands/")[1],
    args: false,
    premium: false,
    guildOnly: false,
    async execute(message, args, client) {
        if (!message.member.hasPermission("BAN_MEMBERS")) return client.authorPerms(message, ["BAN_MEMBERS"])
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return client.clientPerms(message, ["BAN_MEMBERS"])


        let user = await client.resolveUser(args[0])

        if (!user) return client.missingArgs(message, "Please provide a user to ban!\n```@user or userID```")
        if(user.id === message.author.id) return message.channel.send(client.baseEmbed(message, {
            title: "Error",
            description: "You can't ban yourself!",
            color: client.colors.red
        }))

       
        let a = await message.guild.members.fetch(user.id).catch(c => {})
        if(a.roles.highest.position >= message.guild.me.roles.highest.position) return client.error(message, "Provided member has equal or higher role than me.")

        let reason = args.slice(1).join(" ")
        if (!reason) reason = "No reason provided"

        try {
            let member = await message.guild.members.fetch(user.id).catch(c => {})
            member.ban({reason: reason})
            message.channel.send(client.baseEmbed(message, {
                title: "Success",
                description: `I have banned ${user.tag} | ${reason}`,
                color: client.colors.green
            }))
        } catch (err) {
            client.logger.log(`There was an error banning ${user.username}.\n${err}`, "error")
            client.error(message, "There was an error banning this user, please try again")
        }
    }
}