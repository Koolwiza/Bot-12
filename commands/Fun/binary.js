const Discord = require('discord.js')

module.exports = {
    name: 'binary',
    description: 'Translate your text to binary',
    usage: 'binary <text>',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],
    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        function textToBinary(string) {
            return string.split('').map(char => {
                return char.charCodeAt(0).toString(2);
            }).join(' ').split(' ').map(c => c.padStart(8, '0')).join(" ")
        }
        return message.sendE("Success", `Binary: \`${textToBinary(args.join(" "))}\``, client.colors.green)
    }
}