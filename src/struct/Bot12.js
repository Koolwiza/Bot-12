const {
  Client,
  Collection,
  User,
  GuildChannel,
  MessageEmbed
} = require('discord.js'),
  Discord = require('discord.js'), {
    inspect
  } = require('util'),
  Enmap = require('enmap')

Discord.Constants.DefaultOptions.ws.properties.$browser = "Discord Android"

/**
 * A class used to attach functions and properties to the main client provided by discord
 * @extends {Client}
 */

module.exports = class Bot12 extends Client {
  constructor(options) {
    super(options);

    /**
     * Attach useful properties and functions to the extended client
     * @property {function} logger A useful logger for aesthetic logging
     * @property {object} colors An object filled with preset colors used for embeds
     * @property {object} config Our configuration file, tokens, owners, etc . . .
     * @property {object} emoji Close to overwriding 'emojis' property but doesn't. An object filled with emojis useful for general messages
     */

    this.logger = require('../../helpers/logger')
    this.colors = require("../data/colors")
    this.config = require('../data/config')
    this.emoji = require('../data/emojis')

    /**
     * Datatypes that are stored in cache
     * @property {Collection} commands - A collection of the client's commands. Loaded in 'index.js'
     */

    this.commands = new Collection()
    this.guildData = new Enmap({
      name: "guildData",
      fetchAll: true,
      autoFetch: true,
      ensureProps: true
    })
    this.plugins = new Enmap({
      name: "plugins",
      fetchAll: true,
      autoFetch: true,
      ensureProps: true
    })
    this.modActions = new Enmap({
      name: "actions",
      fetchAll: true,
      autoFetch: true,
      ensureProps: true
    })
    this.userProfiles = new Enmap({
      name: "profiles",
      fetchAll: true,
      autoFetch: true,
      ensureProps: true
    })
    this.disabled = new Enmap({
      name: "disabled",
      fetchAll: true,
      autoFetch: true,
      ensureProps: true
    })
    this.cooldowns = new Enmap({
      name: "cooldowns",
      fetchAll: true,
      autoFetch: true,
      ensureProps: true
    })
    this.tags = new Enmap({
      name: 'tags',
      fetchAll: true,
      autoFetch: true,
      ensureProps: true
    })
    this.antiAlt = new Enmap({
      name: 'antialt',
      fetchAll: true,
      autoFetch: true,
      ensureProps: true
    })
    this.autoMod = new Enmap({
      name: 'automod',
      fetchAll: true,
      autoFetch: true,
      ensureProps: true
    })
    this.antiSpam = new Enmap({
      name: 'antispam',
      fetchAll: true,
      autoFetch: true,
      ensureProps: true
    })
    this.joins = new Enmap({
      name: 'joins',
      fetchAll: true,
      autoFetch: true,
      ensureProps: true
    })
  }

  /**
   * 
   * @param {object} message The discord.js message object
   * @param {(string[] | string)} perms An array of permission strings or a permission string
   * @returns {Promise<Discord.Message>} Promise of TextChannel#send
   */

  authorPerms(message, perms) {
    let a = Array.isArray(perms) ? perms.join(", ") : perms

    const errorEmbed = new Discord.MessageEmbed()
      .setTitle("You don't have permission to execute this comamnd")
      .setDescription(`**Permission(s) Needed: **${a}`)
      .setColor(this.colors.red)
      .setFooter(this.user.username, this.user.displayAvatarURL())
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
    return message.channel.send(errorEmbed)
  }

  /**
   * 
   * @param {object} message The discord.js message object 
   * @param {string[]} perms An array of permission strings or a permission string
   * @returns {Promise<Discord.Message>} Promise of TextChannel#send
   */

  clientPerms(message, perms) {
    let p = Array.isArray(array) ? perms.join(', ') : perms

    const errorEmbed = new Discord.MessageEmbed()
      .setTitle("I don't have permission to execute this comamnd")
      .setDescription(`**Permission(s) Needed: **${p}`)
      .setColor(this.colors.red)
      .setFooter(this.user.username, this.user.displayAvatarURL())
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
    return message.channel.send(errorEmbed)
  }

  /**
   * 
   * @param {Discord.Message} message The discord.js message object
   * @param {object} data The data for the guild
   * @returns {boolean} Whether the person has the mod role of that guild or not
   */

  modRole(message, data) {

    if (!data.modrole) {
      return true
    } else {
      let mod = (message.guild.roles.cache.get(data.modrole) && !message.member.roles.cache.has(data.modrole))
      return mod
    }

  }

  /**
   * 
   * @param {object} canvas The canvas constructor
   * @param {string} text The string you want to apply
   * @param {number} defaultFontSize The default font size of the text
   * @returns {string} The string resolvable of canvas fonts
   */
  applyText(canvas, text, defaultFontSize) {
    const ctx = canvas.getContext("2d");
    do {
      ctx.font = `${defaultFontSize -= 10}px Bold`;
    } while (ctx.measureText(text).width > 600);
    return ctx.font;
  };

  /**
   * 
   * @param {Discord.Message} msg The discord.js message object
   * @param {object} object The rest of the Discord#MessageEmbed object
   * @returns {MessageEmbed} The object for a Discord#MessageEmbed
   */
  baseEmbed(msg, object) {
    let authorObject = {
      name: msg.author.tag,
      icon_url: msg.author.displayAvatarURL()
    }
    let footerObject = {
      text: this.user.username,
      icon_url: this.user.displayAvatarURL()
    }
    return new Discord.MessageEmbed({
      embed: {
        author: authorObject,
        footer: footerObject,
        ...object
      }
    })
  }

  /**
   * 
   * @param {string} text The string needed to "clean" e.g replacing secrets
   * @returns {string} The cleaned string
   */

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

  /**
   * 
   * @param {number} [length=6] The length of the randomly generated string. Defaulted at 6
   * @returns {string} A randomly generated string with the length of that number
   */

  randomString(length = 6) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   *  
   * @param {string} search The mentioned string
   * @returns {User} A user object
   */

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

  /**
   * 
   * @param {string} search The mentioned channel
   * @returns {GuildChannel} A channel object
   */

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

  /**
   * 
   * @param {Discord.Message} msg The discord.js message object
   * @param {string} question The question needed to prompt
   * @param {number} limit How long it the discord.js collector should wait
   * @returns {string} The collected string
   */

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

  /**
   * 
   * @param {Discord.Message} message A message object
   * @returns {(Discord.MessageAttachment|Discord.MessageAttachment|Array)}
   */

  parseMessage(message) {
    let embeds = message.embeds?.length
    let attachments = message.attachments?.first()
    let data = embeds ? {
      embed: true,
      data: new MessageEmbed(message.embeds[0])
    } : attachments ? {
      attachment: true,
      data: attachments.proxyURL
    } : message.content
    return data
  }

  /**
   * @returns {Promise<Function>} When the setTimeout is resolved
   */
  wait = require("util").promisify(setTimeout);

}