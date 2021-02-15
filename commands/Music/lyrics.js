
const { Player } = require("../../Modules/music.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core")

const Finder = require('lyrics-finder')
module.exports = {
  name: 'lyrics',
  description: 'Show the lyrics for the current song',
  usage: 'lyrics',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  args: false,
  premium: false,
  guildOnly: false,
  async execute(message, args, client) {

    const Queue = client.queue.get(message.guild.id);

    if (!Queue && !args[0]) return client.missingArgs(message, "Please provide a song")

    let Lyric, Thing = Queue ? Queue.Songs[0].Title : args.join(" ");

    try {
      Lyric = await Finder(Thing, '');
      if (!Lyric) {
        if (Queue && args[0]) {
          Lyric = await Finder(args.join(" "), '');
        } else {
          return client.error(message, "No lyrics found - " + Thing)
        };
      };
    } catch (error) {
      return client.error(message, "No lyrics found - " + Thing);
    };

    Lyric = await Lyric.replace(/(.{2021})/g, "\n1\n");

    const Embed = new Discord.MessageEmbed(), Embed2 = new Discord.MessageEmbed(), Embed3 = new Discord.MessageEmbed(), Embed4 = new Discord.MessageEmbed(), Embed5 = new Discord.MessageEmbed();
    Embed.setColor(client.colors.green), Embed.setTitle(Thing + " Lyrics!");
    Embed3.setColor(client.colors.green), Embed2.setColor(client.colors.green), Embed4.setColor(client.colors.green), Embed5.setColor(client.colors.green);

    if (Lyric.length <= 2021) {
      Embed.setDescription(Lyric);
      Embed.setAuthor(message.author.tag, message.author.displayAvatarURL()).setFooter(client.user.username, client.user.displayAvatarURL());
      return message.channel.send(Embed);
    };

    if (Lyric.length > 2021 && Lyric.length < 4042) {
      Embed.setDescription(Lyric.slice(0, 2021)), Embed2.setDescription(Lyric.slice(2021, -1)), Embed2.setFooter(client.user.username, client.user.displayAvatarURL());
      await message.channel.send(Embed);
      return message.channel.send(Embed2);
    };

    if (Lyric.length > 4042 && Lyric.length < 6063) {
      Embed.setDescription(Lyric.slice(0, 2021)), Embed2.setDescription(Lyric.slice(2021, 4042)), Embed3.setDescription(4042, -1), Embed3.setFooter(client.user.username, client.user.displayAvatarURL());
      await message.channel.send(Embed), await message.channel.send(Embed2);
      return message.channel.send(Embed3);
    };

    if (Lyric.length > 6063 && Lyric.length < 8084) {
      Embed.setDescription(Lyric.slice(0, 2021)), Embed2.setDescription(Lyric.slice(2021, 4042)), Embed3.setDescription(Lyric.slice(4042, 6063)), Embed4.setDescription(Lyric.slice(6063, -1)), Embed4.setAuthor(message.author.tag, message.author.displayAvatarURL()).setFooter(client.user.username, client.user.displayAvatarURL());
      await message.channel.send(Embed), await message.channel.send(Embed2), await message.channel.send(Embed3);
      return message.channel.send(Embed4);
    };

    if (Lyric.length > 8084 && Lyric.length < 10105) {
      Embed.setDescription(Lyric.slice(0, 2021)), Embed2.setDescription(Lyric.slice(2021, 4042)), Embed3.setDescription(Lyric.slice(4042, 6063)), Embed4.setDescription(Lyric.slice(6063, 8084)), Embed5.setDescription(Lyric.slice(8084, 10105)), Embed5.setAuthor(message.author.tag, message.author.displayAvatarURL()).setFooter(client.user.username, client.user.displayAvatarURL());
      await message.channel.send(Embed), await message.channel.send(Embed2), await message.channel.send(Embed3), await message.channel.send(Embed4);
      return message.channel.send(Embed5);
    };

    return client.error(message, `${Thing}'s lyrics are over 10105 characters!`);
  }
}