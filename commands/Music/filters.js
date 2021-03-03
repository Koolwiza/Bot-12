
const { Player } = require("../../helpers/music.js")
const Discord = require("discord.js"), Ytdl = require("discord-ytdl-core")


module.exports = {
  name: 'filters',
  description: 'Show the applied filters to the server',
  usage: 'filters [filter name]',
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


    const Filters = ["nightcore", "bassboost", "vaporwave", "phaser", "treble", "normalizer", "flanger"];
    const One = [];

    await Filters.forEach(async Filter => {
        let Status = await Queue.Filters[Filter] ? "Enabled - ✅" : "Disabled - ❌";
        await One.push(`${Filter.charAt(0).toUpperCase() + Filter.slice(1)} - ${Status}`);
    });

    if (!args[0])
      return message.channel.send(client.baseEmbed(message, {
        title: "Filters",
        description: One.join("\n"),
        color: client.colors.green
      }))

    if (!Filters.find(Fil => Fil === args[0].toLowerCase()))
      return message.channel.send(
        `No Filter Found - ` +
          args[0].charAt(0).toUpperCase() +
          args[0].slice(1)
      );

    args[0] = args[0].toLowerCase();
    
    let Finder = await Filters.find(Fil => Fil === args[0]);

    const Embed = new Discord.MessageEmbed()
      .setColor(client.colors.green)
      .setTitle("Filter Information")
      .addField("Name", Finder.charAt(0).toUpperCase() + Finder.slice(1))
      .addField("Status", Queue.Filters[args[0]] ? "Enabled" : "Disabled")
      .setFooter(client.user.username, client.user.displayAvatarURL())
      .setAuthor(message.author.tag, message.author.displayAvatarURL())

    return message.channel
      .send(Embed)
      
  }
}