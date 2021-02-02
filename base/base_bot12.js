const {
    Client,
    Collection
} = require('discord.js'),
    Discord = require('discord.js'), {
        inspect
    } = require('util'),
    Enmap = require('enmap')

class Bot12 extends Client {
    constructor(options) {
        super({
            restTimeOffset: 250
        });
        this.logger = require('../Modules/logger')
        this.colors = require("../data/colors.json")
        this.config = require('../data/config.json')
        this.emoji = require('../data/emojis.json')

        this.commands = new Collection()
        this.snipes = new Collection()

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
    }

    error(message, err) {
        const errorEmbed = new Discord.MessageEmbed()
            .setTitle("An unexpected error occured")
            .setDescription(`\`\`\`${err}\`\`\``)
            .setColor(this.colors.red)
            .setFooter(this.user.username, this.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
        message.channel.send(errorEmbed)
    }

    authorPerms(message, perms) {
        let a = typeof perms === Array ? perms.join(", ") : perms

        const errorEmbed = new Discord.MessageEmbed()
            .setTitle("You don't have permission to execute this comamnd")
            .setDescription(`**Permission(s) Needed: **${a}`)
            .setColor(this.colors.red)
            .setFooter(this.user.username, this.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
        message.channel.send(errorEmbed)
    }

    clientPerms(message, perms) {
        let p = typeof perms === Array ? perms.join(', ') : perms

        const errorEmbed = new Discord.MessageEmbed()
            .setTitle("I don't have permission to execute this comamnd")
            .setDescription(`**Permission(s) Needed: **${p}`)
            .setColor(this.colors.red)
            .setFooter(this.user.username, this.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
        message.channel.send(errorEmbed)
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
        message.channel.send(
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
        let user = null;
        if (!search || typeof search !== "string") return;
        // Try ID search
        if (search.match(/^<@!?(\d+)>$/)) {
            const id = search.match(/^<@!?(\d+)>$/)[1];
            user = this.users.fetch(id).catch(() => {});
            if (user) return user;
        }
        user = await this.users.fetch(search).catch(() => {});
        return user;
    }


    awaitReply = async (msg, question, limit = 60000) => {
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