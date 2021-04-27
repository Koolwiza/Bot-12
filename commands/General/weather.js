const {
    MessageEmbed
} = require('discord.js')

const weather = require('weather-js'),
    {
        promisify
    } = require('util'),
    asyncWeather = promisify(weather.find)

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'weather',
    description: 'Search for the weather in a location in F° or C°',
    usage: 'weather <location> [--(c|f)]',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {
        if (!args.length) return message.args("Please provide a location")
        let flags = /--(\w)/i
        let degree = "F"

        if(flags.test(message.content)) degree = message.content.match(flags)[1]
        if(!['f', 'c'].includes(degree.toLowerCase())) return message.error("Type of degree can only be 'F' or 'C'")
        let location = args.join(" ").split("--")

        console.log(location)
        console.log("degree: " + degree)

        let result = await asyncWeather({
            search: location,
            degreeType: degree
        }).catch(e => {
            console.log(e)
        })

        if(!result.length) return message.error("Please provide a valid location!")

        let emojiWeathers = {
            "rain": "🌧️",
            "snow": "🌨️",
            "sun": "☀️",
            "cloud":"⛅"
        }

        let cur = result[0].current

        let currentTemp = `${cur.temperature}° ${degree}`
        let skyText = cur.skytext
        let lastUpdated = cur.observationtime
        let humidityPercent = `${cur.humidity}%`
        let windspeed = cur.windspeed
        let emoji = emojiWeathers[Object.keys(emojiWeathers).find(c => skyText.toLowerCase().includes(c))] ?? ''

        let embed = new MessageEmbed()
            .setTitle(cur.observationpoint)
            .setDescription(`It is currently: ${currentTemp}.\nSky Text: ${emoji} ${skytext}\nHumidity: ${humidityPercent}\n:dash: Windspeed: ${windspeed} \nLast updated: ${lastUpdated} `)
            .setColor(client.colors.sky)
            .default(message.author)
        return message.channel.send(embed)


    }
}