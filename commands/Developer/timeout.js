const Discord = require('discord.js'),
    Timeout = require('../../src/struct/Timeouts')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'timeout',
    description: 'adsf',
    usage: 'asdf',
    aliases: [],
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
        let timeout = new Timeout('test1', 10000)

        timeout.add(() => {
            message.channel.send("Yooooo")
        })
    }
}