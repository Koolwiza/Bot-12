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
        console.log('test 1')
        if (!title || !description.length) {
            console.log('no args') 
            message.args("Missing title or description")
        }
        console.log('test 2')
         fs.readFile('./docs/change-log.md', (err, data) => {
            console.log('test 3')
            console.log(data)
            if (err) return console.log('error')
            let update = `\n\n**${date}: ${title}**\n > ${description.join(" ")}`
            fs.writeFileSync('./docs/change-log.md', data + update)
        })
        message.channel.send("Updated!")

        console.log(fs.readFileSync('./docs/change-log.md'))

    }
}