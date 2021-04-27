const {
    zalgo
} = require('@favware/zalgo')
const Discord = require('discord.js'),
    Bot12 = require('../../src/struct/Bot12')

module.exports = {
    name: 'zalgo',
    description: 'Turn your text into evil characters!',
    usage: 'zalgo <text>',
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
       let text = args.join(" ")
       if(!text) return message.error("Please provide text to convert")
       let convertedText = zalgo(text)
       return message.sendE("ZALGO 😈", convertedText, client.colors.red)
    }
}