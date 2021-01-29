const Discord = require("discord.js");
const Enmap = require('enmap'),
moment = require('moment')

module.exports = async (client, message) => {

    let snipe = message.attachments.size ? message.attachments.first().proxyURL  : message.content
    client.snipes.set(message.guild.id, {
        content: snipe,
        time:  new Date(),
        author: message.author
    })
}