const Discord = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'plugins',
    description: 'Enable or show plugins',
    usage: 'plugins <type> [<property> <value>]',
    aliases: [],
    required: ['MANAGE_GUILD'],
    user: ['MANAGE_GUILD'],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD) || !client.modRole(message, data.guild)) return client.authorPerms(message, ["MANAGE_SERVER"])

        if (!args[0]) return message.args("No type provided.\nenable | disable | show")

        let type = args[0].toLowerCase()
        if (type === "enable") {
            const prop = args[1]

            if (!prop) return message.args("No property provided")

            if (!client.plugins.has(message.guild.id, prop.toLowerCase())) {
                return message.error("Provided plugin property wasn valid")
            }

            client.plugins.set(message.guild.id, true, prop)
            return message.sendE("Success", `Guild plugin ${prop} has been enabled`, client.colors.green)
        } else if (type === "disable") {
            const prop = args[1]

            if (!prop) return message.args("No property provided")

            if (!client.plugins.has(message.guild.id, prop.toLowerCase())) {
                return message.error("Provided plugin property wasn valid")
            }

            client.plugins.set(message.guild.id, false, prop)
            return message.sendE("Success", `Guild plugin ${prop} has been disabled`, client.colors.green)
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
            return message.channel.send(output.replace(/false/ig, "Disabled").replace(/true/ig, "Enabled") + "Set plugins using plugins enable/disable <plugin>```");
        }
    }
}