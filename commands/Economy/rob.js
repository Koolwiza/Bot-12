const Discord = require('discord.js')

module.exports = {
  name: 'rob',
  description: 'Rob a user of their money ',
  usage: 'rob',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    let user = await client.resolveUser(args[0])
    if(!user) return message.args("Please provide a user or invalid user")

    let userP = data.user(user.id).balance
    if(userP.balance < 1000) return message.error("This user is too poor! You can only rob users with more than 1k coins.")

    let percent = (Math.floor(Math.random() * 50))
    let robA = userP.balance * percent/100

    client.userProfiles.math(user.id, "subtract", robA, "balance")
    client.userProfiles.math(message.author.id, "add", robA, "balance")

    return message.sendE("Rob Successful", `You got away with ${client.emoji.misc.coin} **${robA}**`, client.colors.green)
  }
}