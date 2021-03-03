const Discord = require('discord.js'),
    ms = require('ms'),
    {
        Collection
    } = require('discord.js')

module.exports = {
    name: 'help',
    description: 'Sends you a list of commands',
    usage: 'help [command]',
    aliases: ['commands', 'command'],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],
    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {

        PREFIX = client.guildData.get(message.guild.id, "prefix") ? client.guildData.get(message.guild.id, "prefix") : client.config.defaultSettings.prefix
        let categories = []
        const {
            commands
        } = message.client

        if (!args.length) {

            let noArgEmbed = new Discord.MessageEmbed()
                .setThumbnail(message.guild.iconURL())
                .setDescription(`❯ To get help on a command, use \`${PREFIX}help <command>\`\n\n\`\`\`\n[] - Optional\n<> - Required\n\`\`\`\n`)
                .setColor(client.colors.sky)
                .setAuthor(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setFooter(message.client.user.username, message.client.user.displayAvatarURL())
                .setTitle(`${client.commands.size} Total Commands`)

            commands.forEach(command => {
                if (!categories.includes(command.category)) {
                    if (command.category === "Developer" && !client.config.owners.includes(message.author.id)) {
                        return;
                    }
                    categories.push(command.category)
                }
            })


            await categories.forEach(cat => {
                const tCommands = commands.filter(cmd => cmd.category === cat)
                noArgEmbed.addField(client.emoji.help[cat.toLowerCase()] + ` ${cat} [${tCommands.size}]`, tCommands.map(command => `\`${command.name}\``).join(", "))
            })
            return message.channel.send(noArgEmbed)
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.channel.send({
                embed: {
                    author: {
                        name: message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    color: client.colors.red,
                    description: "I can't find any command named: " + name,
                    footer: {
                        text: message.client.user.username,
                        icon_url: message.client.user.displayAvatarURL()
                    }
                }
            })
        }
        let msg = ""
        msg += (`**Name:** ${command.name}\n`);

        if (command.aliases && command.aliases.length !== 0) msg += (`**Aliases:** ${command.aliases.join(", ")}\n`);
        if (command.description) msg += (`**Description:** ${command.description}\n`);
        if (command.required && command.required.length !== 0) msg += (`**Bot Permissions:** \`${command.required.join("`, `")}\`\n`)
        if (command.user && command.user.length !== 0) msg += (`**User Permissions:** \`${command.user.join("`, `")}\`\n`)
        if (command.usage) msg += (`**Usage:** \`${PREFIX}${command.usage}\`\n`);
        if (command.premium) msg += (`**Premium:** ${command.premium}\n`)

        let helpEmbed = new Discord.MessageEmbed()
            .setTitle(":books: Command Help")
            .setDescription(msg)
            .setColor(client.colors.sky)
            .setFooter(message.client.user.username, message.client.user.displayAvatarURL())
            .addField('\u200b', '[Invite Me](https://discord.com/oauth2/authorize?client_id=800549820485599272&scope=bot&permissions=2080768255) ● Support Server coming Soon')
return message.channel.send(helpEmbed)
    }
}