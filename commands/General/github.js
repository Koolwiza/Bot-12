const Discord = require('discord.js'),
    fetch = require('node-fetch')

const Bot12 = require('../../src/struct/Bot12.js')

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
        let search = encodeURIComponent(args.join("-"))
        if(!search) return message.error("Please provide a github user")

        let res = await fetch(`${url}${search}`)
        let body = await res.json()

        let embed = new Discord.MessageEmbed()
            .setTitle(body.login)
            .setURL(body.html_url)
            .setDescription(body.location)
            .addField("Bio", `${body.bio}`, true)
            .addField("Statistics", `Repositories: ${body.public_repos}\nGists: ${body.public_gists}\nFollowers: ${body.followers}\nFollowing: ${body.following}`, true)
            .setTimestamp(body.created_at)
            .setImage(res.avatar_url)
            .setColor(client.colors.sky)
            .default(message.author)
        return message.channel.send(embed)
    }
}