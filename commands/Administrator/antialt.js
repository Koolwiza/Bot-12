const Discord = require('discord.js')

module.exports = {
  name: 'antialt',
  description: 'Configure antialt settings',
  usage: 'antialt <type> [value]',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, [type, ...value], client, data) {
    let ac = client.config.antiAltSettings
    let allowedTypes = Object.keys(ac)
        let options = ['show', ...allowedTypes]
        if (!type) return message.args("Please provide an option to configure")

        type = type.toLowerCase()
        if(!options.includes(type)) return;
        
        if(type === "show") {
            let output = `\`\`\`asciidoc\n== Server Configurations ==\n`
            let props = Object.keys(ac)
            let a = ac
            const longest = props.reduce((long, str) => Math.max(long, str.length), 0)
            props.forEach(c => {
                if(c instanceof Array) c = c.join(", ")
                if (a[c] === null) {
                    output += `${c}${" ".repeat(longest - c.length)} :: None\n`
                } else {
                    output += `${c}${" ".repeat(longest - c.length)} :: ${a[c]}\n`
                }

            })
            return message.channel.send(output + "```");
        }


        if(!Object.keys(ac).includes(type)) return message.args("Please provide a valid type to configure")

        if(type === "punishment") {
            if(!['kick', 'ban'].includes(value.join(" "))) return message.error("Punishment can only be kick or ban")
            client.antiAlt.set(message.guild.id, value.join(" "), "punishment")
            return message.sendE("Success", `Set \`punishment\` as \`${value.join(" ")}\``, client.colors.green)
        }
        
        client.antiAlt.set(message.guild.id, value.join(" "), type)
        return message.sendE("Success", `Set \`${type}\` as \`${value.join(" ")}\``, client.colors.green)
  }
}