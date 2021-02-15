const Discord = require('discord.js')

module.exports = {
  name: 'prefix',
  description: 'Show or set the prefix for the server',
  usage: 'prefix [prefix]',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client) {
    
  }
}