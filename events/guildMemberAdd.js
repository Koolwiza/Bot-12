const chalk = require('chalk')
const { defaultPlugins, defaultSettings } = require('../data/config.json')
const Discord = require('discord.js')

module.exports = async (client, member) => {

  client.plugins.ensure(member.guild.id, defaultPlugins)
  client.guildData.ensure(member.guild.id, defaultSettings)

  let plugins = client.plugins
  let data = client.guildData

  if (plugins.get(member.guild.id, "antibots")) {
    member.guild.fetchAuditLogs({
      limit: 1,
      type: 28
    }).then(async audit => {
      let a = audit.entries.first()
      let user = a.executor
      let bot = a.target

      let m = await member.guild.members.fetch(user.id)
      if (m.roles.cache.has(data.get(member.guild.id, "modrole"))) return;

      let owner = await member.guild.members.fetch(member.guild.ownerID)
      let mem = await member.guild.members.fetch(bot.id)

      await mem.kick("Added bot without consent")
      await owner.send(
        new Discord.MessageEmbed()
          .setTitle(":warning: Bot added")
          .setDescription(`${user.toString()} has added the bot ${bot.toString()} to your server. This user does not have the modrole. The bot has been kicked `)
          .setColor(client.colors.red)
          .setFooter(client.user.username, client.user.displayAvatarURL())
      )
    })

  }
}