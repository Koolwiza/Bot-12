const Discord = require('discord.js')

module.exports = {
  name: 'roles',
  description: 'Send all roles in the server',
  usage: 'roles',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],

  premium: false,
  guildOnly: false,
  ignore: true,
  async execute(message, args, client, data) {
    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_ROLES) || !client.modRole(message, data.guild)) return client.missingArgs(message, ["MANAGE_SERVER"])
    let msg = "```asciidoc\n== ROLES ==\n"
    let names = message.guild.roles.cache.map(c => `${c.name}`)
    let longest = names.reduce((long, str) => Math.max(long, str.length), 0)
    message.guild.roles.cache.forEach(c => {
      msg += `${c.name}${" ".repeat(longest - c.name.length)} :: ${c.members.size} members\n`
    })
    msg += "```"
    message.channel.send(msg, {
      split: true
    })
  }
}