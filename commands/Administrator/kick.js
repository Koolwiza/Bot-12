const Discord = require('discord.js')

module.exports = {
    name: 'kick',
    description: 'Kick a member out of the server',
    usage: 'kick <user> [reason]',
    aliases: [],
    required: ['KICK_MEMBERS'],
    user: ['KICK_MEMBERS'],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        if (!message.member.permissions.has("KICK_MEMBERS") || client.modRole(message, data.guild) ) return client.authorPerms(message, ["KICK_MEMBERS"])
        if (!message.guild.me.permissions.has("KICK_MEMBERS")) return client.clientPerms(message, ["KICK_MEMBERS"])


        let user = await client.resolveUser(args[0])
        if (user.id === message.author.id) return message.error("You can't kick yourself")

        if (!user) return message.args("Please provide a user to kick!\n```@user or userID```")
        let a = await message.guild.members.fetch(user.id).catch(c => {})
        if (a.roles.highest.position >= message.guild.me.roles.highest.position) return message.error("Provided member has equal or higher role than me.")

        let reason = args.slice(1).join(" ")
        if (!reason) reason = "No reason provided"

        try {
            let member = await message.guild.members.fetch(user.id).catch(() => {})
            await user.send(`**${client.emoji.misc.xmark} You have been kicked in ${message.guild.name} for ${reason}**`)
            await member.kick(reason)
            return message.sendE("Success", `I have kicked ${user.tag} | ${reason}`, client.colors.green)

            
        } catch (err) {
            client.logger.log(`There was an error kicking ${user.username}.\n${err}`, "error")
            message.error("There was an error kicking this user, please try again")
        }
    }
}