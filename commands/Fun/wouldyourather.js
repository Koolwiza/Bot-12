const Discord = require('discord.js'),
    Bot12 = require('../../src/struct/Bot12')

module.exports = {
    name: 'wouldyourather',
    description: 'Play would you rather',
    usage: 'wouldyourather',
    aliases: ['wyr'],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    ignore: true,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Bot12} client 
     */
    async execute(message, args, client) {
        const {
            data
        } = await (require("axios").default).get("http://either.io/", {
            responseType: "text"
        });

        const $ = await (require("cheerio")).load(data);

        const blue = $("div.result.result-1").children(),
            red = $("div.result.result-2").children();

        const obj = {
            blue: {
                line: blue.eq(3).text(),
                percentage: blue.eq(1).text(),
                votes: blue.eq(2).text()
            },
            red: {
                line: red.eq(3).text(),
                percentage: red.eq(1).text(),
                votes: red.eq(2).text()
            }
        };

        let bl = parseInt(obj.blue.votes.split(",").join(""))
        let re = parseInt(obj.red.votes.split(",").join(""))

        let b = Math.round((bl / (bl + re)) * 100) / 5
        let r = Math.round((re / (bl + re)) * 100) / 5

        let embed = new Discord.MessageEmbed()
            .setTitle("Would you rather...")
            .setURL("https://www.either.io")
            .setDescription(`\\\🟦 ${obj.blue.line}\n**Or**\n\\\🟥 ${obj.red.line}\n\n\✅ To see results`)
            .default(message.author)
            .setColor(client.colors.blue)

        let res = `**Results**\n\`\`\`1st - ${'🟦'.repeat(b)} (${obj.blue.percentage})\n2nd - ${'🟥'.repeat(r)} (${obj.red.percentage})\`\`\``

        let a = await message.channel.send(embed)
        a.react('✅')
        let col = await a.awaitReactions((reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id, {
            time: 2 * 60 * 1000,
            max: 1,
            errors: ['time']
        }).catch(e => {
            return message.error("You ran out of time! Please try again to show results")
        })
        let reaction = col.first().emoji
        if (reaction.name === "✅") {
            embed.setDescription(`\\\🟦 ${obj.blue.line}\n**Or**\n\\\🟥 ${obj.red.line}\n\n${res}`)
            a.edit(embed)
        }
    }
}