
const { Player } = require("../../Modules/music.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core")


module.exports = {
  name: 'queue',
  description: 'View the current queue in the server',
  usage: 'queue',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    const Channel = message.member.voice.channel;

    if (!Channel) return client.error(message, "Please join a voice channel to continue")

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue || !Queue.Songs)
      return client.error(message, "There are no songs in the queue")
    
    const Sort = await Queue.Songs.map((Song, Position) => `${(Position + 1) === 1 ? "Now Playing" : (Position - 1) === 0 ? 1 : (Position)} | ${Song.Title.length > 60 ? Song.Title.slice(0, 60) + "..." : Song.Title}`).join("\n");
    
    if (!Sort) return client.error(message, "There are no songs in the queue")

    return message.channel.send(client.baseEmbed(message, {
      title: "Queue for " + message.guild.name,
      description: Sort,
      color: client.colors.green
    }))
  }
}