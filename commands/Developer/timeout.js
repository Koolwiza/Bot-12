const Discord = require('discord.js'),
    Timeout = require('../../struct/Timeouts')

module.exports = {
    name: 'timeout',
    description: 'adsf',
    usage: 'asdf',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],
    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        let timeout = new Timeout('test1', 10000)

        timeout.add(() => {
            message.channel.send("Yooooo")
        })
    }
}