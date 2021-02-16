const Discord = require('discord.js')

let num = [
    '1️⃣', '2️⃣', '3️⃣',
    '4️⃣', '5️⃣', '6️⃣',
    '7️⃣', '8️⃣', '9️⃣',
    '🔟'
]

module.exports = {
    name: 'poll',
    description: 'An advanced poll command able to hold multiple questions',
    usage: 'poll <option1 | option2 | option3 | ...>',
    aliases: [],
    required: ['MANAGE_GUILD'],
    user: ['MANAGE_GUILD'],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        if (!!message.member.roles.cache.has(data.modrole) || !message.member.permissions.has("MANAGE_GUILD")) return client.authorPerms(message, ["MANAGE_SERVER"])

        var questionRe = /"(.+)"/gmi

        let question = args.join(" ").match(questionRe)
        if (!question) return client.missingArgs(message, "You did not provide question")
        let options = args.join(" ").slice(question[0].length).split(" | ")

        let result = ""
        if (options[0] === "") {
            result += "✅ : Yes\n"
            result += "❌ : No"
            let embed = new Discord.MessageEmbed()
                .setTitle("📊 " + question)
                .setDescription(`React with one of the following to determine your choice!\n${result}`)
                .setColor("BLUE")
                .setFooter(client.user.username, client.user.displayAvatarURL())
                .setAuthor(message.author.tag, message.author.displayAvatarURL())

            let msg = await message.channel.send(embed)

            await msg.react("✅")
            await msg.react("❌")
        } else {

            for (i in options) {
                result += `${num[i]} : ${options[i]}\n`
            }

            let embed = new Discord.MessageEmbed()
                .setTitle("📊 " + question)
                .setDescription(`React with one of the following to determine your choice!\n${result}`)
                .setColor("BLUE")
                .setFooter(client.user.username, client.user.displayAvatarURL())
                .setAuthor(message.author.tag, message.author.displayAvatarURL())

            let msg = await message.channel.send(embed)

            for (x in options) {
                await msg.react(num[x])
            }
        }



    }
}