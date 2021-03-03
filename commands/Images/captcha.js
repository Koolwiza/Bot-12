const Discord = require('discord.js'),
    fetch = require('node-fetch')

module.exports = {
    name: 'captcha',
    description: 'Generate a fake captcha',
    usage: 'captcha [user]',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        return message.error("Command in progress")
        let user = await client.resolveUser(args[0]) || message.author

        let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=captcha&username=${user.username}&url=${user.displayAvatarURL({ format: "png", size: 512 })}`)).catch(e => {
            message.error(e)
            client.logger.error(e)
        })
        let body = await res.json()

        let captcha = new Discord.MessageAttachment(body.message, "captcha.png")
        return message.channel.send(captcha)
    }
}