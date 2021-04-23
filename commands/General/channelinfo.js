const Discord = require('discord.js'),
    moment = require('moment')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'channelinfo',
    description: 'Display detailed information on the channel',
    usage: 'channel [channel]',
    aliases: ['channel'],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        let channel = await client.resolveChannel(args[0]) ?? message.channel
        let date = moment(channel.createdAt).format('lll')

        let embed = new Discord.MessageEmbed()
            .setTitle(`${channel.name} Information`)
            .setDescription(`${channel.nsfw ? "🔞 **NSFW**":""}${client.emoji.server.text} Channel: [${channel.toString()}](https://discord.com/channels/${message.channel.id}/${channel.id} 'ID: ${channel.id}') *Hover for more*\n🗒️ Topic: ${channel.topic || "No topic"}\n⏰ Created At: ${date}`)
            .default(message.author)
            .success()
        return message.channel.send(embed)
    }
}