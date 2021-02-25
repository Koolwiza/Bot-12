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
		if (!message.member.permissions.has("MANAGE_MESSAGES") || client.modRole(message, data)) return client.authorPerms(message, ["MANAGE_MESSAGES"])
		if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) return client.clientPerms(message, ["MANAGE_MESSAGES"])

		let amount = parseInt(args[0])
		message.delete().catch(() => {})

		if (client.resolveUser(args[0])) {
			let User = await client.resolveUser(args[0])

			amount = Number(args[1])

			if (isNaN(amount)) return client.missingArgs(message, "Please provide an amount for me to purge")
			if (amount > 100) return message.error("The amount you provided was over 100, I can only purge 100 messages at a time!")

			message.channel.messages.fetch({
				limit: 100
			}).then(async messages => {
				const filterBy = User ? User.id : message.client.user.id;

				if (User) {
					messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
				}
				message.channel.bulkDelete(messages, true).then(deleted => {
					return message.sendE("Success", `Successfully purged ${deleted.size} messages from **${User.tag}**`, client.colors.green)
				}).catch(e => {
					client.logger.log("Error ran from purging messages\n" + e, "error")
					return message.error("could not purge messages, please try again")
				})


			})
		} else if (message.mentions.channels.size) {
			amount = Number(args[1])

			if (isNaN(amount)) return client.missingArgs(message, "Please provide an amount for me to purge")
			if (amount > 100) return message.error("The amount you provided was over 100, I can only purge 100 messages at a time!")

			let channel = message.mentions.channels.first()
			channel.bulkDelete(amount, true)
				.then(deleted => {
					return message.sendE("Success", `Successfully purged ${deleted.size} messages from **${channel.name}**`, client.colors.green)
				}).catch(e => {
					client.logger.log("Error ran from purging messages\n" + e, "error")
					return message.error("could not purge messages, please try again")
				})

		} else if (args[0] === "bots") {
			amount = Number(args[1])


			if (isNaN(amount)) return client.missingArgs(message, "Please provide an amount for me to purge")
			if (amount > 100) return message.error("The amount you provided was over 100, I can only purge 100 messages at a time!")

			message.channel.messages.fetch({
				limit: 100
			}).then(async messages => {

				messages = messages.filter(m => m.author.bot).array().slice(0, amount);

				message.channel.bulkDelete(messages, true).then(deleted => {
					return message.sendE("Success", `Successfully purged ${deleted.size} messages from **all bots**`, client.colors.green)
				}).catch(e => {
					client.logger.log("Error ran from purging messages\n" + e, "error")
					return message.error("could not purge messages, please try again")
				})

			})

		} else {

			if (isNaN(amount)) return client.missingArgs(message, "Please provide an amount for me to purge")
			if (amount > 100) return message.error("The amount you provided was over 100, I can only purge 100 messages at a time!")

			message.channel.bulkDelete(amount, true).then(deleted => {
				return message.sendE("Success", `Successfully purged ${deleted.size} messages`, client.colors.green)
			}).catch(e => {
				client.logger.log("Error ran from purging messages\n" + e, "error")
				return message.error("could not purge messages, please try again")
			})

		}

	}
}