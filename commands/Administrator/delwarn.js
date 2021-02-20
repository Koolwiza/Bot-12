const Discord = require('discord.js')
const moment = require('moment')

module.exports = {
  name: 'delwarn',
  description: 'Remove a user\'s warn using an id',
  usage: 'delwarn <id>',
  aliases: [],
  required: ['MANAGE_GUILD'],
  user: ['MANAGE_GUILD'],
  category: __dirname.split("commands\\")[1],

  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    if (!message.member.permissions.has("MANAGE_GUILD") || (message.guild.roles.cache.get(data.modrole) && !message.member.roles.cache.has(data.modrole)) ) return client.authorPerms(message, ["MANAGE_SERVER"])

    mod = client.modActions

    let id = args[0]
    if (!id) return client.missingArgs(message, "Please provide a warning id")

    if (!mod.has(id) || mod.get(id, "guild") !== message.guild.id) return client.error(message, "Invalid warning id")

    mod.delete(id)
    return message.channel.send(client.baseEmbed(message, {
      title: "Success",
      description: `Deleted the warning with an id of \`${id}\``,
      color: client.colors.green
    }))
  }
}