const Discord = require('discord.js')

module.exports = {
    name: 'plugins',
    description: 'Enable or show plugins',
    usage: 'plugins <type> [<property> <value>]',
    aliases: [],
    required: ['MANAGE_GUILD'],
    user: ['MANAGE_GUILD'],
    category: __dirname.split("commands\\")[1],
    args: false,
    premium: false,
    guildOnly: false,
    async execute(message, args, client) {
        if (!message.member.hasPermission("MANAGE_GUILD")) return client.authorPerms(message, ["MANAGE_SERVER"])

        if (!args[0]) return client.error(message, "No type provided.\nenable | disable | show")

        let type = args[0].toLowerCase()
        if (type === "enable") {
            const prop = args[1]

            if (!prop) return client.error(message, "No property provided")

            if (!client.plugins.has(message.guild.id, prop.toLowerCase())) {
                return client.error(message, "Provided plugin property wasn't valid")
            }

            client.plugins.set(message.guild.id, true, prop)
            message.channel.send(client.baseEmbed(message, {
                title: "Success",
                description: `Guild plugin ${prop} has been enabled`,
                color: client.colors.green
            }))
        } else if (type === "disable") {
            const prop = args[1]

            if (!prop) return client.error(message, "No property provided")

            if (!client.plugins.has(message.guild.id, prop.toLowerCase())) {
                return client.error(message, "Provided plugin property wasn't valid")
            }

            client.plugins.set(message.guild.id, false, prop)
            message.channel.send(client.baseEmbed(message, {
                title: "Success",
                description: `Guild plugin ${prop} has been disabled`,
                color: client.colors.green
            }))
        } else if (type === "show") {

            let output = `\`\`\`asciidoc\n== Server Configurations ==\n`
            let guildProps = Object.keys(client.plugins.ensure(message.guild.id, client.config.defaultPlugins))
            let a = client.plugins.ensure(message.guild.id, client.config.defaultPlugins)
            const longest = guildProps.reduce((long, str) => Math.max(long, str.length), 0)
            guildProps.forEach(c => {
                if (a[c] === null) {
                    output += `${c}${" ".repeat(longest - c.length)} :: None\n`
                } else {
                    output += `${c}${" ".repeat(longest - c.length)} :: ${a[c]}\n`
                }

            })
            message.channel.send(output.replace(/false/ig, "Disabled").replace(/true/ig, "Enabled") + "Set plugins using plugins set <type> true/false```");
        }
    }
}