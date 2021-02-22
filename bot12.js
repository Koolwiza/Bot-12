const Discord = require('discord.js'),
  glob = require('glob'),
  fs = require('fs'),
  Enmap = require('enmap'),
  cmdloader = require('./helpers/cmdloader'),
  eventloader = require('./helpers/eventloader')

const Bot12 = require('./src/struct/Bot12Client'),
  client = new Bot12()


client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.logger.log("Bot reconnecting..."))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));

require('./helpers/extenders')

function init() {
  cmdloader(client, "commands")
  eventloader(client, "events")
  client.login(client.config.token)
}
init()

module.exports = client