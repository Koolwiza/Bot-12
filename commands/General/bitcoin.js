const Discord = require('discord.js'),
  ms = require('ms'),
  fetch = require('node-fetch')

module.exports = {
  name: 'bitcoin',
  description: 'See bitcoin values or convert bitcoin to currency',
  usage: 'bitcoin [amount]',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands/")[1],
  args: false,
  premium: false,
  guildOnly: false,
  async execute(message, args, client) {

    fetch(encodeURI('https://blockchain.info/ticker'))
      .then(res => res.json())
      .then(body => {

        let types = {
          'usd': 'en-US',
          'cad': 'en-CA',
          'cny': 'en-CN',
          'jpy': 'en-ja',
          'hkd': 'en-HK',
          'rub': 'en-ru'
        }

        let a = !isNaN(parseInt(args[0])) ? parseInt(args[0]) : 1

        let embed = new Discord.MessageEmbed()
          .setTitle(a + " Bitcoin(s) conversion")
          .setColor(client.colors.gold)
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setFooter(client.user.username, client.user.displayAvatarURL())


        for (var k in types) {
          let upK = k.toUpperCase()

          let format = new Intl.NumberFormat(types[k], {
            style: "currency",
            currency: upK
          }).format(body[upK].last * a)
          embed.addField(`${upK} Prices`, `${client.emoji.bot.bitcoin} ⟹ ${format}`, true)

        }
        message.channel.send(embed)

      })
  }
}	