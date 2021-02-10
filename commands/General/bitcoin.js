const Discord = require('discord.js'),
	ms = require('ms'),
	fetch = require('node-fetch')

module.exports = {
	name: 'bitcoin',
	description: 'See bitcoin ',
	usage: 'bitcoin [usd]',
	aliases: [],
	required: [],
	user: [],
	category: __dirname.split("commands/")[1],
	args: false,
	premium: false,
	guildOnly: false,
	async execute(message, args, client) {
		
		fetch('https://blockchain.info/ticker')
		.then(res => res.json())
		.then(body => {
			

			let embed = new Discord.MessageEmbed()
				.setTitle("Bitcoin values")
				.setColor(client.colors.gold)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setFooter(client.user.username, client.user.displayAvatarURL())

			embed.addField("USD Prices", ``)



		})
	}	
}	