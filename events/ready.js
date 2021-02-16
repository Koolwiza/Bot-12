const chalk = require('chalk')

module.exports = async client => {
    console.clear()
    client.logger.log(chalk `{yellow.bold ${client.user.tag}} is online! {cyan ${client.guilds.cache.size}} servers, {cyan ${client.channels.cache.size}} channels, and {cyan ${client.users.cache.size}} users!`);

    client.user.setActivity(`@${client.user.username} 🤖`, {
        type: 'PLAYING',
    })
    setInterval(() => client.user.setActivity(`@${client.user.username} 🤖`, {
        type: 'PLAYING',
    }), 1000 * 60 * 2);

}