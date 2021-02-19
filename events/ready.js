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
        /**
         * Multiple statuses
         * If you only want one, leave one
         * Variable templates include:
         * {client} - Client's username
         * {guilds} - Client's guilds
         * {users} - Client's cached users
         * {roles} - Client's roles
         * {channels} - Client's channels
         */
        let name = status.name
            .replace(/\{client\}/gi, client.user.username)
            .replace(/{guilds}/gi, client.guilds.cache.size)
            .replace(/\{users\}/gi, client.users.cache.size)
            .replace(/\{roles\}/gi, client.roles.cache.size)
            .replace(/\{channels\}/gi, client.channels.cache.size)
        client.user.setPresence({
            activity: {
                type: status.type,
                name: name
            }
        })
        i++
    }, 20000)

}