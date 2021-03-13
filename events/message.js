const Discord = require("discord.js");
const Enmap = require('enmap')
const {
  defaultSettings,
  defaultPlugins
} = require('../src/data/config.js'),
  humanize = require('humanize-duration'),
  AutomodClient = require('../src/struct/AutomodClient')
  client = require('../bot12')

let cooldowns = client.cooldowns

module.exports = async (client, message) => {
  const automod = new AutomodClient(message, client)

  if (message.author.bot) return
  if (!message.guild || message.channel.type === "dm") return

  client.guildData.ensure(message.guild.id, defaultSettings)
  client.plugins.ensure(message.guild.id, defaultPlugins)
  client.userProfiles.ensure(message.author.id, {
    balance: 0,
    premium: false,
    daily: 0
  })
  client.disabled.ensure("commands", {
    guild: {},
    global: []
  })


  const prefix = client.guildData.has(message.guild.id, "prefix") ? client.guildData.get(message.guild.id, "prefix") : client.config.defaultSettings.prefix
  if (await client.resolveUser(message.content.split(" ")[0].id) === client.user.id) message.channel.send(
    new Discord.MessageEmbed()
    .setDescription("👋 **Hello " + message.author.toString() + ", my prefix is `" + prefix + '`. \nUse the command `help` for all of my commands!**')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setColor(client.colors.sky)
  )
  
  automod.init() // Initiate automod client

  let args = message.content.trim().slice(prefix.length).trim().split(/ +/g)
  let commandName = args.shift().toLowerCase()
  
  if (!message.content.startsWith(prefix)) return;

  let command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName))

  if (!command) return;

  if (command.category.toLowerCase() === "developer" && !client.config.owners.includes(message.author.id)) return

  if (client.plugins.get(message.guild.id, "deletemodcmds")) {
    if (command.category.toLowerCase() === "administrator") message.delete()
  }

  let guildCmd = client.disabled.get("commands", "guild")
  if (guildCmd[message.guild.id] && guildCmd[message.guild.id].includes(command.name)) return message.channel.send(`${client.emoji.bot.disabled} **This command is disabled for this guild**`)

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
      if(!client.config.owners.includes(message.author.id)) {
        const timeLeft = (expirationTime - now);

        return message.channel.send(client.baseEmbed(message, {
          title: "You are on a cooldown!",
          description: `You can only use this command in **${humanize(timeLeft, {conjunction: " and ", serialComma: false})}** `,
          color: client.colors.red
        }))
      } 
    }
  }

  timestamps.set(message.author.id, now);
  cooldowns.set(command.name, timestamps)

  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  let data = client.guildData.get(message.guild.id)

  try {
    let msg = await command.execute(message, args, client, data) // ALL COMMANDS MUST RETURN A PROMISE
    if(command.ignore) return;

    client.logger.cmd(`${message.author.username} used the command ${command.name}`)
    let r = await msg.react('🗑️').catch(() => {})
    try {
      let react = await r.message.awaitReactions((reaction, user) => reaction.emoji.name === "🗑️" && user.id === message.author.id, {
        time: 10 * 60 * 1000,
        max: 1,
        errors: ['time']
      })
      if (react.first().emoji.name === '🗑️') msg.delete()
      client.logger.cmd(`${message.author.username} deleted the command usage ${command.name}`)
    } catch (e) {
      if(msg.embeds.length) {
        let embed = msg.embeds[0]
        embed.color = ""
        return msg.edit("This message is inactive", embed)
      } else {
        return msg.edit("This message is inactive\n\n" + msg.content)
      }
    }


  } catch (e) {
    console.log(e.stack)
    message.error(e)
  }

}

