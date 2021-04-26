const {
    execSync
} = require('child_process')
const Discord = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'execute',
    description: 'Run a shell command',
    usage: '',
    aliases: ['exec', 'ex'],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {
        try {
            const hrStart = process.hrtime();
            const output = execSync(args.join(" "), {
                encoding: 'utf-8'
            })
            const hrStop = process.hrtime(hrStart);

            let response = '';

            response += `\`\`\`js\n${await client.clean(output)}\n\`\`\`\n`;
            response += ` • Time taken: \`${(((hrStop[0] * 1e9) + hrStop[1])) / 1e6}ms\``;

            return message.sendE("Success", response, client.colors.sky)
        } catch (err) {
            return message.error(err)
        }
    }
}