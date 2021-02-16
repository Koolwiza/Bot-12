
const { Objector, GetRegxp, Linker } = require("../../Modules/music.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core")


module.exports = {
  name: 'songinfo',
  description: 'Gives detailed information about a song',
  usage: 'songinfo <video>',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client) {
    const Value = args.join(" "),
      Queue = client.queue.get(message.guild.id);
    let Song, SongInfo, Type, Link;

    const YtID = await GetRegxp("YtID"),
      YtUrl = await GetRegxp("YtUrl");

    if (!Value)
      return client.missingArgs(message, "Please provide a valid video. ID, Link, or Name")

    try {
      if (YtID.test(Value)) {
        Link = await Linker(Value);
        console.log(Link);
      } else if (YtUrl.test(Value)) {
        Link = Value;
      } else {
        await Sr.searchOne(Value).then(async Info => {
          Link = `https://www.youtube.com/watch?v=${Info.id}`;
        });
      }
    } catch (error) {
      console.log(error);
      return client.error(message, "No video found")
    };

    try {
      const YtInfo = await Ytdl.getInfo(Link);
      SongInfo = YtInfo.videoDetails;
      Song = await Objector(SongInfo, message);
    } catch (error) {
      console.log(error);
      return client.error(message, "No video found")
    };

    const Data = `Song - **[${Song.Title}](${Song.Link})**\nCreator - **[${
      Song.Author
      }](${Song.AuthorLink})**\nUpload - **${
      Song.Upload
      }**\nViews - **${Song.Views || 0}**\nDuration - **${Song.Duration ||
      "∞"}**`;

    const Embed = new Discord.MessageEmbed()
      .setColor(client.colors.green)
      .setThumbnail(Song.Thumbnail)
      .setTitle(Song.Title + " Information!")
      .setDescription(Data)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setFooter(client.user.username, client.user.displayAvatarURL())

    return message.channel.send(Embed);
  }
}