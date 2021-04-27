const base = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&order=viewCount'

const Discord = require('discord.js'),
    Bot12 = require('../../src/struct/Bot12')

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
    }
}