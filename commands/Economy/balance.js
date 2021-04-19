const Discord = require('discord.js')

module.exports = {
  name: 'balance',
  description: 'View the balance of a member',
  usage: 'balance <user>',
  aliases: ['money', 'cash', 'coins', 'bal', 'coin'],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    let user = await client.resolveUser(args[0]) ?? message.author
    return message.sendE(`${user.username}'s Balance`, `${client.emoji.misc.coin} ${data.user(user).balance.toLocaleString()}`, client.colors.gold)
  }
}