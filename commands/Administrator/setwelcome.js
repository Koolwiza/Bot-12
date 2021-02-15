const Discord = require('discord.js'),
    {
        defaultSettings
    } = require('../../data/config.json')

module.exports = {
    name: 'setwelcome',
    description: 'Set the welcome channel/message for the server',
    usage: 'setwelcome <type> [value]',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],
    args: false,
    premium: false,
    guildOnly: false,
    async execute(message, args, client) {
        let type = args[0].toLowerCase()

        if (type === "channel") {
            let channel = client.resolveChannel(args[1])
            if (!channel) return client.missingArgs(message, "Invalid channel provided/no channel provided")

            client.guildData.set(message.guild.id, channel.id, "joinchannel")

            return message.channel.send(client.baseEmbed(message, {
                title: "Success",
                description: "Redirected join messages to " + channel.toString(),
                color: client.colors.green
            }))

        } else if (type === "message") {
            let message = args.slice(1).join(" ")

            if (!message) return client.missingArgs(message, "Please provide a join message")

            client.guildData.set(message.guild.id, message, "joinmessage")

            return message.channel.send(client.baseEmbed(message, {
                title: "Success",
                description: "Changed join message to ```" + message + "```",
                color: client.colors.green
            }))
        } else if (type === "show") {
            let variables = ""

            variables += ` > **Members**
            > \`{member:name}\` - The member's name
            > \`{member:mention\`
            > \`{member:tag}\`
            > \`{member:id}\` - The member's id
            > \`{member:createdAt}\` - When the member created his/her account
            > \`{server:name}\` - The server's name
            > \`{server:members}\` - The server's members`

            let g = await message.guild.members.fetch()

            let finJoinMsg = client.guildData.get(message.guild.id).joinmessage
            .replace(/{member:mention}/g, `<@${message.author.id}>`)
            .replace(/{member:name}/g, `${message.author.username}`)
            .replace(/{member:id}/g, `${message.author.id}`)
            .replace(/{member:tag}/g, `${message.author.tag}`)
            .replace(/{member:createdAt}/g, `${message.author.createdAt}`)
            .replace(/{server:name}/g, `${message.guild.name}`)
            .replace(/{server:members}/g, `${g.size}`)

            let embed = new Discord.MessageEmbed()
                .setTitle("Welcome settings for " + message.guild.name)
                .setDescription(variables)
                .addField("Default Value", defaultSettings.joinmessage)
                .addField("Current Value", client.guildData.get(message.guild.id).joinmessage)
                .addField("Example", finJoinMsg)
            message.channel.send(embed)
        }
    }
}