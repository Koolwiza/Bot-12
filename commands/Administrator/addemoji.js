const Discord = require('discord.js')
const {
  parse
} = require("twemoji-parser");
const {
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: 'addemoji',
  description: 'Adds the emoji to the server',
  usage: 'addemoji <emoji> [name]',
  aliases: [],
  category: __dirname.split("commands\\")[1],
  required: ['SEND_MESSAGES'],
  user: ['SEND_MESSAGES', 'MANAGE_EMOJIS'],
  args: true,
  premium: false,
  guildOnly: true,
  cooldown: 10,
  async execute(message, args, client, data) {
    if (!message.member.permissions.has("MANAGE_EMOJIS") || client.modRole(message, data)) return client.authorPerms(message, ["BAN_MEMBERS"])

    if (!message.guild.me.hasPermission("MANAGE_EMOJIS")) {
      return client.noPerms(message, ['MANAGE_EMOJIS'])
    }

    const emoji = args[0];
    if (!emoji) return client.missingArgs(message, "Please give me an emoji to add")

    let urlReg = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/ig

    let emojiTest = urlReg.test(emoji)
    if (emojiTest) {
      let name = args.slice(1).join(" ")

      message.guild.emojis.create(emoji, name).catch(error => {
        client.logger.error(error)
      })
      return message.sendE("Emoji Added", `**Name:** \`${name}\` | **Preview:** [Click Me](${emoji})`, client.colors.green)
    } else {

      let customemoji = Discord.Util.parseEmoji(emoji);

      if (customemoji.id) {
        const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${
          customemoji.animated ? "gif" : "png"
          }`;
        const name = args.slice(1).join(" ");
        message.guild.emojis.create(`${Link}`, `${name || `${customemoji.name}`}`)
          .catch(error => {
            client.logger.log("There was an error adding an emoji\n" + error, "error")
          })
      
        return message.sendE("Emoji Added", `**Name:** \`${name || `${customemoji.name}`}\` | **Preview:** [Click Me](${Link})`, client.colors.green).catch(e => {
          client.logger.log("There was an error sending the confirm add emoji\n" + e, "error")
        })
      } else {

        let CheckEmoji = parse(emoji, {
          assetType: "png"
        });
        if (!CheckEmoji[0]) return message.error("Please give me a valid emoji")
        return message.channel.sendE("Returned", "You can use discord emojis without adding to a server")
      }
    }

  }
};