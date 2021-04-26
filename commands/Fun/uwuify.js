const Discord = require('discord.js'),
    Bot12 = require('../../src/struct/Bot12'),
    Uwuifier = require('uwuifier'),
    uwuify = new Uwuifier()

module.exports = {
    name: 'uwuify',
    description: 'Tuwn youw text into dis',
    usage: 'uwuify <text>',
    aliases: ['uwu'],
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
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {
        let text = args.join(" ")
        if (!text) message.error("Please provide text to uwuify")

        return message.sendE("~uwu~", uwuify.uwuifySentence(text), client.colors.green)
    }
}