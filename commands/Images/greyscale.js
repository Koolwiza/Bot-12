const Discord = require('discord.js'),
    Bot12 = require('../../src/struct/Bot12'),
    {
        Canvas,
        resolveImage,
        greyscale
    } = require('canvas-constructor')

module.exports = {
    name: 'greyscale',
    description: 'Apply a gray filter to a user\'s profile picture',
    usage: 'greyscale [user]',
    aliases: [],
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
    async execute(message, args, client, data) {
        let user = await client.resolveUser(args[0]) || message.author

        let profilePicture = await resolveImage(user.displayAvatarURL({
            format: "png",
            size: 1024
        }))

        let canvas = new Canvas(profilePicture.width, profilePicture.height)
            .printImage(profilePicture, 0, 0)
            .process(greyscale)
            .toBuffer()
        let attachment = new Discord.MessageAttachment(canvas, "greyscale.png")

        return message.channel.send(attachment)
    }
}