const Discord = require('discord.js'),
    ms = require('ms')

module.exports = {
    name: 'ping',
    description: 'A simple ping command',
    usage: 'ping',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],
    
    premium: false,
    guildOnly: false,
    async execute(message, args, client) {

        console.log(__dirname.split('commands\\'))
        message.channel.send(client.baseEmbed(message, {description: "```🏓 Pinging...```"})).then(m => {
            client.wait(1000)
            m.edit(client.baseEmbed(message, {description: `\`\`\`🏓 Pong!\nMessage Latency: ${m.createdTimestamp - message.createdTimestamp}\nAPI Latency: ${client.ws.ping}\`\`\``}))
        })
    }
}