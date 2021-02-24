const {
    differenceInCalendarDays
} = require('date-fns')
const Discord = require('discord.js')

module.exports = {
    name: 'daily',
    description: 'Claim the daily reward for more coins! ',
    usage: 'daily',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    cooldown: 60 * 60 * 24,
    async execute(message, args, client, data) {

        let user = client.userProfiles
        let d = user.get(message.author.id)

        let award = ['r', 'e', 'w', 'a', 'r', 'd']

        let reward = ""
        let amount = randNum(750, 1500)
        let msg = `You receive ${client.emoji.misc.coin} **${amount}** for your daily reward\n`
        if (d.daily >= 6) {
            let add = randNum(3000, 4000)
            reward += `You have gotten the 6 daily streak! \nYour reward is an extra ${client.emoji.misc.coin}** ${add}**\n`
            amount += add
            user.set(message.author.id, 0, "daily")
        }
        user.inc(message.author.id, "daily")
        user.math(message.author.id, "add", amount, "balance")
        let awardMsg = ""
        for (let i = 0; i < award.length; i++) {
            if (d.daily > i) {
                awardMsg += client.emoji.reward[`${award[i]}2`]
            } else {
                awardMsg += client.emoji.reward[`${award[i]}1`]
            }
        }

        let e = client.baseEmbed(message, {
            title: "Daily Reward",
            fields: [
                {
                    name: "Reward",
                    value: msg + reward
                },
                {
                    name: "Streak",
                    value: awardMsg
                }
            ],
            color: client.colors.gold
        })

        e.footer = "Complete the word `REWARD` to receive a surprise!" // Because default client.baseEmbed has client's username + avatar as footer

        return message.channel.send(e)

    }
}



function randNum(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}