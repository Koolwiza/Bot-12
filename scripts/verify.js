const Enmap = require('enmap'),
    Discord = require('discord.js'),
    config = require('../src/data/config')

let settings = new Enmap({
    name: "settings"
})

settings.ensure("setup", {
    nodejs: false,
    token: false
})

let setup = {
    nodejs: () => {
        return new Promise((resolve, reject) => {
            let dsV = Discord.version.split(".")[0].split("v")[1]
            let nsV = process.version.split(".")[0].split("v")[1]
            if (parseInt(dsV) == 12) {
                if (parseInt(nsV) < 12) {
                    return resolve("NodeJS version up to date")
                } else {
                    return reject("NodeJS version unupdated. Please update NodeJS to v12 or higher")
                }
            }
            return resolve(true)
        })
    },
    token: () => {
        return new Promise((resolve, reject) => {
            const c = new Discord.Client()
            c.login(config.token).then(() => {
                c.destroy()
                return resolve(true)
            }).catch(err => {
                if (err.message.toLowerCase().includes("invalid token was provided")) return reject("Invalid token provided, please provide a valid token")
            })
        })
    }
}


const a = async () => {
    for (let value in setup) {
        console.log("Checking: " + value)
        try {
            let res = await setup[value]()
            settings.set("setup", res, value)
        } catch (e) {
            return console.log(e)
        }
    }

    console.log("All cleared, you can proceed with running the bot! (If you have any errors, please head toward common-errors)")
}

a()