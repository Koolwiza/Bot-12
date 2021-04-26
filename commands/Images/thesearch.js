const Discord = require('discord.js'),
    {
        resolveImage,
        Canvas
    } = require('canvas-constructor')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'thesearch',
    description: 'The search continues...',
    usage: 'thesearch <message>',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {
        let thesrch = await resolveImage('./assets/TheSearch.png')

        if (args.join(" ").length > 80) return message.error("Message cannot be longer than 80 characters")

        let text = args.join(" ")
            .match(/.{0,20}/gi)
            .join("\n")

        let theSearchImage = new Canvas(thesrch.width, thesrch.height)
            .printImage(thesrch, 0, 0)
            .setColor('#000000')
            .setTextFont('15px Sans')
            .printText(text, 60, 350)
            .toBuffer()

        let img = new Discord.MessageAttachment(theSearchImage, "search.png")
        return message.channel.send(img)
    }
}

