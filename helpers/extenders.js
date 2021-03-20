const {
	Message,
	MessageEmbed
} = require('discord.js'),
	client = require('../bot12')

/**
 * discord.js Functions
 */

Message.prototype.error = function (content) {
	return this.channel.send(
		new MessageEmbed()
		.setTitle("An error occured")
		.setDescription(content)
		.setColor(client.colors.red)
		.setFooter(client.user.username, client.user.displayAvatarURL())
		.setAuthor(this.author.tag, this.author.displayAvatarURL())
	)
}

Message.prototype.args = function (content) {
	return this.channel.send(
		new MessageEmbed()
		.setAuthor(this.author.tag, this.author.displayAvatarURL())
		.setFooter(client.user.username, client.user.displayAvatarURL())
		.setTitle("Missing Arguments")
		.setColor(client.colors.red)
		.setDescription(content))
}

Message.prototype.sendE = function (title = "", description = "", color = "", fields = []) {
	return this.channel.send({
		embed: {
			title: title,
			description: description,
			color: color,
			fields: fields,
			author: {
				name: this.author.tag,
				icon_url: this.author.displayAvatarURL()
			},
			footer: {
				text: client.user.username,
				icon_url: client.user.displayAvatarURL()
			}
		}
	})
}

/**
 * Message Embed functions
 */

MessageEmbed.prototype.success = function () {
	this.setColor(client.colors.green)
	this.setTitle("Success")
	return this
}

MessageEmbed.prototype.error = function () {
	this.setColor(client.colors.red)
	return this
}

MessageEmbed.prototype.default = function(user) {
	this
	.setAuthor(user.tag, user.displayAvatarURL())
	.setFooter(client.user.username, client.user.displayAvatarURL())
	return this
}

/**
 * String prototype functions
 * Generally bad practice to attach functions to native types
 * Just that this function is useful
 */

String.prototype.toProperCase = function () {
	return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};