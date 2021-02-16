const Discord = require('discord.js'),
    ms = require('ms')

module.exports = {
    name: 'mute',
    description: 'Mute a member',
    usage: 'mute <user> [time] [reason]',
    aliases: [],
    required: ['MANAGE_ROLES'],
    user: ['MANAGE_ROLES'],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        if (!message.member.permissions.has("MANAGE_ROLES") || !message.member.roles.cache.has(data.modrole)) return client.authorPerms(message, ["MANAGE_ROLES"])
        if (!message.guild.me.permissions.has("MANAGE_ROLES")) return client.clientPerms(message, ["MANAGE_ROLES"])

        let user = await client.resolveUser(args[0])

        if (user.id === message.author.id) return message.channel.send(client.baseEmbed(message, {
            title: "Error",
            description: "You can't mute yourself!",
            color: client.colors.red
        }))


        if (!user) return client.missingArgs(message, "Please provide a user to mute!\n```@user or userID```")
        let a = await message.guild.members.fetch(user.id).catch(c => {})
        if (!a.manageable) return client.authorPerms(message, "You do not have permissions to manage this user")

        let time = args[1]

        if (!time || isNaN(ms(time))) {
            return client.error(message, "Provided time wasn't a valid time or missing time")
        }

        let reason = args.slice(2).join(" ")
        if (!reason) reason = "No reason provided"

        let muteRole = message.guild.roles.cache.find(c => c.name.toLowerCase() === "muted")
        if (!muteRole) {
            message.guild.roles.create({
                name: "Muted",
                color: "#818386",
                mentionable: false
            }).then(c => {
                client.logger.log("Muted role not found, created muted role " + c.name)
            })
        }

        let muteR = message.guild.roles.cache.find(c => c.name.toLowerCase() === "muted")

        try {
            message.guild.channels.cache.forEach(ch => {
                ch.updateOverwrite(muteR, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    CONNECT: false
                })
            })
        } catch (err) {
            client.error(message, "An error occured when updating overwrites for channels")
            client.logger.log("Error updating permission overwrites\n" + err, "error")
        }

        if (a.roles.cache.has(muteR.id)) return client.error(message, "User provided is already muted")

        a.roles.add(muteR).catch(c => client.error("An error occured when adding roles to the user"))
        message.channel.send(client.baseEmbed(message, {
            title: "Success",
            description: `I have muted **${user.tag}** | ${reason}`,
            color: client.colors.green
        }))
        await user.send(`**${client.emoji.misc.xmark} You have been warned in ${message.guild.name} for ${reason}**`)
        setTimeout(() => {
            if (a.roles.cache.has(muteR)) {
                a.roles.remove(muteR).catch(c => client.logger.log("An error occured removing mute role for " + a.user.username, "error"))
                a.send(client.baseEmbed(message, {
                    title: "Mute Removed",
                    description: `Your mute in ${message.guild.name} has been removed!`,
                    color: client.colors.green
                }))
            }

        }, time)
    }
}