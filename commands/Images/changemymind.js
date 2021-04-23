const Discord = require('discord.js'),
    {
        Canvas,
        resolveImage
    } = require('canvas-constructor')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'changemymind',
    description: 'Change my mind canvas',
    usage: 'changemymind [user]',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        let image = await resolveImage('./assets/ChangeMyMind.png')

        if (args.join(" ").length > 50) return message.error("Text cannot be over 50 characters")

        let text = args
            .join(" ")
            .match(/.{0,19}/gi)
            .join("\n")

        let cv = new Canvas(image.width, image.height)
            .printImage(image, 0, 0)
            .setColor("#000000")
            .setTextFont("35px Arial")
            .printText(text, 150, 400)
            .toBuffer()

        let b = new Discord.MessageAttachment(cv, "image.png")
        return message.channel.send(b)
    }
}