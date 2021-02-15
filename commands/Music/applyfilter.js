
const { Player } = require("../../Modules/music.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core")

module.exports = {
  name: 'applyfilter',
  description: 'Apply a filter to the music',
  usage: 'applyfilter <filter>',
  aliases: ['filter'],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  execute: async (message, args, client) => {
    const Channel = message.member.voice.channel;

    if (!Channel) return client.error(message, "Please join a voice channel to continue")

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue)
      return client.error(message, "There are no songs in the queue")

    let Filter = args[0];

    const Filters = ["nightcore", "bassboost", "vaporwave", "phaser", "treble", "normalizer", "flanger"];

    if (!Filter) return client.missingArgs(message, Filters.map(fil => fil.charAt(0).toUpperCase() + fil.slice(1)).join(", "))

    if (!Filters.find(Fil => Fil === Filter.toLowerCase())) return message.channel.send("No Filter Found - " + Filter.charAt(0).toUpperCase() + Filter.slice(1));

    Filter = Filter.toLowerCase();

    Queue.Filters[Filter] = await Queue.Filters[Filter] ? false : true;

    await Player(message, Discord, client, Ytdl, { Filter: true, Play: Queue.Songs[0], Color: client.colors.green });

    return message.channel.send(client.baseEmbed(message, {
      title: "Success",
      description: `🎶 ${Filter.charAt(0).toUpperCase() + Filter.slice(1)} Has Been ${Queue.Filters[Filter] ? "Disabled" : "Enabled"}`,
      color: client.colors.green
    }))
  }
};