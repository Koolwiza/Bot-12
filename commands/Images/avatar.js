const {
  cmd
} = require("../../helpers/logger");

const Discord = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
  name: 'avatar',
  description: 'Show the avatar of a person',
  usage: 'avatar [user]',
  aliases: ['av', 'pfp', 'profilepicture'],
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
    let user = await client.resolveUser(args[0]) || message.author

    let size = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096]
    let type = ['webp', 'png', 'jpg', 'gif', 'jpeg']

    let embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setImage(user.displayAvatarURL({
        dynamic: true
      }))
      .setFooter(client.user.username, client.user.displayAvatarURL())
      .setColor(client.colors.sky)

    type.forEach(em => {
      embed.addField(em.toProperCase(), size.map(s => `[${s}](${user.displayAvatarURL({size: s, format: em})})`).join(" | "))
    })



    return message.channel.send(embed)

  }
}