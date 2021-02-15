const Discord = require('discord.js'),
    ms = require('ms'),
    {
        inspect
    } = require('util'),
    fs = require("fs")

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
        if (!args.length) return client.missingArgs(message, "No command/event provided")
        let type = args[0]

        if(type.toLowerCase() === "event") {
          if(!fs.existsSync(`../../events/${args[0]}`)) return client.error(message, "No event with that name")
          delete require.cache[require.resolve(`../../events/${args[0]}`)]
        }

        const command = message.client.commands.get(commandName) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return client.error(message, "There is no command with that name/alias")

        delete require.cache[require.resolve(`../${command.category}/${command.name}.js`)];
        try {
            const newCommand = require(`../${command.category}/${command.name}.js`);
            client.commands.set(newCommand.name, newCommand);
            message.channel.send(client.baseEmbed(message, {title: "Success!", description: `I have reloaded the command \`${command.name}\``, color: client.colors.green}))
        } catch (error) {
            client.logger.log("There was an error reloading the command\n" + error, "error")
            client.error(message, "There was an error reloading " + command.name)
        }
    }
}