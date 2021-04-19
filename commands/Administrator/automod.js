const Discord = require('discord.js')

module.exports = {
    name: 'automod',
    description: 'Configure automod settings',
    usage: 'automod <type> [value]',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, [type, ...args], client, data) {
        if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD) || !client.modRole(message, data.guild)) return client.authorPerms(message, ["MANAGE_SERVER"])
        let automod = client.autoMod.get(message.guild.id)
        let allowedTypes = Object.keys(automod)
        let options = ['show', 'enable', 'disable', ...allowedTypes]
        if (!type) return message.args("Please provide an option to configure")

        type = type.toLowerCase()
        if (!options.includes(type)) return;

        if (type === "show") {
            let output = `\`\`\`asciidoc\n== automod Configurations ==\n`
            let props = Object.keys(automod)
            const longest = props.reduce((long, str) => Math.max(long, str.length), 0)
            props.forEach(c => {
                if (Array.isArray(c)) c = c.join(", ")
                if (automod[c] === null) {
                    output += `${c}${" ".repeat(longest - c.length)} :: None\n`
                } else {
                    output += `${c}${" ".repeat(longest - c.length)} :: ${automod[c].toString().replace(/false/g, "disabled").replace(/true/g, "enabled")}\n`
                }

            })
            return message.channel.send(output + "```");
        } if (type === "enable") {
            const prop = args[0]

            if (!prop) return message.args("No property provided")

            if (!client.autoMod.has(message.guild.id, prop.toLowerCase())) {
                return message.error("Provided auto mod property wasn valid")
            }

            client.autoMod.set(message.guild.id, true, prop)
            return message.sendE("Success", `Auto mod ${prop} has been enabled`, client.colors.green)
        } else if (type === "disable") {
            const prop = args[0]

            if (!prop) return message.args("No property provided")

            if (!client.autoMod.has(message.guild.id, prop.toLowerCase())) {
                return message.error("Provided auto mod property was valid")
            }

            client.autoMod.set(message.guild.id, false, prop)
            return message.sendE("Success", `Auto mod ${prop} has been disabled`, client.colors.green)
        } 


    }
}