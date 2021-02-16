const Discord = require('discord.js'),
    {
        defaultSettings
    } = require('../../data/config.json')

module.exports = {
    name: 'prefix',
    description: 'Show or set the prefix for the server',
    usage: 'prefix [prefix]',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],
    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        if (!message.member.permissions.has("MANAGE_GUILD") || (message.guild.roles.cache.get(data.modrole) && !message.member.roles.cache.has(data.modrole)) ) return client.authorPerms(message, ["MANAGE_SERVER"])

        if (!args.length) {
            let prefix = client.guildData.get(message.guild.id).prefix || defaultSettings.prefix

            return message.channel.send(client.baseEmbed(message, {
                title: "Prefix for " + message.guild.name,
                description: `👋 My prefix is \`${prefix}\`. 
            To configure it, run the command \`prefix [prefix]\` e.g \`prefix !\``,
                color: client.colors.sky
            }))
        } else {

            let prefix = args.join(" ")
            if (prefix.length > 5) return client.error(message, "Prefix can not be longer than 5 characters")

            client.guildData.set(message.guild.id, prefix, "prefix")

            return message.channel.send(client.baseEmbed(message, {
                title: "Success",
                description: "Changed prefix of this guild to `" + prefix + "`",
                color: client.colors.green
            }))
        }

    }
}