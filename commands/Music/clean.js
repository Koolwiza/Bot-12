
const { Player } = require("../../helpers/music.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core")

module.exports = {
  name: 'clean',
  description: 'Clean the queue of the bot for the server, improves music quality!',
  usage: 'clean',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    const Channel = message.member.voice.channel;

    if (!Channel) return client.error(message, "Please join a voice channel to continue")

    const Queue = await client.queue.get(message.guild.id)
    const All = Queue
    let Joined

    if (!Queue)
      return client.error(message, "There are no songs in the queue")


    await message.guild.me.voice.kick(), await client.queue.delete(message.guild.id);

    setTimeout(async () => {
      try {
        Joined = await Channel.join();
        All["Bot"] = Joined;
      } catch (error) {
        console.log(error);
        return client.error(message, "Cannot join your voice channel")
      };
      await client.queue.set(message.guild.id, All);
      await Player(message, Discord, client, Ytdl, { Play: All.Songs[0], Color: client.colors.green });
      const Embed = new Discord.MessageEmbed()
        .setColor(client.colors.green)
        .setTitle("Success")
        .setDescription("🎶 Music has been cleaned!")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setFooter(client.user.username, client.user.displayAvatarURL())

      return message.channel.send(Embed)
    }, 1500);
  }
}