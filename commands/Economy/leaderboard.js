const Discord = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
  name: 'leaderboard',
  description: 'Display the global leaderboard for economy',
  usage: '',
  aliases: ['lb', 'top'],
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
    let bals = client.userProfiles
      .array()
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10)
      .map(async (u, i) => {
        let user = await client.users.fetch(u.user)
        let emoji = i === 0 ? "🥇 " : i === 1 ? "🥈 " : i === 2 ? "🥉 " : ""
        return `${emoji}**${i + 1}.** **${user.tag}** - ${client.emoji.misc.coin} ${u.balance.toLocaleString()}`
      })

    let embed = client.baseEmbed(message, {
      title: `${client.user.username} Economy Leaderboard`,
      description: `${(await Promise.all(bals)).join("\n")}`,
      color: client.colors.gold
    })
    return message.channel.send(embed)

  }
}