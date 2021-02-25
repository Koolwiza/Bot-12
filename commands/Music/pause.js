
const { Player } = require("../../helpers/music.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core")



module.exports = {
  name: 'pause',
  description: 'Pause the current playing music',
  usage: 'pause',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    
    const Channel = message.member.voice.channel;

    if (!Channel) return message.error("Please join a voice channel to continue")

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue)
      return message.error("There are no songs in the queue")
   
   
    if (!Queue.Playing) return message.error("Music already paused")
    
    Queue.Playing = false;
    Queue.Bot.dispatcher.pause();
    
    return message.channel.send(client.baseEmbed(message, {
      title: "Success",
      description: "Music paused",
      color: client.colors.green
    })).catch(() => message.channel.send(client.baseEmbed(message, {
      title: "Success",
      description: "Music paused",
      color: client.colors.green
    })));
 
  }
}