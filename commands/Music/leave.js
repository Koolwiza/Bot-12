
const { Player } = require("../../Modules/music.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core")


module.exports = {
  name: 'leave',
  description: 'Leave the voice channel the bot is in',
  usage: 'leave',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client) {

    const Channel = message.member.voice.channel;

    if (!Channel) return client.error(message, "Please join a voice channel to continue")

    if (!message.guild.me.voice) return client.error(message, "I'm not in any voice channel")

    try {

      await message.guild.me.voice.kick(client.user.id);

    } catch (error) {
      await message.guild.me.voice.kick(message.guild.me.id);
    };

    const Embed = new Discord.MessageEmbed()
      .setColor(client.colors.green)
      .setTitle("Success")
      .setDescription("🎶 Left the voice channel")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setFooter(client.user.username, client.user.displayAvatarURL())

    return message.channel.send(Embed)

  }
}