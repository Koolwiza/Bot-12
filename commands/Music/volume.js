
const { Player } = require("../../Modules/music.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core")


module.exports = {
  name: 'volume',
  description: 'Set the volume of the song',
  usage: 'volume <volume>',
  aliases: ['setvolume'],
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

    const Embed = new Discord.MessageEmbed()
      .setColor(client.colors.green)
      .setTitle("Volume")
      .setDescription(`🎶 Volume - ${Queue.Volume}`)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setFooter(client.user.username, client.user.displayAvatarURL())

    if (!args[0]) return message.channel.send(Embed).catch(() => message.channel.send(`🎶 Volume - ${Queue.Volume}`));

    let number = parseInt(args[0])
    if (number) {
      if (isNaN(number))
        return client.error(message, "Please give a valid number")
      if (number > 150) return client.error(message, "Volume limit: 150")
      if (parseInt(Queue.Volume) === number)
        return client.error(message, "Nothing was changed, provided volume was equal to volume")

      Queue.Volume = parseInt(number);
      Queue.Bot.dispatcher.setVolumeLogarithmic(Queue.Volume / 100);

      const Embeded = new Discord.MessageEmbed()
        .setColor(client.colors.green)
        .setTitle("Success")
        .setDescription(`🎶 Volume has been changed - ${Queue.Volume}`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setFooter(client.user.username, client.user.displayAvatarURL())

      return message.channel.send(Embeded)
    };
  }
}