const Discord = require('discord.js'),
  glob = require('glob'),
  fs = require('fs'),
  Enmap = require('enmap'),
  cmdloader = require('./helpers/cmdloader'),
  eventloader = require('./helpers/eventloader')

const Bot12 = require('./base/base_bot12'),
  client = new Bot12()

require('./helpers/extenders')

function init() {
  cmdloader(client, "commands")
  eventloader(client, "events")
  client.login(client.config.token)
}

init()

module.exports = client