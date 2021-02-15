const Discord = require('discord.js')

module.exports = {
  name: 'balance',
  description: 'View the balance of a member',
  usage: 'balance <user>',
  aliases: ['money', 'cash', 'coins', 'bal', 'coin'],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  args: false,
  premium: false,
  guildOnly: false,
  async execute(message, args, client) {

    let user = await client.resolveUser(args[0]) || message.author

    let data = client.userProfiles.ensure(user.id, {
      balance: 0,
      premium: false
    })

    return message.channel.send(client.baseEmbed(message, {
      title: `${user.username}'s Balance `,
      fields: [
        {
          name: "Balance",
          value: `${client.emoji.misc.coin} ${data.balance}`
        }
      ],
      color: client.colors.gold
    }))
  }
}