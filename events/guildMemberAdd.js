const chalk = require('chalk')
const {
  defaultPlugins,
  defaultSettings
} = require('../data/config.json')
const Discord = require('discord.js')

module.exports = async (client, member) => {

  let pd = client.plugins.ensure(member.guild.id, defaultPlugins)
  let gd = client.guildData.ensure(member.guild.id, defaultSettings)

  let plugins = client.plugins
  let data = client.guildData

  if (member.user.bot) {
    if (pdc.antibots) {
      member.guild.fetchAuditLogs({
        limit: 1,
        type: 28
      }).then(async audit => {
        let a = audit.entries.first()
        let user = a.executor
        let bot = a.target

        let m = await member.guild.members.fetch(user.id)
        if (m.roles.cache.has(gd.modrole)) return;

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
  } else if (pd.welcomemessages) {
    let channel = member.guild.channels.cache.get(gd.joinchannel)

    if (channel) {
      let msg = gd.joinmessage
        .replace(/{member:mention}/g, member.toString())
        .replace(/{member:name}/g, `${member.user.username}`)
        .replace(/{member:id}/g, `${member.user.id}`)
        .replace(/{member:tag}/g, `${member.user.tag}`)
        .replace(/{member:createdAt}/g, `${member.user.createdAt}`)
        .replace(/{server:name}/g, `${member.guild.name}`)
        .replace(/{server:members}/g, `${member.guild.memberCount}`)

      channel.send(msg)
    }
  }
}