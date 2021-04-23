const Discord = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
  name: 'antispam',
  description: 'Configure antispam settings for your server',
  usage: '',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],

  premium: false,
  guildOnly: false,
  ignore: true,
  async execute(message, [type, ...args], client, data) {
    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD) || !client.modRole(message, data.guild)) return client.authorPerms(message, ["MANAGE_SERVER"])
    if (!type) return message.error("Please provide a config option")
    type = type.toLowerCase()
    let antiSpamKeys = Object.keys(client.config.plugins.defaultAntiSpam)
    let options = ['show', 'enable', 'disable', ...antiSpamKeys]

    if (!options.includes(type)) return message.error("Please provide a valid option. \n*All options are case sensitive!*")

    let antispam = client.antiSpam.ensure(message.guild.id, client.config.plugins.defaultAntiSpam)

    switch (type) {
      case "show":
        let output = `\`\`\`asciidoc\n== AntiAlt Configurations ==\n`
        let props = Object.keys(antispam)
        const longest = props.reduce((long, str) => Math.max(long, str.length), 0)
        props.forEach(c => {
          if (c instanceof Array) c = c.join(", ")
          if (antispam[c] === null) {
            output += `${c}${" ".repeat(longest - c.length)} :: None\n`
          } else {
            output += `${c}${" ".repeat(longest - c.length)} :: ${antispam[c]}\n`
          }

        })
        message.channel.send(output + "```");
        break;
      case "enable":
        console.log("go to enable")
        client.antiSpam.set(message.guild.id, true, "enabled")
        message.sendE("Success", 'Enabled antispam', client.colors.green)
        break;
      case "disable":
        client.antiSpam.set(message.guild.id, false, "enabled")
        message.sendE("Success", 'Enabled antispam', client.colors.green)
        break;
      case "muteRole":
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if (!role) return message.error("Please provide a valid role")
  
        client.antiSpam.set(message.guild.id, role.id, "muteRole")
        message.sendE("Success", `Set mute role to ${role.toString()}`, client.colors.green)
        break;
      default:
        if (isNaN(parseInt(args[0]))) return message.error("Please provide a valid value. \n*It has to be a number!*")

        client.antiSpam.set(message.guild.id, args[0], type)
        return message.sendE("Success", `Set ${type} to ${args[0]}`, client.colors.green)
    }
  }
}