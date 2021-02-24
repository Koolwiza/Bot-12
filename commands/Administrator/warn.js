const Discord = require('discord.js')

module.exports = {
  name: 'warn',
  description: 'Warn a user',
  usage: 'warn <user> <reason>',
  aliases: [],
  required: ['MANAGE_GUILD'],
  user: ['MANAGE_GUILD'],
  category: __dirname.split("commands\\")[1],

  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    if (!message.member.permissions.has("MANAGE_GUILD") || (message.guild.roles.cache.get(data.modrole) && !message.member.roles.cache.has(data.modrole)) ) return client.authorPerms(message, ["MANAGE_SERVER"])

    let user = await client.resolveUser(args[0])
    if (!user) return client.missingArgs(message, "Please provide a user to warn")


    let reason = args.slice(1).join(" ")
    if (!reason) reason = "No reason provided"

    let id = `${client.randomString(7)}-${client.randomString(5)}-${client.randomString(7)}`

    client.modActions.set(id, {
      user: user.id,
      guild: message.guild.id,
      type: 'warning',
      moderator: message.author.id,
      reason: reason,
      when: new Date()
    });

    await message.sendE("Success", `I have warned ${user.tag} | ${reason}`)

    await user.send(`${client.emoji.misc.xmark} You have been warned in **${message.guild.name}** for **${reason}**`)
  }
}