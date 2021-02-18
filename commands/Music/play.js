
const { Player, GetRegxp, Linker, Objector } = require("../../helpers/music.js")
const Discord = require("discord.js"),
  Sr = require("youtube-sr").default,
  syt = require("scrape-yt"),
  pl = require("ytpl"),
  Ytdl = require("discord-ytdl-core")


module.exports = {
  name: 'play',
  description: 'Play music into the connected voice channel',
  usage: 'play <youtube link | youtube id | youtube playlist | query>',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    const Channel = message.member.voice.channel;
    if (!Channel)
      return client.error(message, "Please join a voice channel to continue")
    if (!args[0])
      return client.missingArgs(message, "Please provide a Youtube Video (Link - ID) , Youtube Playlist (Link - ID) (Songs Limit: 50), or Query")

    if (!Channel.joinable || !Channel.speakable) return client.error(message, "I can't join/speak (in) the voice channel")

    const YtID = await GetRegxp("YtID"),
      YtUrl = await GetRegxp("YtUrl"),
      YtPlID = await GetRegxp("YtPlID"),
      YtPlUrl = await GetRegxp("YtPlUrl"),
      Base = await Linker("Base");
    let Song = null,
      SongInfo = null,
      Playlist = null;
    const ServerQueue = await client.queue.get(message.guild.id);

    if (YtID.test(args[0])) {
      try {
        const Link = await Linker(args[0]), Info = await Ytdl.getInfo(Link);
        SongInfo = Info.videoDetails;
        if (SongInfo.isLiveContent) return client.error(message, "Live videos are not supported")
        Song = await Objector(SongInfo, message);
      } catch (error) {
        console.log(error);
        return client.error(message, "No youtube video found with this video ID")
      }
    } else if (YtUrl.test(args[0]) && !args[0].toLowerCase().includes("list")) {
      try {
        const Info = await Ytdl.getInfo(args[0]);
        SongInfo = Info.videoDetails;
        if (SongInfo.isLiveContent) return client.error(message, "Live videos are not supported")
        Song = await Objector(SongInfo, message);
      } catch (error) {
        console.log(error);
        return client.error(message, "No youtube video found with this link")
      }
    } else if (
      YtPlID.test(args[0]) &&
      !args[0].toLowerCase().startsWith("http")
    ) {
      try {
        const Info = await pl(args[0]);
        if (Info.items.length < 1 || Info.items.length > 50) return client.error(message, "There are no songs or over 50 songs in this playlist")
        const YtInfo = await Ytdl.getInfo(
          `https://www.youtube.com/watch?v=${Info.items[0].id}`
        );
        SongInfo = YtInfo.videoDetails;
        if (SongInfo.isLiveContent) return client.error(message, "Live videos are not supported")
        Song = await Objector(SongInfo, message);
        const Arr = [];
        for (const Video of Info.items) {
          const Infor = await Ytdl.getInfo(
            `https://www.youtube.com/watch?v=${Video.id}`
          );
          const Detail = Infor.videoDetails;
          await Arr.push(await Objector(Detail, message));
        }
        Playlist = {
          Yes: true,
          Data: Arr,
          More: Info
        };
      } catch (error) {
        console.log(error);
        return client.error(message, "Multiple valid errors: Either no playlist found, playlist has 50+ songs, or playlist has private or no videos found")
      }
    } else if (YtPlUrl.test(args[0])) {
      try {
        const ID = await pl.getPlaylistID(args[0]), Info = await pl(ID);
        if (Info.items.length < 1 || Info.items.length > 50) return client.error(message, "There are no songs or over 50 songs in this playlist")
        const YtInfo = await Ytdl.getInfo(
          `https://www.youtube.com/watch?v=${Info.items[0].id}`
        );
        SongInfo = YtInfo.videoDetails;
        if (SongInfo.isLiveContent) return client.error(message, "Live videos are not supported")
        Song = await Objector(SongInfo, message);
        const Arr = [];
        for (const Video of Info.items) {
          const Infor = await Ytdl.getInfo(
            `https://www.youtube.com/watch?v=${Video.id}`
          );
          const Detail = Infor.videoDetails;
          await Arr.push(await Objector(Detail, message));
        }
        Playlist = {
          Yes: true,
          Data: Arr,
          More: Info
        };
      } catch (error) {
        console.log(error);
        return client.error(message, "Multiple valid errors: Either no playlist found, playlist has 50+ songs, or playlist has private or no videos found")

      }
    } else {
      try {
        await Sr.searchOne(args.join(" ")).then(async Info => {
          const YtInfo = await Ytdl.getInfo(`https://www.youtube.com/watch?v=${Info.id}`);
          SongInfo = YtInfo.videoDetails;
          if (SongInfo.isLiveContent) return client.error(message, "Live videos are not supported")
          Song = await Objector(SongInfo, message);
        });
      } catch (error) {
        console.log(error);
        return client.error(message, "No video found with this query")
      };
    };

    let Joined;
    try {
      Joined = await Channel.join();
      await Joined.voice.setSelfDeaf(true);
    } catch (error) {
      console.log(error);
      return client.error(message, "I can't join the voice channel!")
    };

    if (ServerQueue) {
      if (Playlist && Playlist.Yes) {
        const Embed = new Discord.MessageEmbed()
          .setColor(client.colors.green)
          .setTitle("Playlist Added!")
          .setThumbnail(Playlist.More.bestThumbnail.url)
          .setDescription(
            `[${Playlist.More.title}](${Playlist.More.url}) (${Playlist.More.estimatedItemCount === 100 ? "100 (Limit)" : Playlist.More.estimatedItemCount}) Has Been Added To Queue!`
          )
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setFooter(client.user.username, client.user.displayAvatarURL())
        await Playlist.Data.forEach(async Video => {
          try {
            await ServerQueue.Songs.push(Video);
          } catch (error) {
            await Channel.leave().catch(() => { });
            return client.error(message, "Client internal error")
          }
        });
        return message.channel
          .send(Embed)

      } else {
        const Embed = new Discord.MessageEmbed()
          .setColor(client.colors.green)
          .setTitle("Song Added!")
          .setThumbnail(Song.Thumbnail)
          .setDescription(
            `[${Song.Title}](${Song.Link}) has been added to the queue!`
          )
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setFooter(client.user.username, client.user.displayAvatarURL())
        await ServerQueue.Songs.push(Song);
        return message.channel
          .send(Embed)

      }
    }

    const Database = {
      TextChannel: message.channel,
      VoiceChannel: Channel,
      Steam: null,
      Bot: Joined,
      Songs: [],
      Filters: {},
      Volume: 100,
      Loop: false,
      Always: false,
      Playing: true
    };

    await client.queue.set(message.guild.id, Database);

    if (Playlist && Playlist.Yes) {
      await Playlist.Data.forEach(ele => Database.Songs.push(ele));
    } else {
      await Database.Songs.push(Song);
    };

    try {
      await Player(message, Discord, client, Ytdl, { Play: Database.Songs[0], Color: client.colors.green });
    } catch (error) {
      console.log(error);
      await client.queue.delete(message.guild.id);
      await Channel.leave()
      return client.error(message, "Client internal error")
    }
  }
}