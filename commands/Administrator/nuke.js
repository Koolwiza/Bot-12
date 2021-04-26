const Discord = require('discord.js'),
    Bot12 = require('../../src/struct/Bot12')

module.exports = {
    name: 'nuke',
    description: 'Nuke a channel',
    usage: 'nuke [channel]',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    ignore: true,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {
        let channel = await client.resolveChannel(args[0]) || message.channel
        let position = channel.position

        let newChannel = await channel.clone({reason: "Nuke channel"})
        newChannel.setPosition(position)

        channel.delete().catch(e => {
            return message.error("I could not delete the channel, please try again")
        })

        let msg = await newChannel.send("Channel nuked!", {files: ['https://media4.giphy.com/media/hvGKQL8lasDvIlWRBC/giphy.gif']})
        await client.wait(7500)
        msg.delete().catch(e => {
            client.logger.error(e)
        })
    }
}