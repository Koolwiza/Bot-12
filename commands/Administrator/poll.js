const Discord = require('discord.js')

let num = {
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣',
    10: '🔟'
}

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'poll',
    description: 'An advanced poll command able to hold multiple questions',
    usage: 'poll <question> [option1 | option2 | option3 | ...]',
    aliases: [],
    required: [],
    user: ['MANAGE_GUILD'],
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
        var questionRe = /"(.*)"/gmi
        let question = args.join(" ").match(questionRe)
        if (!question) return message.args("You did not provide question")
        let options = args.join(" ").slice(question[0]?.length)?.split(" | ")
        let result = ""
        
        
        if (options.length <= 1) {
            result += "✅ : Yes\n"
            result += "❌ : No"

            return message.sendE(`📊 ${question}`, `React with one of the following to determine your choice!\n${result}`, "BLUE").then(async msg => {
                await msg.react("✅")
                await msg.react("❌")
            })

        } else {
            if (options.length > 9) return message.error("Cannot be more than 9 options")
            result = options.map((c, i) => {
                return `${num[i + 1]}: ${c}`
            })
            let msg = await message.sendE(`📊 ${question}`, `React with one of the following to determine your choice!\n${result.join('\n')}`, "BLUE")
            options.map(async (c, x) => {
                await msg.react(num[x + 1])
            })
        }



    }
}