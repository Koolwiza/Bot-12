const Discord = require('discord.js')

module.exports = {
  name: 'test',
  description: 'test',
  usage: 'test',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    message.error("hi")
    message.sendE("title", "description", client.colors.green, [
        {
            name: "kool",
            value: "is kool"
        }
    ])

    message.channel.send(new Discord.MessageEmbed().success())
  }
}