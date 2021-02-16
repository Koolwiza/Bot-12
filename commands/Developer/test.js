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
	async execute(message, args, client) {
		if (!client.config.owners.includes(message.author.id)) return

	}
}