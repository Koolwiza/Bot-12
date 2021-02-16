const Discord = require('discord.js'),
    ms = require('ms'),
    {
        inspect
    } = require('util')

module.exports = {
    name: 'eval',
    description: 'Evaluates a piece of code',
    usage: 'eval <code>',
    aliases: ['ev', 'evaluate'],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],
    
    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        if (!client.config.owners.includes(message.author.id)) return
        let evaled;
        let code = args.join(" ");
        try {
            const hrStart = process.hrtime();
            evaled = eval(code);

            if (evaled instanceof Promise) evaled = await evaled;
            const hrStop = process.hrtime(hrStart);

            let response = '';

            response += `\`\`\`js\n${await client.clean(evaled)}\n\`\`\`\n`;
            response += `• Discord.js ${Discord.version}\n`;
            response += ` • Type: \`${typeof evaled}\`\n`;
            response += ` • Time taken: \`${(((hrStop[0] * 1e9) + hrStop[1])) / 1e6}ms\``;

            let evEmbed = new Discord.MessageEmbed()
                .setColor(client.colors.sky)
                .setDescription(response)
                .setFooter(client.user.username, client.user.displayAvatarURL())
                .setAuthor(message.author.tag, message.author.displayAvatarURL())

            if (response.length > 0) {
                return await message.channel.send(evEmbed)

            }
        } catch (err) {
            return client.error(message, `Error: ${await client.clean(err.message)}`)
        }


    }
}