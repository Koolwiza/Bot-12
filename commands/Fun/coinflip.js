const Discord = require('discord.js')

module.exports = {
    name: 'coinflip',
    description: 'Flip a coin',
    usage: 'coinflip',
    aliases: ['cf', 'flip'],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        let choice = Math.random() > 0.5 
        if(choice) {
            return message.sendE("Coinflip", `${client.emoji.misc.coin} You flipped a coin and got heads!`, client.colors.gold)
        } else {
            return message.sendE("Coinflip", `${client.emoji.misc.coin} You flipped a coin and got tails!`, client.colors.gold)
        }
    }
}