

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'prefix',
    description: 'Show or set the prefix for the server',
    usage: 'prefix [prefix]',
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
        
        if (!args.length) {
            let prefix = client.guildData.get(message.guild.id).prefix || client.config.defaultSettings.prefix

            return message.sendE(`Prefix for ${message.guild.name}`, `👋 My prefix is \`${prefix}\`. 
To configure it, run the command \`prefix [prefix]\` e.g \`prefix !\``, client.colors.sky)
        } else {

            let prefix = args.join(" ")
            if (prefix.length > 5) return message.error("Prefix can not be longer than 5 characters")
            client.guildData.set(message.guild.id, prefix, "prefix")

            return message.sendE("Success", `Changed prefix to ${prefix}`, client.colors.green)
        }

    }
}