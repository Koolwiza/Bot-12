
const { Player } = require("../../Modules/music.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core")



module.exports = {
  name: 'pause',
  description: 'Pause the current playing music',
  usage: 'pause',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands/")[1],
  args: false,
  premium: false,
  guildOnly: false,
  async execute(message, args, client) {
    
    const Channel = message.member.voice.channel;

    if (!Channel) return client.error(message, "Please join a voice channel to continue")

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue)
      return client.error(message, "There are no songs in the queue")
   
   
    if (!Queue.Playing) return client.error(message, "Music already paused")
    
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