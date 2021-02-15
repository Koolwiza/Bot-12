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
    args: false,
    premium: false,
    guildOnly: false,
    async execute(message, args, client) {

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
                .setFooter(message.client.user.username, message.client.user.avatarURL())
                .setTitle(`${message.client.user.username} Bot Help`)
                
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
        let data = []
        data.push(`**Name:** ${command.name}`);

        if (command.aliases && command.aliases.length !== 0) data.push(`**Aliases:** ${command.aliases.join(", ")}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.required && command.required.length !== 0) data.push(`**Bot Permissions:** \`${command.required.join("`, `")}\``)
        if (command.user && command.user.length !== 0) data.push(`**User Permissions:** \`${command.user.join("`, `")}\``)
        if (command.usage) data.push(`**Usage:** \`${PREFIX}${command.usage}\``);
        if (command.premium) data.push(`**Premium:** ${command.premium}`)

        let helpEmbed = new Discord.MessageEmbed()
            .setTitle(":books: Command Help")
            .setDescription(data.join('\n'))
            .setColor(client.colors.sky)
            .setFooter(message.client.user.username, message.client.user.avatarURL())
            .addField('\u200b', '[Invite Me](https://discord.com/oauth2/authorize?client_id=800549820485599272&scope=bot&permissions=2080768255) ● Support Server coming Soon')
        message.channel.send(helpEmbed)
    }
}