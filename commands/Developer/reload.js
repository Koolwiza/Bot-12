const Discord = require('discord.js'),
    ms = require('ms'),
    {
        inspect
    } = require('util'),
    fs = require("fs")

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'reload',
    description: 'Reload a file/command',
    usage: 'reload <command/alias>',
    aliases: ['re'],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {

        if (!args.length) return message.args("No command provided")

        let commandName = args[0]

        const command = message.client.commands.get(commandName) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.error("There is no command with that name/alias")

        delete require.cache[require.resolve(`../${command.category}/${command.name}.js`)];
        try {
            const newCommand = require(`../${command.category}/${command.name}.js`);
            client.commands.set(newCommand.name, newCommand);
            return message.sendE("Success", `I have reloaded the command \`${command.name}\``, client.colors.green)
        } catch (error) {
            client.logger.log("There was an error reloading the command\n" + error, "error")
            message.error("There was an error reloading " + command.name)
        }
    }
}