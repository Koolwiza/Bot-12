const Discord = require('discord.js')

module.exports = {
    name: 'kick',
    description: 'Kick a member out of the server',
    usage: 'kick <user> [reason]',
    aliases: [],
    required: ['KICK_MEMBERS'],
    user: ['KICK_MEMBERS'],
    category: __dirname.split("commands/")[1],
    args: false,
    premium: false,
    guildOnly: false,
    async execute(message, args, client) {
        if (!message.member.hasPermission("KICK_MEMBERS")) return client.authorPerms(message, ["KICK_MEMBERS"])
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return client.clientPerms(message, ["KICK_MEMBERS"])


        let user = await client.resolveUser(args[0])
        if(user.id === message.author.id) return message.channel.send(client.baseEmbed(message, {
            title: "Error",
            description: "You can't kick yourself!",
            color: client.colors.red
        }))

        if (!user) return client.missingArgs(message, "Please provide a user to kick!\n```@user or userID```")
        let a = await message.guild.members.fetch(user.id).catch(c => {})
        if(a.roles.highest.position >= message.guild.me.roles.highest.position) return client.error(message, "Provided member has equal or higher role than me.")

        let reason = args.slice(1).join(" ")
        if (!reason) reason = "No reason provided"

        try {
            let member = await message.guild.members.fetch(user.id).catch(c => {})
            member.kick(reason)
            message.channel.send(client.baseEmbed(message, {
                title: "Success",
                description: `I have kicked ${user.tag} | ${reason}`,
                color: client.colors.green
            }))

            await user.send(`**${client.emoji.misc.xmark} You have been kicked in ${message.guild.name} for ${reason}**`)
        } catch (err) {
            client.logger.log(`There was an error kicking ${user.username}.\n${err}`, "error")
            client.error(message, "There was an error kicking this user, please try again")
        }
    }
}