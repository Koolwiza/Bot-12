const Discord = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
  name: 'fish',
  description: '**Requires fishing rod**. Fish at a pond getting you fish!',
  usage: '',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  cooldown: 5 * 60,
  /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {
    let inventory = data.user(message.author).inventory
    if(inventory.fishing_rod < 1) return message.error("You need a fishing rod to execute this command! Buy it from the shop!")

    let fish = Math.floor(Math.random() * 3)
    if(fish === 0) {
      return message.sendE(`Ran out of luck!`, `What a lame fishing trip! You caught ${fish} fish...`, client.colors.blue)
    } else {
      client.userProfiles.math(message.author.id, "add", fish, "inventory.fish")
      return message.sendE(`Nice catch!`, `You caught 🐟 ${fish} fish!`, client.colors.blue)
    }
    
  }
}