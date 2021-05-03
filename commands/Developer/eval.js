const Discord = require('discord.js'),
    ms = require('ms'),
    {
        inspect
    } = require('util')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'eval',
    description: 'Evaluates a piece of code',
    usage: 'eval <code>',
    aliases: ['ev', 'evaluate'],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {
        let evaled;
        let code = args.join(" ");
        try {
            const hrStart = process.hrtime();
            evaled = await eval(`( async () => {
                ${code}
              })()`);

            if (evaled instanceof Promise) evaled = await evaled;
            const hrStop = process.hrtime(hrStart);

            let response = '';

            response += `\`\`\`js\n${await client.clean(evaled)}\n\`\`\`\n`;
            response += `• Discord.js ${Discord.version}\n`;
            response += ` • Type: \`${typeof evaled}\`\n`;
            response += ` • Time taken: \`${(((hrStop[0] * 1e9) + hrStop[1])) / 1e6}ms\``;

            return message.sendE("Success", response, client.colors.sky)
        } catch (err) {
            return message.error(`Error: ${await client.clean(err.message)}`)
        }


    }
}