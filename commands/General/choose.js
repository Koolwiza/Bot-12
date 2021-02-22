const Discord = require('discord.js')

module.exports = {
  name: 'choose',
  description: 'Let the bot choose an option for you',
  usage: 'choose <option1 | option2 | option3 ... >',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    let options = args.join(" ").split("|")
    if(!options.length) return client.missingArgs(message, "Please provide options, example: \n ```Hot Dog | Steak | Burger```")

    let choice = options.random().trim()
    return message.channel.send(client.baseEmbed(message, {
        title: "Success",
        description: "I have come back with a response",
        fields: [
            {
                name: "Out of the " + options.length + ", I have choice the option",
                value: `\`${choice}\``
            }
        ],
        color: client.colors.sky
    }))
  }
}