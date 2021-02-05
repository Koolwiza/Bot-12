const Discord = require('discord.js'),
  ms = require('ms'),
  enmap = require('enmap')

module.exports = {
  name: 'enable',
  description: 'Enable a command in either guild or globally',
  usage: 'enable <command> [guildID]',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands/")[1],
  args: false,
  premium: false,
  guildOnly: false,
  async execute(message, args, client) {
    if (!client.config.owners.includes(message.author.id)) return

    let command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]))

    message.channel.send(`${client.emoji.misc.check} **Enable command globally or guild only?**
      Please reply using \`globally\` or \`guild\``)

    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id)

    collector.on('collect', async msg => {
      if (msg.content.toLowerCase() === "globally") {
				if(!client.disabled.has("commands", `global.${command.name}`)) return client.error("This command is not disabled")

        client.disabled.remove("commands", command.name)
        message.channel.send(`${client.emoji.bot.disabled} **\`${command.name}\` has been enabled.** \nAll guilds will be able to use this command now `)

        return collector.stop()
      } else if (msg.content.toLowerCase() === "guild") {
        collector.stop()

        let a = await message.channel.send(`${client.emoji.misc.check} **Please provide a guild id to enable \`${command.name}\` in**`)

        let b = await a.channel.awaitMessages(m => m.author.id === message.author.id, {
          time: 60 * 1000,
          max: 1,
          errors: ['time']
        })

        let guildI = b.first().content
        if (!client.guilds.cache.get(guildI)) return client.error(message, "Invalid guild ID provided")

				if(!client.disabled.has("commands", `guild.command.${command.name}`) && client.disabled.get("commands", "guild").some(c => c.guild === message.guild.id))
        client.disabled.remove('commands', (value) => value.command === command.name)

        await message.channel.send(`${client.emoji.bot.disabled} **\`${command.name}\` enabled in ${client.guilds.cache.get(guildI).name}**`)

      }
    })
  }
}