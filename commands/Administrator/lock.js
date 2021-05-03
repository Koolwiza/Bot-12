const Discord = require('discord.js'),
    Bot12 = require('../../src/struct/Bot12')

module.exports = {
    name: 'lock',
    description: 'Lock a channel, preventing all users from sending messages',
    usage: 'lock [channel]',
    aliases: [],
    required: ['MANAGE_CHANNELS'],
    user: ['MANAGE_CHANNELS'],
    category: __dirname.split("commands\\")[1],
    premium: false,
    ignore: true,
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Bot12} client 
     */
    async execute(message, args, client) {
       
        let channel = await client.resolveChannel(args[0]) || message.channel

        channel.permissionOverwrites.forEach(c => c.update({
            SEND_MESSAGES: false,
            CONNECT: false,
            ADD_REACTIONS: false,
            USE_SLASH_COMMANDS: false
        }))

        return message.sendE("Locked", `🔒 Locked ${channel.toString()}`, client.colors.green)
    }
}