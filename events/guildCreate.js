const chalk = require('chalk'),
  Discord = require('discord.js'),
  {
    defaultPlugins,
    defaultSettings
  } = require('../data/config.json')

module.exports = async (client, guild) => {


  client.plugins.ensure(guild.id, defaultPlugins)
  client.guildData.ensure(guild.id, defaultSettings)

  let owner = await guild.members.fetch(guild.ownerID)

  client.logger.log(`${owner.user.username} has added me to ${guild.name}.
  --=GUILD STATISTICS=--
  Channels: ${guild.channels}
  Roles: ${guild.roles}
  Cached members: ${guild.members.cache.size} 
  `)

  owner.send(
    new Discord.MessageEmbed()
    .setTitle("Thank you for adding me")
    .setDescription(`For a list of my commands, use the command \`${client.config.defaultSettings.prefix}help\`. \nTo enable plugins, use the command \`${client.config.defaultSettings.prefix}plugins\`.`)
    .setColor(client.colors.sky)
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setAuthor(owner.user.tag, owner.user.tag)
  )

}