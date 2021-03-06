const Discord = require('discord.js'),
    ms = require('ms')

module.exports = {
    name: 'snipe',
    description: 'Check for deleted messages 👀',
    usage: 'snipe',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        let snip = client.snipes.get(message.guild.id)
        if (!snip) return message.error("There are no snipes in this server")

        let embed = new Discord.MessageEmbed()
            .setTitle(message.guild.name + " Snipe")
            .setColor("RANDOM")
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setAuthor(snip.author.tag, snip.author.displayAvatarURL())
            .setTimestamp(snip.time)

        let urlReg = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/ig


        if (urlReg.test(snip.content)) {
            embed.setImage(snip.content)

        } else {
            embed.setDescription(snip.content)
        }

        return message.channel.send(embed)
    }
}