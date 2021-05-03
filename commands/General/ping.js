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
        let ping = msg.createdTimestamp - message.createdTimestamp
        let apiPing = client.ws.ping

        let embed = new Discord.MessageEmbed()
            .setDescription(`\`\`\`🏓 Pong!\nMessage Latency: ${findEmojiPing(ping)}${ping}\nAPI Latency: ${findEmojiPing(apiPing)}${apiPing}\`\`\``)
            .default(message.author)

        return msg.edit(embed)
    }
}

/**
 * 
 * @param {Number} ping 
 * @param {Object} options
 */

let findEmojiPing = function (ping, options) {
    let values = {
        "high": 350,
        "medium": 150,
        "low": 50
    }
    values = {
        ...values,
        ...options
    }
    if (ping > values.high) {
        return '🔴'
    } else if (ping > values.medium) {
        return '🟡'
    } else {
        return '🟢'
    }
}