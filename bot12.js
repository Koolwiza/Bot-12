const {
  Intents
} = require('discord.js'),
  cmdloader = require('./scripts/cmdloader'),
  eventloader = require('./scripts/eventloader'),
  docsUpdater = require('./scripts/autoUpdateDocs'),
  Bot12 = require('./src/struct/Bot12'),
  client = new Bot12({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    restTimeOffset: 250,
    ws: {
      intents: Intents.ALL
    }
  }),
  {
      CronJob
  } = require('cron')

const job = new CronJob('0 12 * * Sun', () => {
  client.joins.clear()
}, null, true, 'America/Los_Angeles')

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