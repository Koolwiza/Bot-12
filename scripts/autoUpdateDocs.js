module.exports = async (client) => {
    setInterval(async () => {
        let {
            commands
        } = client

        let categories = []

        let docs = "# Bot-12 Command List\n"

        commands.forEach(command => {
            if (!categories.includes(command.category)) {
                categories.push(command.category)
            }
        })

        await categories.forEach(cat => {
            const tCommands = commands.filter(cmd => cmd.category === cat)
            docs += `
            \n
## ${cat} [${tCommands.size}]
    
| Name | Description | Usage
| ---- | ----------- | ----- \n
${tCommands.map(command => `| ${command.name} | ${command.description} | ${command.usage}`).join("\n")}`
        })
        const fs = require('fs')
        if(fs.existsSync('./docs/command-list.md')) {
            fs.writeFileSync('./docs/command-list.md', docs.trim())
            client.logger.log("Command list updated!")
        }
        
    }, 10 * 60 * 1000)

}