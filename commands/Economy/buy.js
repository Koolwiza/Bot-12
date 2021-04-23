const Discord = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
  name: 'buy',
  description: 'Buy an item',
  usage: 'buy <item> <quantity>',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],

  premium: false,
  guildOnly: false,
  ignore: true,
  async execute(message, args, client, data) {
    let item = args.join(" ").replace(/\d+/g, "").trim()
    if (!item) return message.args("Please provide an item")

    let quantity = parseInt(args.pop()) || 1
    let invItemName = Object.keys(client.config.userData.inventory).find(c => c.toLowerCase().replace("_", " ").includes(item))
    let shopItemName = Object.keys(client.config.shop).find(c => c.toLowerCase().includes(item))
    let shopItemPrice = client.config.shop[shopItemName]
    
    if (!invItemName) return message.error(`Please provide a valid item. Check \`${client.config.defaultSettings.prefix}shop\` for a list of items`)

    let totalPrice = shopItemPrice * quantity
    if (data.user(message.author).balance < totalPrice) return message.error(`You need ${client.emoji.misc.coin} **${shopItemPrice.toLocaleString()}** to buy this item! You are missing ${client.emoji.misc.coin}**${(totalPrice - data.user(message.author).balance).toLocaleString()}** `)

    client.userProfiles.math(message.author.id, "subtract", totalPrice, "balance")
    client.userProfiles.math(message.author.id, "add", quantity, `inventory.${invItemName}`)
    return message.sendE("Success", `You have bought ${quantity} ${shopItemName} for ${client.emoji.misc.coin} ${totalPrice.toLocaleString()}`, client.colors.green)
  }
}