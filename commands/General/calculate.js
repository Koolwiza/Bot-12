const Discord = require('discord.js'),
math = require('mathjs')
  

module.exports = {
  name: 'calculate',
  description: 'Calculate a math expression',
  usage: 'calculate <expression>',
  aliases: ['math', 'calc'],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {

    let expression = args.join(" ")

    if(!expression) return client.missingArgs(message, "Please provide a math expression tno evauluate")

    let result = math.evaluate(args.join(" ").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/"));

    return message.channel.send(client.baseEmbed(message, {
      title: "Evaluated expression",
      description: `Inputted expression ${expression}\nAnswer: ${result} `,
      color: client.colors.green
    }))
  }
}	