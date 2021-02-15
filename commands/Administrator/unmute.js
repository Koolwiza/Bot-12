const Discord = require('discord.js'),
    ms = require('ms')

module.exports = {
    name: 'unmute',
    description: 'Unmute a user',
    usage: 'unmute',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],
    args: false,
    premium: false,
    guildOnly: false,
    async execute(message, args, client) {
        if (!message.member.permissions.has("MANAGE_ROLES")) return client.authorPerms(message, ["MANAGE_ROLES"])
        if (!message.guild.me.permissions.has("MANAGE_ROLES")) return client.clientPerms(message, ["MANAGE_ROLES"])


        let user = await client.resolveUser(args[0])
        if(user.id === message.author.id) return message.channel.send(client.baseEmbed(message, {
            title: "Error",
            description: "You can't mute yourself!",
            color: client.colors.red
        }))

        if (!user) return client.missingArgs(message, "Please provide a user to mute!\n```@user or userID```")
        let a = await message.guild.members.fetch(user.id).catch(c => {})
        if(a.roles.highest.position >= message.guild.me.roles.highest.position) return client.error(message, "Provided member has equal or higher role than me.")

        let reason = args.slice(1).join(" ")
        if (!reason) reason = "No reason provided"

        let muteRole = message.guild.roles.cache.find(c => c.name.toLowerCase() === "muted")

        if(a.roles.cache.has(muteRole.id)) {
            a.roles.remove(muteRole).then(async c => {
                message.channel.send(client.baseEmbed(message,  {
                    title: "Success",
                    description: `I have unmuted **${a.user.tag}** | ${reason}`,
                    color: client.colors.green
                }))
                await user.send(`**${client.emoji.misc.xmark} You have been unmuted in ${message.guild.name} for ${reason}**`)
            }).catch(e => {
                client.error(message, "An error occured unmuting this user")
                client.logger.log("An error occured unmuting " + a.user.tag + "\n" + e, "error")
            })
        } else {
            client.error(message, "This user isn't muted")
        }

    }
}