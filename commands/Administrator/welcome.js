const Discord = require('discord.js'),
    {
        defaultSettings
    } = require('../../data/config.json')

module.exports = {
    name: 'welcome',
    description: 'Set the welcome channel/message for the server',
    usage: 'welcome <type> [value]',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        if (!message.member.permissions.has("MANAGE_GUILD") || !message.member.roles.cache.has(data.modrole)) return client.authorPerms(message, ["MANAGE_SERVER"])

        if (!args[0]) return client.missingArgs(message, "Please provide a type.\nchannel | message | show")

        let type = args[0].toLowerCase()

        if (type === "channel") {
            let channel = await client.resolveChannel(args[1])
            if (!channel) return client.missingArgs(message, "Invalid channel provided/no channel provided")

            client.guildData.set(message.guild.id, channel.id, "joinchannel")

            return message.channel.send(client.baseEmbed(message, {
                title: "Success",
                description: "Redirected join messages to " + channel.toString(),
                color: client.colors.green
            }))

        } else if (type === "message") {
            let msg = args.slice(1).join(" ")

            if (!msg) return client.missingArgs(message, "Please provide a join message")

            client.guildData.set(message.guild.id, msg, "joinmessage")

            return message.channel.send(client.baseEmbed(message, {
                title: "Success",
                description: "Changed join message to ```" + msg + "```",
                color: client.colors.green
            }))
        } else if (type === "show") {
            let variables = ""

            variables += ` > **Members**
            > 
            > \`{member:name}\` - The member's name
            > \`{member:mention\`
            > \`{member:tag}\`
            > \`{member:id}\` - The member's id
            > \`{member:createdAt}\` - When the member created his/her account
            > 
            > **Server**
            > \`{server:name}\` - The server's name
            > \`{server:members}\` - The server's members`


            let finJoinMsg = client.guildData.get(message.guild.id).joinmessage
                .replace(/{member:mention}/g, `<@${message.author.id}>`)
                .replace(/{member:name}/g, `${message.author.username}`)
                .replace(/{member:id}/g, `${message.author.id}`)
                .replace(/{member:tag}/g, `${message.author.tag}`)
                .replace(/{member:createdAt}/g, `${message.author.createdAt}`)
                .replace(/{server:name}/g, `${message.guild.name}`)
                .replace(/{server:members}/g, `${message.guild.memberCount}`)

            let embed = new Discord.MessageEmbed()
                .setTitle("Welcome settings for " + message.guild.name)
                .setDescription(variables)
                .addField("Default Value", defaultSettings.joinmessage)
                .addField("Current Value", client.guildData.get(message.guild.id).joinmessage)
                .addField("Example", finJoinMsg)
                .setColor(client.colors.sky)
            message.channel.send(embed)
        }
    }
}