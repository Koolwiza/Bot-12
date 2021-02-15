const Discord = require('discord.js')

module.exports = {
  name: 'work',
  description: 'Work a job gaining coins',
  usage: 'balance <user>',
  aliases: ['job'],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  args: false,
  premium: false,
  guildOnly: false,
  cooldown: 60 * 60,
  async execute(message, args, client) {
    let replyList = [
      "You work at McDonald's and you were paid {amount} ",
      "You work at a toy factory, and for your immense work, you were paid {amount}",
      "You won a sleeping competition and won {amount}",
      "You play bingo at the casino and win {amount}",
      "You mow Bill Gate's lawn and win {amount}",
      "You attended a boxing competition and won {amount}",
      "You work as a discord bot developer and you earned {amount}",
      "You found an old women's ring on the floor and she paid you {amount}",
      "You do nothing and get paid {amount}"
    ]

    let amount = randomIntFromInterval(300, 750)



  }
}


function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}