const Discord = require('discord.js')
const moment = require('moment')

module.exports = {
  name: 'warnings',
  description: 'Display a user\'s warnings',
  usage: 'warnings <user>',
  aliases: [],
  required: ['MANAGE_GUILD'],
  user: ['MANAGE_GUILD'],
  category: __dirname.split("commands\\")[1],

  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    if (!message.member.permissions.has("MANAGE_GUILD") || client.modRole(message, data)) return client.authorPerms(message, ["MANAGE_SERVER"])

    let user = await client.resolveUser(args[0])
    if (!user) return message.args("Missing user for warnings")

    let a = client.modActions.filter(c => (c.type === "warning") && (c.user === user.id) && (c.guild === message.guild.id))

    let b = (await Promise.all(a.map(async (value, key) =>
      `**ID: ${key} | ${(await client.users.fetch(value.moderator)).tag}**\n${value.reason} - ${moment(value.when).format('lll') } `))).join("\n\n")

    return message.sendE(`${user.tag}(${user.id}) Warnings`, b, client.colors.sky)
  }
}