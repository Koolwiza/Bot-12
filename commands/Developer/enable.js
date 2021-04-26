const {
  pullAt
} = require('lodash')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
  name: 'enable',
  description: 'Enable a command in either guild or globally',
  usage: 'enable <command> [guildID]',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],

  premium: false,
  
  /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {

    let command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]))

    if (!command) return message.error("Please provide a command")
    message.channel.send(`${client.emoji.misc.check} **Enable command globally or guild only?**
      Please reply using \`globally\` or \`guild\``)

    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id)

    collector.on('collect', async msg => {
      if (msg.content.toLowerCase() === "globally") {
        if (!client.disabled.get("commands", "global").includes(command.name)) return message.error("This command is not disabled")

        client.disabled.remove("commands", (value) => value.command === command.name)
        collector.stop()
        return message.channel.send(`${client.emoji.misc.check} **\`${command.name}\` has been enabled globally.** \nNo guilds will be able to use this command now `)

      } else if (msg.content.toLowerCase() === "guild") {
        collector.stop()
        let a = await message.channel.send(`${client.emoji.misc.check} **Please provide a guild id to enable \`${command.name}\` in**`)

        let b = await a.channel.awaitMessages(m => m.author.id === message.author.id, {
          time: 60 * 1000,
          max: 1,
          errors: ['time']
        })

        let guildI = b.first().content
        if (!client.guilds.cache.get(guildI)) return message.error("Invalid guild ID provided")

        let cmd = client.disabled.get("commands", "guild")

        if (!cmd[guildI].includes(command.name)) return message.error('This command isn\'t disabled')

        let c = pullAt(cmd[guildI], command.name)
        client.disabled.set("commands", c, `guild.${guildI}`)

        await message.channel.send(`${client.emoji.misc.check} **\`${command.name}\` enabled in ${client.guilds.cache.get(guildI).name}**`)

      } else if (msg.content.toLowerCase() === "stop" || msg.content.toLowerCase() === "cancel") {
        collector.stop()
        return message.channel.send(`${client.emoji.misc.xmark} **Collector stopped, no changes made**`)

      }
    })
  }
}