const Discord = require('discord.js'),
    ms = require('ms')
fetch = require('node-fetch'),

module.exports = {
    name: 'docs',
    description: 'Look at the discord.js docs',
    usage: 'docs [query]',
    aliases: ['djs'],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],
    
    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        let query = args[0]
        let version = message.content.split('--src=')[1]
        if (!version) version = 'stable'

        if (!query) query = client.awaitReply(message, client.baseEmbed(message, {
            description: "What are you looking for?",
            title: "No query inputted"
        }))
        fetch(`https://djsdocs.sorta.moe/v2/embed?src=${version}&q=${query}`).then(res => {
            res.json()
                .then(body => {
                    message.channel.send({
                        embed: body
                    }).catch(c => {
                        client.error(message, "Invalid query")
                    })
                })
        })
        
    }
}