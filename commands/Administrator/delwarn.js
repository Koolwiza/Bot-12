const Discord = require('discord.js')
const moment = require('moment')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
  name: 'delwarn',
  description: 'Remove a user\'s warn using an id',
  usage: 'delwarn <id>',
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
    mod = client.modActions

    let id = args[0]
    if (!id) return message.args("Please provide a warning id")
    if (!mod.has(id) || mod.get(id, "guild") !== message.guild.id) return message.error("Invalid warning id")

    mod.delete(id)
    return message.sendE("Success", `Deleted the warning with an id of \`${id}\``, client.colors.green)
  }
}