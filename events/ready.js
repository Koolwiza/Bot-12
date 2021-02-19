const chalk = require('chalk'),
    config = require('../data/config')

module.exports = async client => {
    console.clear()
    client.logger.log(chalk `{yellow.bold ${client.user.tag}} is online! {cyan ${client.guilds.cache.size}} servers, {cyan ${client.channels.cache.size}} channels, and {cyan ${client.users.cache.size}} users!`);

    client.user.setPresence({
        activity: {
            name: config.status[0].name,
            type: config.status[0].type
        }
    })


    let i = 0
    setInterval(() => {
        if (i > arr.length - 1) i = 0
        let status = config.status[i]
        client.user.setPresence({
            activity: {
                type: status.type,
                name: status.type
            }
        })
        i++
    }, 20000)

}