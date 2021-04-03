const Discord = require('discord.js'),
  Tag = require('../../src/struct/Tag')

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

    let check = (tag) => {
      return (client.tags.find(v => {
        return v.guild === message.guild.id && (v.tagName === tag || v.aliases.includes(tag))
      }))
    }

    if (["add", "create"].includes(type)) {
      if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD) || client.modRole(message, data.guild)) return client.authorPerms(message, ['MANAGE_SERVER'])
      if (!value) return message.args("Please provide a name for the tag")
      if (!args.length) return message.args("Please provide the tag content")

      let content = message.attachments.first() ? message.attachments.first().proxyURL : args.join(" ")

      new Tag(value.toLowerCase(), content, message.author.id, message.guild.id).save()

      return message.sendE("Success", `I have added the tag ${value} with a reply of \`\`\`${await client.clean(args.join(" "))}\`\`\``, client.colors.discord)

    } else if (["alias", "alt"].includes(type)) {
      if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD) || client.modRole(message, data.guild)) return client.authorPerms(message, ['MANAGE_SERVER'])

      if (!value) return message.args("Please provide an option.\nadd | remove")
      let option = args[0]
      if (!check(option)) return message.args("Please provide a valid tag")
      option = option.toLowerCase()

      let alias = args[1]
    
      if (!alias) return message.args("Please provide an alias")


      if (["add", "create"].includes(value)) {
        if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD) || client.modRole(message, data.guild)) return client.authorPerms(message, ["MANAGE_GUILD"])
    
        Tag.alias("add", `${message.guild.id}-${option}`, alias)

        return message.sendE("Success", `I have added the alias \`${alias}\` to the tag \`${alias}\``, client.colors.green)

      } else if (["remove", "delete"].includes(value)) {
        if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD) || client.modRole(message, data.guild)) return client.authorPerms(message, ["MANAGE_GUILD"])
    
        try {
          Tag.alias("remove", `${message.guild.id}-${option}`, alias)
        } catch (e) {
          return message.error("Tag does not have the alias: " + alias)
        }

        return message.sendE("Success", `I have removed the alias \`${alias}\` from the tag \`${alias}\``, client.colors.green)
      }

    } else if (['list'].includes(type)) {

      let member = await client.resolveUser(value)

      let tags = Tag.list(message, member)
      let tagList = tags.map(c => `\`${c.name}\``).join(", ")
      return message.sendE(`${member ? `${member.username}'s` : tags.size} Tags`, `${tagList ? tagList : "There are no tags"}`, client.colors.sky)


    } else if (['search', 'find'].includes(type)) {

      let foundTags = Tag.search(value)
      return message.sendE(`${foundTags.size} Tags found`, `${foundTags.map(c => `\`${c.name}\``).join(", ")}`, client.colors.sky)

    } else if (['delete', 'remove'].includes(type)) {
      if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD) || client.modRole(message, data.guild)) return client.authorPerms(message, ['MANAGE_SERVER'])
      if (!check(value)) return message.error("Please provide a valid tag")

      Tag.delete(message, value)
      return message.sendE("Success", `Deleted the tag \`${value}\``, client.colors.green)

    } else {

      if (check(type)) {
        
        client.tags.inc(`${message.guild.id}-${check(type).tagName}`, "uses")
        return message.channel.send(check(type).reply)
      } else {
        return message.error("There is no tag with this name/alias")
      }

    }
  }
}