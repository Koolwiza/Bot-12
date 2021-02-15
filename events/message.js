const Discord = require("discord.js");
const Enmap = require('enmap')
const {
  defaultSettings,
  defaultPlugins
} = require('../data/config.json'),
  humanize = require('humanize-duration')

let cooldowns = new Discord.Collection()

module.exports = async (client, message) => {

  if (message.author.bot) return
  if (!message.guild || message.channel.type === "dm") return

  client.guildData.ensure(message.guild.id, defaultSettings)
  client.plugins.ensure(message.guild.id, defaultPlugins)

  client.userProfiles.ensure(message.author.id, {
    balance: 0,
    premium: false
  })

  client.disabled.ensure("commands", {
    guild: {},
    global: []
  })


  const prefix = client.guildData.has(message.guild.id, "prefix") ? client.guildData.get(message.guild.id, "prefix") : client.config.defaultSettings.prefix
  if (await client.resolveUser(message.content.split(" ")[0]) === client.user) message.channel.send(
    new Discord.MessageEmbed()
      .setDescription("👋 **Hello " + message.author.toString() + ", my prefix is `" + prefix + '`. \nUse the command `help` for all of my commands!**')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setFooter(client.user.username, client.user.displayAvatarURL())
      .setColor(client.colors.sky)
  )

  if (client.plugins.get(message.guild.id, "invites")) {
    let inviteRegex = /(https?:\/\/)?(www\.)?(disc(ord)?\.(gg|li|me|io)|discordapp\.com\/invite|invite\.gg)\/.+/gi
    if (inviteRegex.test(message.content) /*&& !message.member.hasPermission("MANAGE_GUILD")*/) {
      message.delete().catch(() => { })
      message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send invites in this server**`).then(m => {
        setTimeout(() => {
          m.delete().catch(() => { })
        }, 5000)
      })
    }
  } else if (client.plugins.get(message.guild.id, "links")) {
    let urlReg = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/ig
    if (urlReg.test(message.content) /* && !message.member.hasPermission("MANAGE_GUILD")*/) {
      message.delete().catch(() => { })
      message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send links in this server**`).then(m => {
        setTimeout(() => {
          m.delete().catch(() => { })
        }, 5000)
      })
    }
  } else if (client.plugins.get(message.guild.id, "spoilers")) {
    let spoilerRegex = /\|\|.*?\|\|/gmi
    const match = message.content.match(spoilerRegex)
    if (Array.isArray(match) && match.length >= 3) {
      message.delete().catch(() => { })
      message.channel.send(`${message.author.toString()}, ${client.emoji.misc.xmark} **You aren't allowed to send multiple spoilers in this server**`).then(m => {
        setTimeout(() => {
          m.delete().catch(() => { })
        }, 5000)
      })
    }
  }

  let args = message.content.trim().slice(prefix.length).trim().split(/ +/g)
  let commandName = args.shift().toLowerCase()

  if (!message.content.startsWith(prefix)) return;

  let command = message.client.commands.get(commandName) || message.client.commands.find(c => c.aliases && c.aliases.includes(commandName))

  if (!command) return;

  if (client.plugins.get(message.guild.id, "deletemodcmds")) {
    if (command.category.toLowerCase() === "administrator") message.delete()
  }

  let guildCmd = client.disabled.get("commands", "guild")
  if (guildCmd[message.guild.id].includes(command.name)) return message.channel.send(`${client.emoji.bot.disabled} **This command is disabled for this guild**`)

  let globalCmd = client.disabled.get("commands", "global")
  if (globalCmd.some(cmd => cmd.command === command.name)) return message.channel.send(`${client.emoji.bot.disabled} **This command is disabled globally**`)


  /*if (command.premium) {
    if(!client.config.owners.includes(message.author.id) || !client.userProfiles.get(message.author.id).premium) {
      return message.channel.send(client.baseEmbed(message, {
        title: "Missing Premium",
        description: "This command is only available to premium members",
        color: client.colors.red
      }))
    }
  }*/

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Map());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now);

      return message.channel.send(client.baseEmbed(message, {
        title: "You are on a cooldown!",
        description: `You can only use this command in **${humanize(timeLeft, {conjunction: " and ", serialComma: false})}** `,
        color: client.colors.red
      }))
    }
  } 

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args, client)
    client.logger.cmd(`${message.author.username} used the command ${command.name}`)

  } catch (e) {
    client.logger.error(e)
    client.error(message, e)
  }

}