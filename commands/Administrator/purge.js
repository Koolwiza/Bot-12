const Discord = require('discord.js')

module.exports = {
	name: 'purge',
	description: 'Purge messages from a channel',
	usage: 'purge <@user | userID | channel | bots] <amount>',
	aliases: [],
	required: ['MANAGE_MESSAGES'],
	user: ['MANAGE_MESSAGES'],
	category: __dirname.split("commands\\")[1],

	premium: false,
	guildOnly: false,
	async execute(message, args, client, data) {
		if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES) || client.modRole(message, data.guild)) return client.authorPerms(message, ["MANAGE_MESSAGES"])
		if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) return client.clientPerms(message, ["MANAGE_MESSAGES"])

		let amount = parseInt(args[0])
		message.delete().catch(() => {})

		if (await client.resolveUser(args[0])) {
			let User = await client.resolveUser(args[0])

			amount = Number(args[1])

			if (isNaN(amount)) return message.args("Please provide an amount for me to purge")
			if (amount > 100) return message.error("The amount you provided was over 100, I can only purge 100 messages at a time!")

			let messages = await message.channel.messages.fetch({
				limit: 100
			})
			const filterBy = User ? User.id : message.client.user.id;

			if (User) {
				messages = messages
					.filter(m => m.author.id === filterBy)
					.array()
					.slice(0, amount);
			}
			let deleted = await message.channel.bulkDelete(messages, true).catch(e => {
				client.logger.log("Error ran from purging messages\n" + e, "error")
				return message.error("could not purge messages, please try again")
			})
			return message.sendE("Success", `Successfully purged ${deleted.size} messages from **${User.tag}**`, client.colors.green)


		} else if (message.mentions.channels.size) {
			amount = Number(args[1])

			if (isNaN(amount)) return message.args("Please provide an amount for me to purge")
			if (amount > 100) return message.error("The amount you provided was over 100, I can only purge 100 messages at a time!")

			let channel = message.mentions.channels.first()
			let deleted = await channel.bulkDelete(amount, true).catch(e => {
				client.logger.log("Error ran from purging messages\n" + e, "error")
				return message.error("could not purge messages, please try again")
			})

			return message.sendE("Success", `Successfully purged ${deleted.size} messages from **${channel.name}**`, client.colors.green)


		} else if (args[0] === "bots") {
			amount = Number(args[1])


			if (isNaN(amount)) return message.args("Please provide an amount for me to purge")
			if (amount > 100) return message.error("The amount you provided was over 100, I can only purge 100 messages at a time!")

			let messages = await message.channel.messages.fetch({
				limit: 100
			})

			messages = messages.filter(m => m.author.bot).array().slice(0, amount);

			let deleted = await message.channel.bulkDelete(messages, true).catch(e => {
				client.logger.log("Error ran from purging messages\n" + e, "error")
				return message.error("could not purge messages, please try again")
			})
			return message.sendE("Success", `Successfully purged ${deleted.size} messages from **all bots**`, client.colors.green)

		} else {

			if (isNaN(amount)) return message.args("Please provide an amount for me to purge")
			if (amount > 100) return message.error("The amount you provided was over 100, I can only purge 100 messages at a time!")

			let deleted = await message.channel.bulkDelete(amount, true).catch(e => {
				client.logger.log("Error ran from purging messages\n" + e, "error")
				return message.error("could not purge messages, please try again")
			})

			return message.sendE("Success", `Successfully purged ${deleted.size} messages`, client.colors.green)

		}
	}
}