const base = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&order=viewCount'

const Discord = require('discord.js'),
    Bot12 = require('../../src/struct/Bot12'),
    fetch = require('node-fetch')

module.exports = {
    name: 'youtube',
    description: 'Search for a youtube video',
    usage: 'youtube',
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
        let query = args.join(" ")
        if (!query) return message.error("Please provide a search query")
        query = encodeURIComponent(query)
        let body = await fetch(`${base}&key=${client.config.google_api_key}&q=${query}`).then(res => res.json())
        let video = body.items[0]

        if(!video) return message.error("No videos found with that query")
        let embed = new Discord.MessageEmbed()
            .setTitle(video.snippet.title)
            .setDescription(video.snippet.description)
            .setImage(video.snippet.thumbnails.high.url)
            .setColor(client.colors.red)
            .setAuthor(video.snippet.channelTitle, "", `https://www.youtube.com/channel/${video.snippet.channelId}`)
            .setURL(`https://www.youtube.com/watch?v=${video.id.videoId}`)
        return message.channel.send("The results are based on highest views", {
            embed: embed
        })
    }
}