const Discord = require('discord.js'),
    Bot12 = require('../../src/struct/Bot12'),
    fetch = require('node-fetch'),
    moment = require('moment')

module.exports = {
    name: 'mcserver',
    description: 'Give details about minecraft ',
    usage: 'mcserver <ip>',
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
        let [ip] = args
        if(!ip) return message.args("Please provide an ip address")

        let body = await fetch(`https://mcapi.us/server/status?ip=${encodeURIComponent(ip)}`).then(res => res.json())
        if(!body.status) return message.error("This server does not exist!")

        let emoji = body.online ? "🟢 Online!" : "🔴 Offline..."
        let image = Buffer.from(body.favicon.replace(/^data:image\/png;base64,/,""), "base64")
        let maxPlayers = body.players.max
        let onlinePlayers = body.players.now
        let serverReq = body.server.name
        let lastUpdated = moment(body.server.last_updated).format('lll')

        let embed = new Discord.MessageEmbed()
            .setTitle(ip)
            .setDescription(`Server is ${emoji}\n\n${serverReq}`)
            .attachFiles([new Discord.MessageAttachment(image, "logo.png")])
            .setThumbnail("attachment://logo.png")
            .addField("Players", `${onlinePlayers}/${maxPlayers} players`, true)
            .addField(`Last Updated`, lastUpdated, true)
            .setColor("BLUE")
        return message.channel.send(embed)
    }
}