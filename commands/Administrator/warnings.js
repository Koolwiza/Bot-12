const Discord = require('discord.js')
const moment = require('moment')

module.exports = {
  name: 'warnings',
  description: 'Display a user\'s warnings',
  usage: 'warnings <user>',
  aliases: [],
  required: ['MANAGE_GUILD'],
  user: ['MANAGE_GUILD'],
  category: __dirname.split("commands\\")[1],

  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    if (!message.member.permissions.has("MANAGE_GUILD")) return client.authorPerms(message, ["MANAGE_SERVER"])


    let user = await client.resolveUser(args[0])
    if (!user) return client.missingArgs(message, "Missing user for warnings")

    let a = client.modActions.filter(c => (c.type === "warning") && (c.user === user.id) && (c.guild === message.guild.id))

    let b = (await Promise.all(a.map(async (value, key) =>
      `**ID: ${key} | ${(await client.users.fetch(value.moderator)).tag}**\n${value.reason} - ${moment(value.when).format('lll') } `))).join("\n\n")


    let embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setFooter(client.user.username, client.user.displayAvatarURL())
      .setTitle(`${user.tag}(${user.id}) Warnings`)
      .setDescription(b)
      .setColor(client.colors.sky)

    /*a.forEach(e => {
      embed.addField(`ID: ${e.id} | Mmoderator: `)
    })*/

    message.channel.send(embed)
  }
}