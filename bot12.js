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

new CronJob('0 12 * * Sun', () => {
  client.joins.clear()
}, null, true, 'America/Los_Angeles')

const { GiveawaysManager } = require("discord-giveaways");
// Starts updating currents giveaways
const manager = new GiveawaysManager(client, {
    storage: "./handlers/giveaways.json",
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: [ "MANAGE_MESSAGES", "ADMINISTRATOR" ],
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});
// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager;


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
