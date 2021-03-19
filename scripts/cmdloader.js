const fs = require('fs'),
    glob = require('glob')


module.exports = async (client, path) => {
    function getFile(dir = "") {
        return new Promise((resolve, reject) => {
            if (dir.length === 0) return reject("Error: provide a directory to look in")
            if (!fs.existsSync(dir)) return reject("Error: directory does not exist")
            glob(`${dir}/**/*.js`, (err, files) => {
                if (err) return reject(err);
                let cmdFiles = files.map(c => `../${c}`)
                return resolve(cmdFiles);
            })
        })
    }

    const commandFiles = await getFile(path).catch(err => {
        console.error(err);
        process.exit(1)
    });

    for (const file of commandFiles) {
        const command = require(file);
        client.commands.set(command.name, command)
    }
}