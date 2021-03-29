const Discord = require('discord.js'),
    fetch = require('node-fetch')

module.exports = {
    name: 'github',
    description: 'Search up a user from github',
    usage: 'github <github username>',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        let url = 'https://api.github.com/users/'
        let search = args.join("-")
        if(!search) return message.error("Please provide a github user")

        let res = await fetch(`${url}${search}`)
        let body = await res.json()

        let embed = new Discord.MessageEmbed()
            .setTitle(body.login)
            .setURL(body.html_url)
            .addField("Info", `📍 ${location}: ${body.location}\n`)

    }
}