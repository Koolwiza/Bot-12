const {
    MessageEmbed
} = require('discord.js')
const BaseMessage = require('./AntiSpamMessage'),
    Timeout = require('../Timeouts'),
    BaseAntiSpam = require('./BaseAntiSpam')

let msgs = []

module.exports = class AntiSpam extends BaseAntiSpam {
    constructor(options = {}) {
        super()
        this.options = {
            muteThreshold: options.mute || 6,
            kickThreshold: options.kick || 9,
            banThreshold: options.ban || 15, // Number of spammed messages

            spamMsgsInterval: options.interval || 10000,

            muteRole: options.muteRole || "", // ID
            muteLength: options.muteLength || 60 * 60 * 1000,
            enabled: options.enabled || false
        }
    }

    async init(message, client) {
        let {
            options
        } = this,
        baseMsg = new BaseMessage(message, client)

        if (!options.enabled) return;

        msgs.push(baseMsg)
        let filteredMsgs = msgs.filter(c => c.author === message.author.id && c.guild === message.guild.id)
        let duplicates = filteredMsgs.filter(c => c.content === baseMsg.content && c.timestamp > (baseMsg.timestamp - options.spamMsgsInterval))

        if (duplicates.length > options.banThreshold) { // threshold
            msgs = this.removeMessages(duplicates, message.channel, msgs).catch(e => {
                client.logger.error(e)
            })
            await message.member.send(
                new MessageEmbed()
                .setTitle("Anti Spam")
                .setDescription(`You were banned from ${message.guild.name} for spamming`)
                .default(message.member.user)
                .success()
            )
            return await message.guild.members.ban(message.member, {
                reason: "Exceeded spammed messages threshold, resulted in banning"
            }).catch(e => {
                client.logger.error(e)
            })
        } else if (duplicates.length > options.kickThreshold) {
            msgs = this.removeMessages(duplicates, message.channel, msgs)
            await message.member.send(
                new MessageEmbed()
                .setTitle("Anti Spam")
                .setDescription(`You were kicked from ${message.guild.name} for spamming`)
                .default(message.member.user)
                .success()
            )
            return await message.member.kick("Exceeded spammed messages threshold, resulted in kicking").catch(e => {
                client.logger.error(e)
            })
        } else if (duplicates.length > options.muteThreshold) {
            if (!message.guild.roles.cache.get(options.muteRole)) return
            msgs = this.removeMessages(duplicates, message.channel, msgs)

            await message.member.roles.add(options.muteRole).catch(e => {
                client.logger.error(e)
            })

            await message.member.send(
                new MessageEmbed()
                .setTitle("Anti Spam")
                .setDescription(`You were muted from ${message.guild.name} for spamming`)
                .default(message.member.user)
                .success()
            ).catch(e => client.logger.error(e))

            new Timeout(`${message.author.id}_antispam`, options.muteLength).add(async () => {
                await message.member.roles.remove(options.muteRole).catch(e => {
                    client.logger.error(e)
                })
            })
        }

    }
}