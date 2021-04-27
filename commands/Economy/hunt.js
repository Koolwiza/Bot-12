const Discord = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'hunt',
    description: 'Hunt for animals!',
    usage: 'hunt',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    
    cooldown: 5 * 60,
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {
        let inventory = data.user(message.author).inventory
        if (inventory.hunting_rifle < 1) return message.error("You need a hunting rifle to execute this command! Buy it from the shop!")
        let animals = ['🐇', '🐦', '🐗', '🦬', '🦌']
        let amount = Math.floor(Math.random() * 3)
        if (amount === 0) {
            return message.sendE("Out of luck!", `Dang... an unsuccessful hunting trip. You came back with ${amount} animals`, client.colors.orange)
        } else {
            client.userProfiles.math(message.author.id, "add", amount, "inventory.animals")
            return message.sendE("Nice shot!", `You went into the woods and came back with ${animals[Math.floor(Math.random() * animals.length)]} ${amount >= 2 ? `${amount} animals` : `${amount} animal`}!`, client.colors.orange)
        }
    }
}