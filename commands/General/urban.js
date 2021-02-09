const Discord = require('discord.js'),
	ms = require('ms')



let numbers = [
	'1️⃣', '2️⃣', '3️⃣',
	'4️⃣', '5️⃣', '6️⃣',
	'7️⃣', '8️⃣', '9️⃣',
	'🔟'
]

module.exports = {
	name: 'google',
	description: 'Google a query and get valid results from google',
	usage: 'google <query>',
	aliases: ["gsearch"],
	required: [],
	user: [],
	category: __dirname.split("commands/")[1],
	args: false,
	premium: false,
	guildOnly: false,
	async execute(message, args, client) {
		let query = encodeURIComponent(args.join(" "))
		
	}
}