const Discord = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
  name: 'say',
  description: 'Say something',
  usage: 'say <message>',
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
    let msg = args.join(" ")
    if(!msg) return message.args("Please provide a message to say")
    return message.sendE("", msg, client.colors.discord)
  }
}