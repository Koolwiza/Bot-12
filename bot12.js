const Discord = require('discord.js'),
    glob = require('glob'),
    fs = require('fs'),
    Enmap = require('enmap')

const Bot12 = require('./base/base_bot12'),
    client = new Bot12()

async function main() {
    function getFile(dir = "") {
        return new Promise((resolve, reject) => {
            if (dir.length == 0) return reject("Error: must return directory to look in")
            if (!fs.existsSync(`./${dir}`)) return reject("Error: directory does not exist")
            glob(`${dir}/**/*.js`, (err, files) => {
                if (err) return reject(err);
                return resolve(files);
            })
        })
    }

    const commandFiles = await getFile("./commands").catch(err => {
        console.error(err);
        process.exit(1)
    });
    for (const file of commandFiles) {
        const command = require(file);
        client.commands.set(command.name, command)
    }

    const evtFiles = await fs.promises.readdir("./events/");
    client.logger.log(`Loading a total of ${evtFiles.length} events.`)
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        console.log(`Loading Event: ${eventName}`);
        const event = require(`./events/${file}`);
        client.on(eventName, event.bind(null, client));
    });

    client.login(client.config.token)
}
main()
