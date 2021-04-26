const Discord = require('discord.js')

const Bot12 = require('../../src/struct/Bot12.js')

module.exports = {
    name: 'npm',
    description: 'Search for a package in npm',
    usage: 'npm <package>',
    aliases: [],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array} args 
     * @param {Bot12} client 
     * @param {object} data 
     */
    async execute(message, args, client, data) {
        const npm = encodeURIComponent(args.join(" "))
        if (!npm) return message.reply('Please Provide A Valid Package To Search.') // If No Packge In Searched.

        let response = await fetch(`https://api.npms.io/v2/search?q=${npm}`)
        response = await response.json()

        try {
            const pkg = response.results[0].package
            const embed = new Discord.MessageEmbed()
                .setTitle(pkg.name)
                .setColor(client.colors.green)
                .default(message.author)
                .setURL(pkg.links.npm)
                .setThumbnail('https://images-ext-1.discordapp.net/external/JsiJqfRfsvrh5IsOkIF_WmOd0_qSnf8lY9Wu9mRUJYI/https/images-ext-2.discordapp.net/external/ouvh4fn7V9pphARfI-8nQdcfnYgjHZdXWlEg2sNowyw/https/cdn.auth0.com/blog/npm-package-development/logo.png')
                .setDescription(pkg.description)
                .addField('Author:', pkg.author ? pkg.author.name : 'None', true) 
                .addField('Version:', pkg.version, true)
                .addField('Repository:', pkg.links.repository ? pkg.links.repository : 'None', true) 
                .addField('Maintainers:', pkg.maintainers ? pkg.maintainers.map(e => e.username).join(', ') : 'None', true) 
                .addField('Keywords:', pkg.keywords ? pkg.keywords.join(', ') : 'None', true) 
            return message.channel.send(embed)
        } catch (e) {
            return message.error(`No packages were found with the name ${args[0]}`) 
        }
    }
}