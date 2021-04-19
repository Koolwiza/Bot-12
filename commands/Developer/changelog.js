const Discord = require('discord.js'),
    moment = require('moment'),
    fs = require('fs')


module.exports = {
    name: 'changelog',
    description: 'Update change log',
    usage: 'changelog <title> <description>',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    ignore: true,
    async execute(message, [title, ...description], client, data) {
        let date = moment(new Date()).format('lll')
        if (!title || !description.length) return message.args("Missing title or description")
        
         fs.readFile('./docs/change-log.md', (err, data) => {
            if (err) return console.log('error')
            let update = `\n\n**${date}: ${title}**\n > ${description.join(" ")}`
            fs.writeFileSync('./docs/change-log.md', data + update)
            return message.sendE("Success", `I have updated change logs!`, client.colors.green)
        })
    }
}