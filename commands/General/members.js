const Discord = require('discord.js'),
    fetch = require('node-fetch')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'members',
    description: 'Shows detailed information about members and join rate',
    usage: 'members',
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

        const guildJoins = client.joins.ensure(message.guild.id, {
            "monday": 0,
            "tuesday": 0,
            "wednesday": 0,
            "thursday": 0,
            "friday": 0,
            "saturday": 0,
            "sunday": 0,
        })

        let chart = {
            type: 'line',
            data: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [{
                    label: 'Joins',
                    data: Object.values(guildJoins)
                }]
            }
        }

        let enChart = encodeURIComponent(JSON.stringify(chart))
        const chartUrl = `https://quickchart.io/chart?c=${enChart}&backgroundColor=(rgb(47,%2049,%2054))`;
        await message.guild.members.fetch()

        let humanPercent = Math.round((message.guild.members.cache.filter(m => !m.user.bot).size / message.guild.memberCount) * 100);
        let botPercent = Math.round((message.guild.members.cache.filter(m => m.user.bot).size / message.guild.memberCount) * 100);
        
        let embed = new Discord.MessageEmbed()  
            .setTitle(`${message.guild.name} Member statistics`)
            .setDescription(`${message.guild.memberCount} total members. (${humanPercent}% humans + ${botPercent}% bots)`)
            .setImage(chartUrl)
            .setColor(client.colors.green)
            .default(message.author)
        message.channel.send(embed)
    }
}