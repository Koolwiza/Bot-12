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

module.exports = class Bot12Client extends Client {
  constructor(options) {
    super({

      /**
       * Our Client options
       * @property {ws} - Websocket manager for discord.js
       * Provided Intents property is for discord.js v13
       * @property {restTimeOffset} - Reduce amount of time between multiple REST requests
       */

      restTimeOffset: 250,
      ws: {
        intents: Intents.ALL
      }
    });

    /**
     * Attach useful properties and functions to the extended client
     * @property {logger} - A useful logger for aesthetic logging
     * @property {colors} - An object filled with preset colors used for embeds
     * @property {config} - Our configuration file, tokens, owners, etc . . .
     * @property {emoji} - Close to overwriding 'emojis' property but doesn't. An object filled with emojis useful for general messages
     */

    this.logger = require('../../helpers/logger')
    this.colors = require("../data/colors")
    this.config = require('../data/config')
    this.emoji = require('../data/emojis')

    /**
     * Datatypes that are stored in cache
     * @property {commands} - A collection of the client's commands. Loaded in 'index.js'
     * @property {snipes} - A collection of the recorded snipes. Loaded in 'messageDelete.js'
     * @property {queue} - A Map of the songs used in a server. Loaded in 'Commands/Music'
     */

    this.commands = new Collection()
    this.snipes = new Collection()
    this.queue = new Map()

    /**
     * Our Enmaps
     * @property {guildData} - Stores prefixes, modroles, etc . . .
     * @property {plugins} - Stores enabled plugins of a guild
     * @property {modActions} - Stores the mod actions that were recorded in a server
     * @property {userProfiles} - Stores the user's profiles throughout the bot
     * @property {disabled} - Stores the disabled commands
     * @property {cooldowns} - Stores cooldowns for each command by user
     */

    let enmaps = {
      "guildData":"guild",
      "plugins":"plugin",
      "modActions":"actions",
      "userProfiles":"profiles",
      "disabled":"commands",
      "cooldowns":"cooldowns",
      "tags":"tags"
    }

    for(const [k,v] of Object.entries(enmaps)){
      this[k] = new Enmap({
        name: v,
        fetchAll: true,
        autoFetch: true
      })
    }
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

  modRole(message, data) {
    return (!message.member.permissions.has("BAN_MEMBERS") || (message.guild.roles.cache.get(data.modrole) && !message.member.roles.cache.has(data.modrole)))
  }


  applyText(canvas, text, defaultFontSize) {
    const ctx = canvas.getContext("2d");
    do {
      ctx.font = `${defaultFontSize -= 10}px Bold`;
    } while (ctx.measureText(text).width > 600);
    return ctx.font;
  };

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
  
  async clean(text) {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, {
        depth: 1
      });

    text = text
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
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

      const collect = collected.first()

      return collect.attachments.first() ? collect.attachments.first().proxyURL() : collect.content;
    } catch (e) {
      return false;
    }
  }

  

  wait = require("util").promisify(setTimeout);

}