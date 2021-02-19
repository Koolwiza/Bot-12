const {
  Client,
  Collection,
  Intents
} = require('discord.js'),
  Discord = require('discord.js'), {
    inspect
  } = require('util'),
  Enmap = require('enmap')

Discord.Constants.DefaultOptions.ws.properties.$browser = "Discord Android"

/**
 * A class used to attach functions and properties to the main client provided by discord
 * @extends {Client}
 * @param {restTimeOffset} Reduces time between requesting API
 */

class Bot12 extends Client {
  constructor(options) {
    super({
      restTimeOffset: 250,
      ws: {
        intents: Intents.ALL
      }
    });
    this.logger = require('../helpers/logger')
    this.colors = require("../data/colors")
    this.config = require('../data/config')
    this.emoji = require('../data/emojis')

    this.commands = new Collection()
    this.snipes = new Collection()
    this.queue = new Map()

    this.guildData = new Enmap({
      name: "guild",
      fetchAll: false,
      autoFetch: true
    })

    this.plugins = new Enmap({
      name: "plugin",
      fetchAll: false,
      autoFetch: true
    })

    this.modActions = new Enmap({
      name: "actions",
      fetchAll: true,
      autoFetch: true
    })

    this.userProfiles = new Enmap({
      name: "profiles",
      fetchAll: false,
      autoFetch: true
    })

    this.disabled = new Enmap({
      name: "commands",
      fetchAll: false,
      autoFetch: true
    })

  }

  error(message, err) {
    const errorEmbed = new Discord.MessageEmbed()
      .setTitle("An unexpected error occured")
      .setDescription(`\`\`\`${err}\`\`\``)
      .setColor(this.colors.red)
      .setFooter(this.user.username, this.user.displayAvatarURL())
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
    return message.channel.send(errorEmbed)
  }

  authorPerms(message, perms) {
    let a = typeof perms === Array ? perms.join(", ") : perms

    const errorEmbed = new Discord.MessageEmbed()
      .setTitle("You don't have permission to execute this comamnd")
      .setDescription(`**Permission(s) Needed: **${a}`)
      .setColor(this.colors.red)
      .setFooter(this.user.username, this.user.displayAvatarURL())
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
    return message.channel.send(errorEmbed)
  }

  clientPerms(message, perms) {
    let p = typeof perms === Array ? perms.join(', ') : perms

    const errorEmbed = new Discord.MessageEmbed()
      .setTitle("I don't have permission to execute this comamnd")
      .setDescription(`**Permission(s) Needed: **${p}`)
      .setColor(this.colors.red)
      .setFooter(this.user.username, this.user.displayAvatarURL())
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
    return message.channel.send(errorEmbed)
  }

  baseEmbed(msg, object) {
    let authorObject = {
      name: msg.author.tag,
      icon_url: msg.author.displayAvatarURL()
    }
    let footerObject = {
      text: this.user.username,
      icon_url: this.user.displayAvatarURL()
    }
    return {
      embed: {
        author: authorObject,
        footer: footerObject,
        ...object
      }
    }
  }

  missingArgs(message, content) {
    return message.channel.send(
      new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setFooter(this.user.username, this.user.displayAvatarURL())
      .setTitle("Missing Arguments")
      .setColor(this.colors.red)
      .setDescription(content))
  }


  async clean(text) {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, {
        depth: 1
      });

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(this.config.token, "mfa.VkO_2G4Qv3T--NOt--lWetW_--A--tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  }

  async resolveUser(search) {
    let userRegex = /^<@!?(\d+)>$/
    let user = null;
    if (!search || typeof search !== "string") return;
    if (search.match(userRegex)) {
      const id = search.match(userRegex)[1];
      user = this.users.fetch(id).catch(() => {});
      if (user) return user;
    }
    user = await this.users.fetch(search).catch(() => {});
    return user;
  }

  async resolveChannel(search) {
    let channelRegex = /^<#(\d+)>$/
    let channel = null;
    if (!search || typeof search !== "string") return;
    if (search.match(channelRegex)) {
      const id = search.match(channelRegex)[1];
      channel = this.channels.fetch(id).catch(() => {});
      if (channel) return channel;
    }
    channel = await this.channels.fetch(search).catch(() => {});
    return channel;
  }

  async resolveRole(search) {
    let roleRegex = /^<&(\d+)>$/
    let role = null;
    if (!search || typeof search !== "string") return;
    if (search.match(roleRegex)) {
      const id = search.match(roleRegex)[1];
      role = this.roles.fetch(id).catch(() => {});
      if (channel) return role;
    }
    role = await this.roles.fetch(search).catch(() => {});
    return role;
  }

  randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async awaitReply(msg, question, limit = 60000) {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, {
        max: 1,
        time: limit,
        errors: ["time"]
      });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };

  wait = require("util").promisify(setTimeout);

}

module.exports = Bot12