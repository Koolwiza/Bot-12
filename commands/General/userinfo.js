const Discord = require('discord.js'),
    ms = require('ms'),
    {
        format
    } = require('date-fns'),
    moment = require('moment')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'userinfo',
    description: 'Get detailed information about a user',
    usage: 'userinfo [user]',
    aliases: ['member', 'user'],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        let user = (message.mentions.members.first()) ||
            (args[0] ? (await message.guild.members.fetch(args[0])) : message.member)

        let userCreatedAt = moment(user.user.createdAt).format("lll")
        let userCreatedAtFromNow = moment(user.user.createdAt, "YYYYMMDD").fromNow()
        let userJoinedAt = moment(user.joinedAt).format("LLL")
        let userJoinedAtFromNow = moment(user.joinedAt, "YYYYMMDD").fromNow()
        let userTag = user.user.tag
        let userAv = user.user.displayAvatarURL({
            dynamic: true
        })
        let userID = user.user.id
        let userStatus = user.presence.status
            .replace(/dnd/ig, client.emoji.presence.animdnd)
            .replace(/online/ig, client.emoji.presence.animonline)
            .replace(/offline/ig, client.emoji.presence.animoffline)
            .replace(/idle/ig, client.emoji.presence.animidle)
        let userActivityType = user.presence.activities[0] ? user.presence.activities[0].name : ""
        let userStatusMessage = user.presence.activities[0] ? user.presence.activities[0].state : "No status"
        let userStatusEmoji = user.presence.activities[0] ? user.presence.activities[0].emoji ? user.presence.activities[0].emoji.name : "" : ""
        let uesrNickname = user.displayName || "No nickname"
        let userRoles = user.roles.cache.map(c => `${c.toString()}`)
        let amount;
        if (userRoles.length > 10) {
            amount = userRoles.length - 10
            userRoles.splice(10, userRoles.length)
        }

        let a = amount ? `and ${amount} more...` : ""

        let userInfoEmbed = new Discord.MessageEmbed()
            .setThumbnail(userAv)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor(client.colors.discord)
            .setTitle(userTag)
            .addField("Member", `
            📛 Nickname: ${uesrNickname}
            ${client.emoji.server.role} Roles [${user.roles.cache.size}]: ${userRoles.join(", ")} ${a}
            ${client.emoji.server.join} Joined At: ${userJoinedAt} (${userJoinedAtFromNow})
            ☢️ Activity: \`${userActivityType}\``)
            .addField("User", `
            🆔 ID: ${userID}
            ⏰ Created At: ${userCreatedAt} (${userCreatedAtFromNow})
            ${client.emoji.misc.profile} Presence: ${userStatus}${userStatusEmoji} \`${userStatusMessage}\``)
            .setFooter(client.user.username, client.user.displayAvatarURL())
        return message.channel.send(userInfoEmbed)

    }
}