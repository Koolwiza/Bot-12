
const { Player, Objector } = require("../../helpers/music.js");
const Discord = require("discord.js");
Sr = require("youtube-sr").default,
  Ytdl = require("discord-ytdl-core");

module.exports = {
  name: 'search',
  description: 'Search for a video with details',
  usage: 'search <video>',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    const Channel = message.member.voice.channel;

    if (!Channel) return message.error("Please join a voice channel to continue")
    if (!args[0]) return message.args("Please provide a query")

    const Queue = await client.queue.get(message.guild.id);

    if (
      !Channel.permissionsFor(message.guild.me).has("CONNECT") ||
      !Channel.permissionsFor(message.guild.me).has("SPEAK")
    )
      return client.clientPerms(message, ['CONNECT', 'SPEAK'])

    if (!Channel.joinable)
      return client.clientPerms(message, "I can't join the voice channel")

    await Sr.search(args.join(" "), { limit: 10 }).then(async Data => {
      if (!Data[0].id)
        return message.error("No video found")
      const All = await Data.map(
        (Video, Position) =>
          `${Position + 1}. **[${
          Video.title.length > 100 ? Video.title + "..." : Video.title
          }](https://youtube.com/watch?v=${Video.id})**`
      ),
        Filter = m => m.author.id === message.author.id;

      const Embed = new Discord.MessageEmbed()
        .setColor(client.colors.green)
        .setTitle("Please Choose")
        .setDescription(All + "\nPlease select between 1 - 10, Time: 5 Minutes")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setFooter(client.user.username, client.user.displayAvatarURL())

      message.channel
        .send(Embed)


      await message.channel
        .awaitMessages(Filter, { max: 1, time: 300000, errors: ["time"] })
        .then(async Msg => {
          let Content = parseInt(Msg.first().content),
            SongInfo = null,
            Song = null;
          Msg = Msg.first();
          if (isNaN(Content))
            return message.error("Invalid number provided")
          if (Content - 1 > All.length || !All[Content])
            return message.error("Invalid number provided")

          try {
            const Find = await Data.find(Dat => Dat === Data[Content - 1]);
            console.log(Find);
            const YtInfo = await Ytdl.getInfo(
              `https://youtube.com/watch?v=${Find.id}`
            );
            SongInfo = YtInfo.videoDetails;
            Song = await Objector(SongInfo, message);
          } catch (error) {
            console.log(error);
            return message.error("Unknown error, please try again")
          }

          let Joined;
          try {
            Joined = await Channel.join();
            await Joined.voice.setSelfDeaf(true);
          } catch (error) {
            console.log(error);
            return client.clientPerms(message, "Cannot join the voice channel")
          }

          if (Queue) {
            const Embed = new Discord.MessageEmbed()
              .setColor(client.colors.green)
              .setTitle("Song Added!")
              .setThumbnail(Song.Thumbnail)
              .setDescription(
                `[${Song.Title}](${Song.Link}) Has Been Added To Queue!`
              )
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setFooter(client.user.username, client.user.displayAvatarURL())

            await Queue.Songs.push(Song);
            return message.channel
              .send(Embed)
              
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

          await Database.Songs.push(Song);

          try {
            await Player(
              message,
              Discord,
              client,
              Ytdl,
              {
                Play: Database.Songs[0],
                Color: client.colors.green
              }
            );
          } catch (error) {
            console.log(error);
            await client.queue.delete(message.guild.id);
            await Channel.leave().catch(() => { });
            return message.error("Client internal error")
          }
        });
    });
  }
}