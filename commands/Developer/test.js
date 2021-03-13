const Discord = require('discord.js'),
moment = require('moment')

module.exports = {
    name: 'test',
    description: '',
    usage: '',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    ignore: true,
    async execute(message, args, client, data) {

        const fetch = require('node-fetch')
        let res = await fetch('https://api.hypixel.net/skyblock/auctions?page=0')
        let body = await res.json()

        let content = body.auctions.map( c => {
            
            let uuid = c.uuid

            let startedAt = c.start
            let start = moment.utc(startedAt).local()

            start = moment(start).format('lll')
            let startedAtFromNow = moment(start).fromNow()


            let endsAt = c.end
            let end = moment.utc(endsAt).local()

            end = moment(end).format('lll')
            let endsAtFromNow = moment(end).fromNow()

            let item

            return `
User: ${uuid}
Start: ${start} (${startedAtFromNow})
End: ${end} (${endsAtFromNow})
            `.trim()
        }).join('\n\n')

        console.log(content)

        let buf = Buffer.from(content, 'utf-8')

        message.channel.send(new Discord.MessageAttachment(buf, "ah.txt"))

    }
}