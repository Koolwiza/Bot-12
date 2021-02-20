const Discord = require('discord.js'),
	ms = require('ms'),
	fetch = require("node-fetch")

module.exports = {
	name: 'test',
	description: "A test file for developers",
	usage: 'test ',
	aliases: [],
	required: [],
	user: [],
	category: __dirname.split("commands\\")[1],

	premium: false,
	guildOnly: false,
	async execute(message, args, client, data) {
		if (!client.config.owners.includes(message.author.id)) return
		let categories = []

		const {
			commands
		} = client

		commands.forEach(command => {
			if (!categories.includes(command.category)) {
				categories.push(command.category)
			}
		})

		let emojis = {
			developer: "👑",
			administrator: "🔨",
			general: "👍",
			utility: "💻",
			music: '🎵',
			economy: '💵'
		}

		let a = ""

		await categories.forEach(cat => {
			const tCommands = commands.filter(cmd => cmd.category === cat)

			let cmds = tCommands.map(command => `\`${command.name}\``)
			let amount;
			if (cmds.length > 5) {
				amount = cmds.length - 5
				cmds.splice(5, cmds.length)
			}

			let b = amount ? `and **${amount}** more...` : ""
			let name = ` - ${emojis[cat.toLowerCase()]} **${cat}**:`

			a += `${name} ${cmds.join(", ")} ${b}\n\n`
		})

		let msg = `\`\`\`
		<img width="150" height="150" align="left" style="float: left; margin: 0 10px 0 0;" alt="Bot 12" src="https://i.imgur.com/gid0Rot_d.png?maxwidth=760&fidelity=grand">  

# Bot 12

A random bot with a random name.
		
A bot to help your server with moderation, utility and more.
		
		​
		​
		​
		
		
### Some commands this bot offers

⭐ __**${client.commands.size}** total commands__ ⭐

${a}

And even more commands coming soon!

### Features 

- ❌ Anti Links - No links allowed when enabled

- ❌ Anti Invites - No invites allowed when enabled

- ❌ Anti Spoilers - No spoilers allowed when enabled

- ✅ Automatic Administrator Command Deletion - Deletes administrator commands when enabled

- ❌ Anti Bots - No bots will be able to be added to the server when the person who added doesn't have a certain role (mod role in config) when enabled

- ✅ Configurable Prefix - A customizable prefix 

- ✅ Modrole - A modrole to bypass permission checks

- ✅ Welcome Messages - A plugin to send messages to a channel with variables whenever a user joins or leaves
\`\`\``

return message.channel.send(msg)

	}
}