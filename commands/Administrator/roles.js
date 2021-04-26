const Discord = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
  name: 'roles',
  description: 'Send all roles in the server',
  usage: 'roles',
  aliases: [],
  required: [],
  user: ['MANAGE_ROLES'],
  category: __dirname.split("commands\\")[1],

  premium: false,
  
  ignore: true,
  /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {
    let msg = "```asciidoc\n== ROLES ==\n"
    let names = message.guild.roles.cache.map(c => `${c.name}`)
    let longest = names.reduce((long, str) => Math.max(long, str.length), 0)
    message.guild.roles.cache.forEach(c => {
      msg += `${c.name}${" ".repeat(longest - c.name.length)} :: ${c.members.size} members\n`
    })
    msg += "```"
    message.channel.send(msg, {
      split: true
    })
  }
}