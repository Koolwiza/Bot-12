const Discord = require('discord.js')

module.exports = {
  name: 'leaderboard',
  description: 'Display the global leaderboard for economy',
  usage: '',
  aliases: ['lb', 'top'],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],

  premium: false,
  guildOnly: false,
  ignore: true,
  async execute(message, args, client, data) {
    let bals = client.userProfiles
      .array()
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10)
      .map(async (u, i) => {
        let user = await client.users.fetch(u.user)
        return `**${i}.** ${user.toString()}`
      })

    console.log(bals)

  }
}