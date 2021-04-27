const Discord = require('discord.js'),
    ms = require('ms')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'ping',
    description: 'A simple ping command',
    usage: 'ping',
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

        let msg = await message.sendE("", "```🏓 Pinging...```")
        await client.wait(1000)

        let embed = new Discord.MessageEmbed()
            .setDescription(`\`\`\`🏓 Pong!\nMessage Latency: ${msg.createdTimestamp - message.createdTimestamp}\nAPI Latency: ${client.ws.ping}\`\`\``)
            .default(message.author)

        return msg.edit(embed)
    }
}