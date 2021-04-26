const Discord = require('discord.js'),
    fetch = require('node-fetch'),
    Bot12 = require('../../src/struct/Bot12')

module.exports = {
    name: 'changelog',
    description: 'Get the most recent changes to the bot',
    usage: 'changelog',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {
        const url = 'https://api.github.com/repos/koolwiza/bot-12/commits'
        let body = await fetch(url).then(res => res.json())
        body = body.slice(0, 5)
        let a = body.map(c => {
            let slicedCommit = c.sha.slice(0, 7)
            let commitLink = c.commit.url
            let author = c.commit.author.name
            let authorLink = `https://www.github.com/${author}`
            let commitMessage = trim(c.commit.message, 20)


            return `[\`${slicedCommit}\`](${commitLink}) ${commitMessage} - [${author}](${authorLink})`
        })

        let embed = new Discord.MessageEmbed()
            .setTitle(`5 latest commits to ${client.user.username}`)
            .setDescription(a.join("\n"))
            .setColor(client.colors.green)
            .default(message.author)
        return message.channel.send(embed)
    }
}

/**
 * 
 * @param {string} string 
 * @param {number} length 
 */

function trim(string, length) {
    return string.length > length ? `${string.slice(0, -(string.length - length))} ... ` : string
}