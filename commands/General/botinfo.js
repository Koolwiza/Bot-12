const Discord = require("discord.js")

const {
    version
} = require("discord.js"),
    humanize = require("humanize-duration"),
    os = require('os'),
    stat = require("cpu-stat"),
    bytes = require('bytes'),
    ms = require("ms"),
    util = require('util'),
    cpu = util.promisify(stat.usagePercent)


const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'botinfo',
    description: 'Gives detailed information about the bot',
    usage: 'botinfo',
    aliases: ['bot'],
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

        let percent = await cpu()

        const duration = humanize(client.uptime, {
            conjunction: " and ",
            serialComma: false
        })
        const app = await client.fetchApplication()

        const botinfo = new Discord.MessageEmbed()
            .setAuthor(message.client.user.username)
            .setTitle("__**Stats:**__")
            .setColor(client.colors.sky)
            .addField("\\👑 Owner", `${app.owner.tag}`, true)
            .addField("\\⏳ Mem Usage", `${bytes(process.memoryUsage().heapUsed)}`, true)
            .addField("\\⌚️ Uptime ", `${duration}`, true)
            .addField("\\📁 Users", `${message.client.users.cache.size}`, true)
            .addField("\\📁 Servers", `${message.client.guilds.cache.size}`, true)
            .addField("\\📁 Channels ", `${message.client.channels.cache.size}`, true)
            .addField("\\🕰️ Created At", moment(app.createdAt).format('lll'), true)
            .addField("\\👾 Discord.js", `v${version}`, true)
            .addField("\\🤖 Node", `${process.version}`, true)
            .addField("\\🤖 CPU", `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
            .addField("\\🤖 CPU usage", `\`${percent.toFixed(2)}%\``, true)
            .addField("\\🤖 Arch", `\`${os.arch()}\``, true)
            .addField("\\💻 Platform", `\`\`${os.platform()}\`\``, true)
            .addField("API Latency", `${(message.client.ws.ping)}ms`)
        return message.channel.send(botinfo)

    }
}