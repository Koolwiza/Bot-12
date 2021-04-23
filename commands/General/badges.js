const {
    UserFlags: {
        FLAGS
    }
} = require('discord.js')


const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'badges',
    description: 'Shows all member badges in a server',
    usage: '',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {
        let guildBadges = {

        }

        let emojis = {
            discord_employee: "<discord_employee:833367325885333515>",
            partnered_server_owner: "<partnered_server_owner:833367374840594444>",
            house_brilliance: "<house_brilliance:833367516800876575>",
            house_bravery: "<house_bravery:833367669520072704>",
            house_balance: "<house_balance:833367735773429790>",
            bughunter_level_2: "<bughunter_level_2:833367950505279509>",
            bughunter_level_1: "<bughunter_level_1:833367987162710027>",
            early_supporter: "<early_supporter:833368106322624552>",
            early_verified_bot_developer: "<early_verified_bot_developer:833368163961012264>",
            nitro: "<nitro:833368201940172881>",
            verified_bot: "<verified_bot:833379766605185074>",
            bot: "<bot:833379903276974140>",
        }
        let keys = Object.keys(FLAGS)
        await message.guild.members.fetch()

        for(let v of keys) {
            
        }
    }
}