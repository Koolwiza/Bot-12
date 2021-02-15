
const { Player } = require("../../Modules/music.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core")


module.exports = {
  name: 'resume',
  description: 'If the music was paused earlier, resume it again',
  usage: '',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  args: false,
  premium: false,
  guildOnly: false,
  async execute(message, args, client) {
    const Channel = message.member.voice.channel;

    if (!Channel) return client.error(message, "Please join a voice channel to continue")

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue)
      return client.error(message, "There are no songs in the queue")

    if (Queue.Playing) return client.error(message, "🎶 Music is already playing");

    Queue.Playing = true;
    Queue.Bot.dispatcher.resume();

    const Embed = new Discord.MessageEmbed()
      .setColor(client.colors.green)
      .setTitle("Success")
      .setDescription("🎶 Music has been resumed!")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setFooter(client.user.username, client.user.displayAvatarURL())

    return message.channel.send(Embed)

  }
}