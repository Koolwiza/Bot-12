const Discord = require('discord.js')
const Enmap = require('enmap')
const humanize = require('humanize-duration')
const client = require('../../bot12')

module.exports = class AntiAlt {
    constructor(client) {
        this.client = client
    } 
    /**
     * 
     * @param {Discord.GuildMember} member 
     * @returns {*}
     */

    async start(member) { // Can only be used in the guildMemberAdd event

        let data = this.client.antiAlt.ensure(member.guild.id, {
            ...this.client.config.antiAltSettings
        })
        if(!data.enabled) return;

        if(data.whitelisted.includes(member.user.id) && !member.user.avatarURL()) return;
    
        let dataAge = data.age * 24 * 60 * 60 * 1000
    
        let minAge = Date.now() + dataAge
        let userCreate = member.user.createdTimestamp
    
        if (userCreate < minAge) {
            let userTime = humanize(Date.now() - userCreate, {
                conjunction: " and ",
                serialComma: false
            })
    
            let ageTime = humanize(dataAge, {
                conjunction: " and ",
                serialComma: false
            })
    
            let neededTime = humanize(minAge - userCreate, {
                conjunction: " and ",
                serialComma: false
            })
    
            await member.user.send(new Discord.MessageEmbed()
                .setTitle("Anti Alt")
                .setDescription(`You were **${data.punishment === "kick" ? "kicked" : "banned"}** from ${member.guild.name}.\nMinimum Account Age: ${ageTime}\nYour Account Age: ${userTime}. \n\n*PS. Your account needs to be ${neededTime} older!*`)
                .error()
                .default(member.user)
            )

            let channel = member.guild.channels.cache.get(data.log)
            
            if(channel) await channel.send(new Discord.MessageEmbed()
                .setTitle("New Alt")
                .setDescription(`**${member.user.tag}** joined the server.\nI have **${data.punishment === "kick" ? "kicked" : "banned"}** them.\nAccount Age: ${userTime} old`)
                .error()
                .default(member.user)
                )
    
            if (data.punishment.toLowerCase() === "kick") {
                await member.kick('Did not meet account age requirement: ' + ageTime).catch(async e => {
                    let ch = member.guild.channels.cache.get(data.logs)
                    await ch.send(
                        new Discord.MessageEmbed()
                        .setTitle("Error!")
                        .setDescription(`:warning: I had an error kicking ${member ?? member.user.tag}`)
                        .error()
                        .default(member.user)
                    )
                })
            } else if (data.punishment.toLowerCase() === "ban") {
                member.guild.members.ban(member, {
                    reason: "Did not meet account age requirement: " + ageTime
                }).catch(async e => {
                    let ch = member.guild.channels.cache.get(data.logs)
                    await ch.send(
                        new Discord.MessageEmbed()
                        .setTitle("Error!")
                        .setDescription(`:warning: I had an error banning ${member ?? member.user.tag}`)
                        .error()
                        .default(member.user)
                    )
                })
            }
        }
    }
}