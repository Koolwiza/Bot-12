
module.exports = class AntiSpamMessage {
    constructor(message) {
        this.author = message.author.id
        this.guild = message.guild.id
        this.channel = message.channel.id
        this.content = message.content
        this.timestamp = message.createdTimestamp
    }
}