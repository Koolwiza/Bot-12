const chalk = require('chalk'),
    Discord = require('discord.js'),
    {
        defaultPlugins,
        defaultSettings
    } = require('../data/config.js')
const message = require('./message.js')

module.exports = async (client, reaction, user) => {
    if (reaction.partial) await reaction.fetch()
    if (user.partial) await reaction.fetch()
    if (reaction.message.partial) await reaction.message.fetch()

    if (reaction.emoji.name === "❌" && message.author.id === client.user.id) return reaction.message.delete()

}