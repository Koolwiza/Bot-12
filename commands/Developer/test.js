const Discord = require('discord.js'),
    ms = require('ms'),
    enmap = require('enmap')

module.exports = {
    name: 'test',
    description: 'A test file',
    usage: 'test',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],
    args: false,
    premium: false,
    guildOnly: false,
    async execute(message, args, client) {
        if(!client.config.owners.includes(message.author.id)) return
    }
}