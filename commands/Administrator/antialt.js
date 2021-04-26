const Discord = require('discord.js')
const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'antialt',
    description: 'Configure antialt settings',
    usage: 'antialt <type> [value]',
    aliases: [],
    required: [],
    user: ['MANAGE_GUILD'],
    category: __dirname.split("commands\\")[1],
    premium: false,
    

    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Bot12} client 
     * @param {object} data 
     */

    async execute(message, [type, ...value], client, data) {
        let ac = client.config.plugins.defaultAntiAlt
        let allowedTypes = Object.keys(ac)
        let options = ['show','enable', 'disable', ...allowedTypes]
        if (!type) return message.args("Please provide an option to configure")

        type = type.toLowerCase()
        if (!options.includes(type)) return;

        if (type === "show") {
            let output = `\`\`\`asciidoc\n== AntiAlt Configurations ==\n`
            let props = Object.keys(ac)
            const longest = props.reduce((long, str) => Math.max(long, str.length), 0)
            props.forEach(c => {
                if (Array.isArray(c)) c = c.join(", ")
                if (ac[c] === null) {
                    output += `${c}${" ".repeat(longest - c.length)} :: None\n`
                } else {
                    output += `${c}${" ".repeat(longest - c.length)} :: ${ac[c]}\n`
                }

            })
            return message.channel.send(output + "```");
        } else if (type === "enable") {
            client.antiAlt.set(message.guild.id, true, "enabled")
            return message.sendE("Success", `Enabled anti alt`, client.colors.green)
        } else if (type === "disable") {
            client.antiAlt.set(message.guild.id, false, 'enabled')
            return message.sendE("Success", `Disabled anti alt`, client.colors.green)
        } else {
            if (!Object.keys(ac).includes(type)) return message.args("Please provide a valid type to configure")

            if (type === "punishment") {
                if (!['kick', 'ban'].includes(value.join(" "))) return message.error("Punishment can only be kick or ban")
                client.antiAlt.set(message.guild.id, value.join(" "), "punishment")
                return message.sendE("Success", `Set \`punishment\` as \`${value.join(" ")}\``, client.colors.green)
            }
    
            client.antiAlt.set(message.guild.id, value.join(" "), type)
            return message.sendE("Success", `Set \`${type}\` as \`${value.join(" ")}\``, client.colors.green)
        }
    }
}