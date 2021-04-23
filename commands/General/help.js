const Discord = require('discord.js'),
    ms = require('ms'),
    {
        Collection
    } = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

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
    ignore: true,
    async execute(message, args, client, data) {
        const {
            commands
        } = client


        PREFIX = client.guildData.get(message.guild.id, "prefix") ? client.guildData.get(message.guild.id, "prefix") : client.config.defaultSettings.prefix
        if (!args.length) {
            let categories = {

            }
            let cat = []


            commands.forEach(c => {
                if (!cat.includes(c.category)) {
                    if (c.category === "Developer" && !client.config.owners.includes(message.author.id)) {
                        return;
                    }
                    cat.push(c.category)
                }
            })

            cat.forEach(cat => {
                let match = /\d+/g
                let emojiID = client.emoji.help[cat.toLowerCase()].match(match)[0]

                let tCmds = commands.filter(cmd => cmd.category === cat)
                categories[emojiID] = tCmds
            })


            let abc = "React with an emoji to see it's following commands!\n\n"
            cat.forEach(element => {
                abc += `${client.emoji.help[element.toLowerCase()]}: **${element}**\n`
            })

            let xmark = client.emoji.misc.xmark.match(/\d+/g)[0]

            abc += `<:help_house:818174483343867964>: **All commands**

            **Additional**:
            <:help_back:818523288686035015>:  **Back to main menu**
            ${client.emoji.misc.xmark}: **Stop menu**
            
            [Invite Me](https://discord.com/oauth2/authorize?client_id=800549820485599272&scope=bot&permissions=2080768255) ● [Support](${client.config.support})`

            let embed = new Discord.MessageEmbed()
                .setTitle("Reaction Help Menu")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setDescription(abc)
                .setFooter(client.user.username, client.user.displayAvatarURL())
                .setColor(client.colors.sky)
            let msg = await message.channel.send(embed)

            for (var k of [xmark, ...Object.keys(categories), '818174483343867964', '818523288686035015']) {
                await msg.react(k)
            }

            let rFilt = (reaction, user) => {
                return [...Object.keys(categories), '818174483343867964', xmark, '818523288686035015'].includes(reaction.emoji.id) && user.id === message.author.id
            }

            let collector = msg.createReactionCollector(rFilt, {
                time: 5 * 60 * 1000
            })

            collector.on("collect", async collected => {

                const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                try {
                    for (const reaction of userReactions.values()) {
                        await reaction.users.remove(message.author.id);
                    }
                } catch (error) {
                    client.logger.error('Failed to remove reactions.');
                }

                let reaction = collected.emoji
                if (reaction.id === "818174483343867964") {
                    let cats = []
                    commands.forEach(command => {
                        if (!cats.includes(command.category)) {
                            if (command.category === "Developer" && !client.config.owners.includes(message.author.id)) {
                                return;
                            }
                            cats.push(command.category)
                        }
                    })

                    await cats.forEach(cat => {
                        const tCommands = commands.filter(cmd => cmd.category === cat)
                        embed.addField(client.emoji.help[cat.toLowerCase()] + ` ${cat} [${tCommands.size}]`, tCommands.map(command => `\`${command.name}\``).join(", "))
                    })
                    embed.setDescription(`**${client.commands.size}** Total Commands`)
                    embed.setTitle(client.user.username + " Help")
                    msg.reactions.removeAll()
                    msg.edit(embed)
                } else if (reaction.id === xmark) {
                    collector.stop()
                    msg.reactions.removeAll()
                    embed.setColor(null)
                    msg.edit(embed)
                } else if (reaction.id === "818523288686035015") {
                    embed.setDescription(abc)
                    msg.edit(embed)
                } else {
                    let content = categories[reaction.id]
                        .map(em => `\`${em.name}\` - ${em.description}`)
                    embed.setDescription(content.join("\n") + `\n

                    **Additional**:
                    <:help_back:818523288686035015>:  **Back to main menu**
                    ${client.emoji.misc.xmark}: **Stop menu**`)
                    msg.edit(embed)
                }
            })

            collector.on('end', (_, reason) => {
                if (reason === "time") {
                    embed.setColor(null)
                    msg.edit("This message is inactive", embed)
                }
            })

        } else {
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
                .addField('\u200b', '[Invite Me](https://discord.com/oauth2/authorize?client_id=800549820485599272&scope=bot&permissions=2080768255) ● [Support](' + client.config.support + ')')
            return message.channel.send(helpEmbed)
        }
    }
}