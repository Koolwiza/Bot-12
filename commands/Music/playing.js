
const { Player } = require("../../Modules/music.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core")

module.exports = {
  name: 'playing',
  description: 'View what you\'re playing with progress bar',
  usage: 'playing',
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
    
    let Song, Seconds, Time, Total;
    
    try {

    Song = await Queue.Songs[0],
      Total = Song.Duration,
      Seconds = Song.Seconds,
      Time = parseInt(Queue.Bot.dispatcher.streamTime + Queue.ExtraTime);
      
    } catch (error) {
      return client.error(message, "There are no songs in the queue")
    };

    function FD(duration) {
      let minutes = Math.floor(duration / 60);
      let hours = "";
      if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = hours >= 10 ? hours : "0" + hours;
        minutes = minutes - hours * 60;
        minutes = minutes >= 10 ? minutes : "0" + minutes;
      }
      duration = Math.floor(duration % 60);
      duration = duration >= 10 ? duration : "0" + duration;
      if (hours != "") {
        return hours + ":" + minutes + ":" + duration;
      }
      return minutes + ":" + duration;
    };

    const Sec = Math.round(Time / 1000),
      AllTime = (Seconds * 1000).toFixed(0);
    const Remaining = await FD((Seconds - Sec).toFixed(0));
    const Adder = await FD(Sec);
    const Index = Math.round((Time / AllTime) * 20);
    const Bar = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬".split("");
    let ShowBar;

    if (Index >= 1 && Index <= 20) {
      Bar.splice(Index, 0, "🔵");
      ShowBar = Bar.join("");
    } else {
      ShowBar = "🔵▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    };

    const Data = `Song - **[${Song.Title}](${Song.Link})**\nCreator - **[${
      Song.Author
    }](${Song.AuthorLink})**\nUpload - **${
      Song.Upload
    }**\nViews - **${Song.Views ||
      0}**\nDuration - **${Total}**\nRemaining - **${Remaining}**\n\n`;

    const Embed = new Discord.MessageEmbed()
      .setColor(client.colors.green)
      .setThumbnail(Song.Thumbnail)
      .setTitle("Now Playing!")
      .setDescription(Data + `${ShowBar}\n${Adder}/${Total}`)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setFooter(client.user.username, client.user.displayAvatarURL())

    return message.channel.send(Embed);
  }
}