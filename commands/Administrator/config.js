const Discord = require('discord.js')

module.exports = {
    name: 'config',
    description: 'Display or set server settings',
    usage: 'config <type> [<property> <value>]',
    aliases: [],
    required: ['MANAGE_GUILD'],
    user: ['MANAGE_GUILD'],
    category: __dirname.split("commands\\")[1],
    
    premium: false,
    guildOnly: false,
    async execute(message, args, client) {
        if (!message.member.permissions.has("MANAGE_GUILD")) return client.authorPerms(message, ["MANAGE_SERVER"])

        if (!args[0]) return client.error(message, "No type provided\nset | show")

        let type = args[0].toLowerCase()
        if (type === "set") {
            let arr = args.slice(1).join(" ").split(/\s+/g)
            let [prop, ...value] = arr

            if (!prop) return client.error(message, "No property provided")
            if (value.length === 0) return client.error(message, "No value provided")

            if (!client.guildData.has(message.guild.id, prop.toLowerCase())) {
                return client.error(message, "Provided config property wasn't valid")
            }

            if (message.mentions.roles.size) value = message.mentions.roles.first().id

            client.guildData.set(message.guild.id, (Array.isArray(value) ? value.join(" ") : value), prop)
            message.channel.send(client.baseEmbed(message, {
                title: "Success",
                description: `Guild setting ${prop} has been set to: \`${(Array.isArray(value) ? value.join(" ") : value).replace(/false/ig, "Disabled").replace(/true/ig, "Enabled")}\``,
                color: client.colors.green
            }))
        } else if (type === "show") {

            let output = `\`\`\`asciidoc\n== Server Configurations ==\n`
            let guildProps = Object.keys(client.guildData.ensure(message.guild.id, client.config.defaultSettings))
            let a = client.guildData.ensure(message.guild.id, client.config.defaultSettings)
            const longest = guildProps.reduce((long, str) => Math.max(long, str.length), 0)
            guildProps.forEach(c => {
                if (a[c] === null) {
                    output += `${c}${" ".repeat(longest - c.length)} :: None\n`
                } else {
                    output += `${c}${" ".repeat(longest - c.length)} :: ${a[c]}\n`
                }

            })
            message.channel.send(output.replace(/false/ig, "Disabled").replace(/true/ig, "Enabled") + "```");
        }
    }
}