const Discord = require('discord.js')

module.exports = {
  name: 'tag',
  description: 'All options on a tag',
  usage: 'tag <type | tagname> [value] [new value]',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],

  premium: false,
  guildOnly: false,
  async execute(message, [type, value, ...args], client, data) {
    if (!type) return message.args("Please provide a type.")
    type = type.toLowerCase()

    let check = (a) => {
      return (client.tags.find(v => v.guild === message.guild.id && (v.name === a || v.aliases.includes(a))))
    }

    if (["add", "create"].includes(type)) {
      if (!message.member.permissions.has("MANAGE_GUILD") || client.modRole(message, data)) return client.authorPerms(message, ['MANAGE_SERVER'])
      if (!value) return message.args("Please provide a name for the tag")
      if (client.commands.has(value)) return message.error("There is already a command with this name or alias")
      if (check(value)) return message.error("There is already a tag with this name or alias")
      if (!args.length) return message.args("Please provide the tag content")

      let content = message.attachments.first() ? message.attachments.first().proxyURL : args.join(" ")

      let tagInfo = {
        name: value.toLowerCase(),
        guild: message.guild.id,
        user: message.author.id,
        reply: content,
        created: new Date(),
        aliases: [],
        modified: null,
        uses: 0
      }

      client.tags.set(`${message.guild.id}-${value}`, tagInfo)
      return message.sendE("Success", `I have added the tag ${value} with a reply of \`\`\`${await client.clean(args.join(" "))}\`\`\``, client.colors.discord)

    } else if (["alias", "alt"].includes(type)) {
      if (!message.member.permissions.has("MANAGE_GUILD") || client.modRole(message, data)) return client.authorPerms(message, ['MANAGE_SERVER'])
 
      if (!value) return message.args("Please provide an option.\nadd | remove")
      let option = args[0]
      if (!check(option)) return message.args("Please provide a valid tag")
      option = option.toLowerCase()

      if (["add", "create"].includes(value)) {
        let alias = args[1]
        if (!alias) return message.args("Please provide an alias")
        client.tags.push(`${message.guild.id}-${option}`, alias, "aliases")
        return message.sendE("Success", `I have added the alias \`${alias}\` to the tag \`${alias}\``, client.colors.green)

      } else if (["remove", "delete"].includes(value)) {

        let alias = args[1]
        if (!alias) return message.args("Please provide an alias")

        let b = client.tags.get(`${message.guild.id}-${option}`)

        if (!b.aliases.includes(alias)) return message.error("Tag does not have the alias: " + alias)

        b.aliases.remove(alias)
        client.tags.set(`${message.guild.id}-${option}`, b)

        return message.sendE("Success", `I have removed the alias \`${alias}\` from the tag \`${alias}\``, client.colors.green)
      }

    } else if (['list'].includes(type)) {

      let member = await client.resolveUser(value)
      let guildTags = client.tags.filter(c => c.guild === message.guild.id)

      if (!member) {
        let tagList = guildTags.map(c => `\`${c.name}\``).join(", ")
        return message.sendE(`${guildTags.size} Tags`, tagList ? tagList : "There are no tags", client.colors.sky)
      } else {
        guildTags = client.tags.filter(c => c.guild === message.guild.id && c.user === member.id)

        let userTagList = guildTags.map(c => `\`${c.name}\``).join(", ")

        return message.sendE(`${member.username}'s Tags`, `**${guildTags.size} Tags**\n${userTagList ? userTagList : "This user has no tags"}`, client.colors.sky)

      }


    } else if (['search', 'find'].includes(type)) {

      let foundTags = client.tags.filter(c => c.name.includes(value))
      return message.sendE(`${foundTags.size} Tags found`, `${foundTags.map(c => `\`${c.name}\``).join(", ")}`, client.colors.sky)

    } else if (['delete', 'remove'].includes(type)) {
      if (!message.member.permissions.has("MANAGE_GUILD") || client.modRole(message, data)) return client.authorPerms(message, ['MANAGE_SERVER'])
      if(!check(value)) return message.error("Please provide a valid tag")
      client.tags.delete(`${message.guild.id}-${value}`)
      return message.sendE("Success", `Deleted the tag \`${value}\``, client.colors.green)
      
    } else {

      if (check(type)) {
        return message.channel.send(check(type).reply)
      } else {
        return message.error("There is no tag with this name/alias")
      }

    }
  }
}