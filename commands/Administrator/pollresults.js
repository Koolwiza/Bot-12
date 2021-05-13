const Discord = require('discord.js'),
    Bot12 = require('../../src/struct/Bot12')

module.exports = {
    name: 'pollresults',
    description: 'End the poll',
    usage: 'pollresults <message id>',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],
    premium: false,
    ignore: true,
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {
        let id = args[0]
        if(!id) return message.error("Please provide a valid message id")

        let msg = await message.channel.messages.fetch(id)
        if(!msg) return message.error("This poll does not exist")
        if(msg.content.includes("Ended")) return message.error("This poll has already ended")
        if(!msg.embeds[0]?.title.includes("📊")) return message.error("This poll does not exist")
        msg.embeds[0].color = ""
        let appprovedPollUsers = (await msg.reactions.cache.get('✅').users.fetch()).size
        let disapprovedPollUsers = (await msg.reactions.cache.get('❌').users.fetch()).size

        let totalSize = appprovedPollUsers + disapprovedPollUsers

        let yesPercent = (Math.round((appprovedPollUsers / totalSize) * 100))
        let noPercent = (Math.round((disapprovedPollUsers / totalSize) * 100))
        let yesEmoji = "🟩".repeat(yesPercent / 5)
        let noEmoji = "🟥".repeat(noPercent / 5)
        //msg.edit("Poll Ended", msg.embeds[0])

        let embed = new Discord.MessageEmbed()
            .setTitle("Poll Results!")
            .setDescription(`\`\`\`✅ ${appprovedPollUsers} (${yesPercent}%)\n❌ ${disapprovedPollUsers} (${noPercent}%)\n\n${yesEmoji}\n${noEmoji}\`\`\``)
            .setColor(client.colors.sky)
            .default(message.author)
        message.channel.send(embed)
    }
}