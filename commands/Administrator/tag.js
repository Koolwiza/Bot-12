const Discord = require('discord.js')

module.exports = {
  name: 'tag',
  description: 'All options on a tag',
  usage: 'tag <type> [value] [new value]',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, [type, value, ...args], client, data) {
    if(!type) return client.missingArgs(message, "Please provide a type.")
    
    if(type === "create") {
        if(!message.member.permissions.has("MANAGE_GUILD") || client.modRole(message, data)) return client.authorPerms(message, ['MANAGE_SERVER'])

        if(!value) return client.missingArgs(message, "Please provide a name for the tag")
        if(!args.length) return client.missingArgs(message, "Please provide the tag content")

        let tagInfo = {
            name: value.toLowerCase(),
            user: message.author.id,
            reply: args,
            created: new Date(),
            aliases: [],
            modified: null,
            uses: 0
        }

        client.tags.push(message.guild.id, tagInfo)
        return message.sendE("Success", `I have added the tag ${value} with a reply of \`\`\`${args}\`\`\``)
    } 
  }
}