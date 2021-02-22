const Discord = require('discord.js'),
figlet = require('figlet'),
util = require('util'),
fig = util.promisify(figlet)

module.exports = {
  name: 'ascii',
  description: 'Turn your text into A S C I I',
  usage: 'ascii <text>',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
      let text = args.join(" ")
      if(text.length >= 20) return client.error(message, "Invalid text: \nNo text provided | Text over 20 characters")

      let ascii = await fig(text).catch(e => {
          client.logger.error(e)
          return client.error(message, e)
      })

      return message.channel.send("```" + ascii + "```")
  }
}