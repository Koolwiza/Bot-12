const {
  Intents
} = require('discord.js'),
  cmdloader = require('./scripts/cmdloader'),
  eventloader = require('./scripts/eventloader'),
  docsUpdater = require('./scripts/autoUpdateDocs')


const Bot12 = require('./src/struct/Bot12Client'),
  client = new Bot12({
    restTimeOffset: 250,
    ws: {
      intents: Intents.ALL
    }
  })

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.logger.log("Bot reconnecting..."))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info))

async function init() {
  await cmdloader(client, "commands")
  await eventloader(client, "events")
  await require('./helpers/extenders')
  await docsUpdater(client)
  client.login(client.config.token)
}
init()

module.exports = client