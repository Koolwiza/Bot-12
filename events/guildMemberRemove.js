const chalk = require('chalk')
const {
    defaultPlugins,
    defaultSettings
} = require('../data/config.json')
const Discord = require('discord.js')

module.exports = async (client, member) => {

    let pd = client.plugins.ensure(member.guild.id, defaultPlugins)
    let gd = client.guildData.ensure(member.guild.id, defaultSettings)

    if (pd.leavemessages) {
        let channel = member.guild.channels.cache.get(gd.leavechannel)

        if (channel) {
            let msg = gd.leavemessage
                .replace(/{member:mention}/g, member.toString())
                .replace(/{member:name}/g, `${member.user.username}`)
                .replace(/{member:id}/g, `${member.user.id}`)
                .replace(/{member:tag}/g, `${member.user.tag}`)
                .replace(/{member:createdAt}/g, `${member.user.createdAt}`)
                .replace(/{server:name}/g, `${member.guild.name}`)
                .replace(/{server:members}/g, `${member.guild.memberCount}`)

            channel.send(msg)
        }
    }
}