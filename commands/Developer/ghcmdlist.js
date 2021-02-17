const Discord = require('discord.js')

module.exports = {
    name: 'ghcmdlist',
    description: 'hi',
    usage: 'bonk',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {

        const {
            commands
        } = client

        let categories = []

        commands.forEach(command => {
            if (!categories.includes(command.category)) {
                if (command.category === "Developer" && !client.config.owners.includes(message.author.id)) {
                    return;
                }
                categories.push(command.category)
            }
        })

        let table = ""

        await categories.forEach(cat => {
            const tCommands = commands.filter(cmd => cmd.category === cat)
            table += `\n\n## ${cat} [${tCommands.size}]\n\n${tCommands
            .map(c =>` | ${c.name} | ${c.description} | ${c.usage.replace(/\|/g, '\\|')} |`)
            .join("\n ")}`
        })
        console.log(table)
    }
}