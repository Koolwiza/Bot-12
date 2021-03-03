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

    if (!expression) return message.args("Please provide a math expression tno evauluate")

    let result = math.evaluate(args.join(" ").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/"));

    return message.sendE("Evaluated Expression", `Inputted expression ${expression}\nAnswer: ${result} `, client.colors.green)
  }
}