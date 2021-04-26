const Discord = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
  name: 'give',
  description: 'Give money to another person',
  usage: 'give <user> <amount>',
  aliases: ['pay', 'transfer'],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  
  /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {
    let author = data.user(message.author).balance
    let user = await client.resolveUser(args[0])
    let amount = parseInt(args[1])
    if(!user) return message.error("Please provide a user")

    if(!amount) return message.error("Please provide an amount")

    if(amount > author) return message.error("Provided amount greater than current balance")
    if(data.user(user).balance <= 500) return message.error(`This user has less than 500 ${client.emoji.misc.coin}`)

    client.userProfiles.math(message.author.id, "subtract", amount, 'balance')
    client.userProfiles.math(user.id, 'add', amount, 'balance')
    return message.sendE("Success", `You have gave ${user.toString()} ${client.emoji.misc.coin}${amount.toLocaleString()}`, client.colors.green)
  }
}