const Discord = require('discord.js'),
  ms = require('ms'),
  fetch = require('node-fetch')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
  name: 'bitcoin',
  description: 'See bitcoin values or convert bitcoin to currency',
  usage: 'bitcoin [amount]',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],

  premium: false,
  
  /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {

    let res = await fetch(encodeURI('https://blockchain.info/ticker'))
    let body = await res.json()


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
    return message.channel.send(embed)


  }
}