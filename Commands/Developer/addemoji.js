const Discord = require('discord.js')
const {
    parse
} = require("twemoji-parser");
const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: 'addemoji',
    description: 'Adds the emoji to the server',
    usage: 'addemoji <emoji> [name]',
    aliases: [],
    category: __dirname.split("commands\\")[1],
    required: ['SEND_MESSAGES'],
    user: ['SEND_MESSAGES', 'MANAGE_EMOJIS'],
    args: true,
    premium: false,
    guildOnly: true,
    cooldown: 10,
    async execute(message, args) {
        if(!client.config.owners.includes(message.author.id))
        if (!message.guild.me.hasPermission("MANAGE_EMOJIS")){
            return client.noPerms(message, ['MANAGE_EMOJIS'])
        }

        const emoji = args[0];
        if (!emoji) return client.missingArgs(message, "Please give me an emoji to add")

        let customemoji = Discord.Util.parseEmoji(emoji);

        if (customemoji.id) {
            const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${
              customemoji.animated ? "gif" : "png"
            }`;
            const name = args.slice(1).join(" ");
            message.guild.emojis.create(
                `${Link}`,
                `${name || `${customemoji.name}`}`
            ).catch(error => {
                client.logger.log("There was an error adding an emoji\n" + error, "error")
            })
            const Added = new MessageEmbed()
                .setTitle(`Emoji Added`)
                .setColor(`${client.colors.green}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setDescription(
                    `**Emoji Has Been Added!** | **Name:** \`${name || `${customemoji.name}`}\` | **Preview:** [Click Me](${Link})`
                )
                .setFooter(message.client.user.username, message.client.user.displayAvatarURL())
            return message.channel.send(Added).catch(e => {
                client.logger.log("There wasn an error sending the confirm add emoji\n" + e, "error")
            })
        } else {
            let CheckEmoji = parse(emoji, {
                assetType: "png"
            });
            if (!CheckEmoji[0])
                return client.error(message, "Please give me a valid emoji")
            message.channel.send(client.baseEmbed(message, {description: "You can use normal emojis without adding it to any server", color: client.colors.sky}))
        }
    }
};