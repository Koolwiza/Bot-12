const Discord = require('discord.js'),
    {
        defaultSettings
    } = require('../../src/data/config.js')

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
        if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD) || client.modRole(message, data.guild)) return client.authorPerms(message, ["MANAGE_SERVER"])

        if (!args[0]) return message.args("Please provide a type.\nchannel | message | show")

        let type = args[0].toLowerCase()

        if (type === "channel") {
            let channel = await client.resolveChannel(args[1])
            if (!channel) return message.args("Invalid channel provided/no channel provided")

            client.guildData.set(message.guild.id, channel.id, "joinchannel")

            return message.sendE("Success", `Redirected join messages to ${channel.toString()}`)

        } else if (type === "message") {
            let msg = args.slice(1).join(" ")

            if (!msg) return message.args("Please provide a join message")

            client.guildData.set(message.guild.id, msg, "joinmessage")

            return message.sendE("Success", "Changed join message to ```" + msg + "```", client.colors.green)
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
            return message.channel.send(embed)
        }
    }
}