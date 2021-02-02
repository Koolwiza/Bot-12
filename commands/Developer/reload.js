const Discord = require('discord.js'),
    ms = require('ms'),
    {
        inspect
    } = require('util')

module.exports = {
    name: 'reload',
    description: 'Reload a file/command',
    usage: 'reload <command/alias>',
    aliases: ['re'],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],
    args: false,
    premium: false,
    guildOnly: false,
    async execute(message, args, client) {
        if (!client.config.owners.includes(message.author.id)) return
        if (!args.length) return client.missingArgs(message, "No command provided")
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName) ||
            message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return client.error(message, "There is no command with that name/alias")

        delete require.cache[require.resolve(`../${command.category}/${command.name}.js`)];
        try {
            const newCommand = require(`../${command.category}/${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(client.baseEmbed(message, {title: "Success!", description: `I have reloaded the command \`${command.name}\``, color: client.colors.green}))
        } catch (error) {
            client.logger.log("There was an error reloading the command\n" + error, "error")
            client.error(message, "There was an error reloading " + command.name)
        }
    }
}