const Discord = require('discord.js'),
    ms = require('ms')
fetch = require('node-fetch')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'docs',
    description: 'Look at the discord.js docs',
    usage: 'docs [query]',
    aliases: ['djs'],
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
        let query = args[0]
        let version = message.content.split('--src=')[1]
        if (!version) version = 'stable'

        if (!query) query = await client.awaitReply(message, client.baseEmbed(message, {
            description: "What are you looking for?",
            title: "No query inputted"
        }))
        let res = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=${version}&q=${query}`)
        let body = await res.json()

        return message.channel.send({
            embed: body
        }).catch(c => {
            message.error("Invalid query")
        })

    }
}