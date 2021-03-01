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

MessageEmbed.prototype.default = function () {
	this.setColor(client.colors.sky)
	return this
}

MessageEmbed.prototype.error = function () {
	this.setColor(client.colors.red)
	return this
}

/**
 * Array prototype functions
 */

Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.remove = function (a) {
	const index = this.indexOf(a);
	if (index > -1) {
		this.splice(index, 1);
	}
	return this
}

Array.prototype.shuffle = function () {
	const array = [];
	this.forEach(element => array.push(element));
	let currentIndex = array.length,
		temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
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