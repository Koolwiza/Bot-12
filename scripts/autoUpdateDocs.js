module.exports = async (client) => {
    setInterval(async () => {
        let {
            commands
        } = client

        let categories = []

        let docs = "# Bot-12 Command List\n> :heart: Command list generated [here](https://github.com/Koolwiza/Bot-12/blob/main/scripts/autoUpdateDocs.js)\n"

        commands.forEach(command => {
            if (!categories.includes(command.category)) {
                categories.push(command.category)
            }
        })

        categories.forEach(cat => {
            const tCommands = commands.filter(cmd => cmd.category === cat)
            docs += `
            \n
### ${cat} [${tCommands.size}] 

| Name | Description | 
| ---- | ----------- | 
${tCommands.map(command => {
    return `| [${command.name}](https://github.com/Koolwiza/Bot-12/blob/master/docs/commands.md#${command.name}) | ${command.description} | `
}).join("\n")}\n\n`
        })

        docs += "# Detailed Command List"

        categories.forEach(cat => {
            const tCommands = commands.filter(cmd => cmd.category === cat)

            docs += `
## ${cat} | ${tCommands.size} Commands

${tCommands.map(command => {
   return `

### ${command.name.toProperCase()}

Command: ${command.name}\\
Description: ${command.description}\\
Usage: ${command.usage}\\
Aliases: ${command.aliases.join(', ')}

[Back to top](https://github.com/Koolwiza/Bot-12/blob/master/docs/commands.md#bot-12-command-list)`
}).join("\n\n")}`
        })



        const fs = require('fs')
        if (fs.existsSync('./docs/commands.md')) {
            fs.writeFileSync('./docs/commands.md', docs.trim())
            client.logger.log("Command list updated!")
        }

    }, 10 * 60 * 1000)

}