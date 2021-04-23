const Discord = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
  name: 'work',
  description: 'Work a job gaining coins',
  usage: 'balance <user>',
  aliases: ['job'],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],

  premium: false,
  guildOnly: false,
  cooldown: 60 * 60,
  async execute(message, args, client, data) {
    let replyList = [
      "You work at McDonald's and you were paid {amount} ",
      "You work at a toy factory, and for your immense work, you were paid {amount}",
      "You won a sleeping competition and won {amount}",
      "You play bingo at the casino and win {amount}",
      "You mow Bill Gate's lawn and found {amount}",
      "You attended a boxing competition and won {amount}",
      "You work as a discord bot developer and you earned {amount}",
      "You found an old women's wedding ring on the floor and she paid you {amount}",
      "You do nothing and get paid {amount}"
    ]

    let amount = randNum(300, 750)
    client.userProfiles.math(message.author.id, "add", amount, "balance")
    let reply = `${replyList[Math.floor(Math.random() * replyList.length)].replace(/\{amount\}/g, amount.toLocaleString())} ${client.emoji.misc.coin}`
    return message.sendE("Success", reply, client.colors.gold)

  }
}


function randNum(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}