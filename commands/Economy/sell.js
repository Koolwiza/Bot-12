const Discord = require('discord.js')

module.exports = {
    name: 'sell',
    description: 'Sell an item you have in your inventory',
    usage: 'sell',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    ignore: true,
    async execute(message, args, client, data) {
        let {
            market
        } = client.config, {
            inventory
        } = data.user(message.author)

        let simKeys = (obj1, obj2) => {
            return Object.entries(obj1).reduce((a, e) => obj2[e[0]] ? Object.assign(a, {
                [e[0]]: e[1]
            }) : a, {})
        }

        inventory = simKeys(inventory, market)
        if (!args.length) {

            let marketContent = ""
            for (let [k, v] of Object.entries(market)) {
                marketContent += `**${k.toProperCase()}**: ${client.emoji.misc.coin} ${v}\n`
            }

            let inventoryContent = ""

            for (let [k, v] of Object.entries(inventory)) {
                inventoryContent += `${k.toProperCase()}: ${v}\n`
            }

            let embed = new Discord.MessageEmbed()
                .setTitle("🛍️ Market")
                .setDescription(`*All of these values are to sell, not buy*\n${marketContent}\n**Your inventory:**\n ${inventoryContent}`)
                .setColor(client.colors.gold)
                .default(message.author)
            return message.channel.send(embed)
        } else {
            let item = args[0]
            let quantity = parseInt(args[1]) || 1

            if (!item) return message.error("Please specify an item to sell")
            itme = item.toLowerCase()

            let itemName = Object.keys(market).find(c => c.toLowerCase().includes(item))
            let itemPrice = market[itemName]
            let totalPrice = quantity * itemPrice
            let enmapName = Object.keys(inventory).find(c => c.toLowerCase().includes(item))

            client.userProfiles.math(message.author.id, "subtract", quantity, `inventory.${enmapName}`)
            client.userProfiles.math(message.author.id, "add", totalPrice, "balance")

            return message.sendE("Item Sold!", `Your ${quantity} ${itemName} sold for ${client.emoji.misc.coin} ${totalPrice}`, client.colors.gold)
        }
    }
}