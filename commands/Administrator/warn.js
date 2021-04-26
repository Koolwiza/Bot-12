const Discord = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
  name: 'warn',
  description: 'Warn a user',
  usage: 'warn <user> <reason>',
  aliases: [],
  required: [],
  user: ['MANAGE_GUILD'],
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
    
    let user = await client.resolveUser(args[0])
    if (!user) return message.args("Please provide a user to warn")


    let reason = args.slice(1).join(" ")
    if (!reason) reason = "No reason provided"

    let id = `${client.randomString(7)}-${client.randomString(5)}-${client.randomString(7)}`

    client.modActions.set(id, {
      user: user.id,
      guild: message.guild.id,
      type: 'warning',
      moderator: message.author.id,
      reason: reason,
      when: new Date()
    });

    await message.sendE("Success", `I have warned ${user.tag} | ${reason}`)

    await user.send(`${client.emoji.misc.xmark} You have been warned in **${message.guild.name}** for **${reason}**`)
  }
}