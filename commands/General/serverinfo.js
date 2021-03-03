const Discord = require('discord.js'),
    ms = require('ms')
fetch = require('node-fetch'), {
        format
    } = require('date-fns'),
    moment = require('moment')

module.exports = {
    name: 'serverinfo',
    description: 'Get detailed information about the server',
    usage: 'serverinfo',
    aliases: ['server', 'guild'],
    required: [],
    user: [],
    category: __dirname.split("commands\\")[1],

    premium: false,
    guildOnly: false,
    async execute(message, args, client, data) {

        let flags = {
            'dubai': "<:flag_db:801544606730813490>",
            "frankfurt": ":flag_de:",
            "london": ":flag_gb:",
            "amsterdam": ":flag_nl:",
            "india": ":flag_in:",
            "japan": ":flag_jp:",
            "russia": ":flag_ru:",
            "hong_kong": ":flag_hk:",
            "brazil": ':flag_br:',
            "europe": ":flag_eu:",
            "sydney": ":flag_au:",
            "south_africa": ":flag_za:",
            "singapore": ":flag_sg:",
            "us": ":flag_us:"
        }


        let guildRegion = message.guild.region
            .replace(/us-west/gi, `${flags.us} US West`)
            .replace(/us-east/gi, `${flags.us} US West`)
            .replace(/us-central/gi, `${flags.us} US West`)
            .replace(/us-south/gi, `${flags.us} US West`)
            .replace(/singapore/gi, `${flags.singapore} Singapore`)
            .replace(/southafrica/gi, `${flags.south_africa} South Africa`)
            .replace(/sydney/gi, `${flags.sydney} Sydney`)
            .replace(/europe/gi, `${flags.europe} Europe`)
            .replace(/brazil/gi, `${flags.brazil} Brazil`)
            .replace(/hongkong/gi, `${flags.hong_kong} Hong Kong`)
            .replace(/russia/gi, `${flags.russia} Russia`)
            .replace(/japan/gi, `${flags.japan} Japan`)
            .replace(/india/gi, `${flags.india} India`)
            .replace(/dubai/gi, `${flags.dubai} Dubai`)
            .replace(/amsterdam/gi, `${flags.amsterdam} Amsterdam`)
            .replace(/london/gi, `${flags.london} London`)
            .replace(/frankfurt/gi, `${flags.frankfurt} Frankfurt`)
            .replace(/eu-central/gi, `${flags.europe} Central Europe`)
            .replace(/eu-west/gi, `${flags.europe} Western Europe`)

        let guildFeatures = message.guild.features.join("\n")
            .replace(/animated_icon/ig, `${client.emoji.misc.check}Animated Icon`)
            .replace(/banner/ig, `${client.emoji.misc.check}Banner`)
            .replace(/commerce/ig, `${client.emoji.misc.check}Commerce`)
            .replace(/community/ig, `${client.emoji.misc.check}Community`)
            .replace(/discoverable/ig, `${client.emoji.misc.check}Discoverable`)
            .replace(/featurable/ig, `${client.emoji.misc.check}Featurable`)
            .replace(/invite_splash/ig, `${client.emoji.misc.check}Invite Splash`)
            .replace(/news/ig, `${client.emoji.misc.check}News`)
            .replace(/partnered/ig, `${client.emoji.misc.check}Partnered`)
            .replace(/relay_enabled/ig, `${client.emoji.misc.check}Relay Enabled`)
            .replace(/vanity_url/ig, `${client.emoji.misc.check}Vanity Link`)
            .replace(/verified/ig, `${client.emoji.misc.check}Verified`)
            .replace(/vip_regions/ig, `${client.emoji.misc.check}VIP Regions`)
            .replace(/welcome_screen_enabled/ig, `${client.emoji.misc.check}Welcome Screen Enabled`)


        let guildCreatedAt = moment(message.guild.createdAt).format("lll")
        let guildCreatedAtFromNow = moment(message.guild.createdAt, 'YYYYMMDD').fromNow()
        let afkChannel = message.guild.afkChannel ? message.guild.afkChannel : "None"
        let guildDescription = message.guild.description ? message.guild.description : "None"
        let guildName = message.guild.name
        let guildIcon = message.guild.iconURL({
            dynamic: true
        })
        let guildBanner = message.guild.banner ? message.guild.banner : ""

        let roleSize = message.guild.roles.cache.size
        let emojiSize = message.guild.emojis.cache.size
        let channelSize = message.guild.channels.cache.size
        let textChannels = message.guild.channels.cache.filter(c => c.type === "text").size
        let voiceChannels = message.guild.channels.cache.filter(c => c.type === "voice").size

        let guildMemberCount = message.guild.memberCount
        let guildOwner = await message.guild.members.fetch(message.guild.ownerID)
        let fetchedMembers = await message.guild.members.fetch()

        let onlineMembers = fetchedMembers.filter(c => c.presence.status === "online").size,
            offlineMembers = fetchedMembers.filter(c => c.presence.status === "offline").size,
            dndMembers = fetchedMembers.filter(c => c.presence.status === "dnd").size,
            idleMembers = fetchedMembers.filter(c => c.presence.status === "idle").size,
            bots = fetchedMembers.filter(c => c.user.bot).size,
            humans = fetchedMembers.filter(c => !c.user.bot).size


        let embed = new Discord.MessageEmbed()

            .setColor(client.colors.discord)
            .setTitle(message.guild.name)
            .setThumbnail(guildIcon)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`*${guildDescription}*`)
            .addField("Members:", `**${guildMemberCount} Members**
        🤖 ${bots} Bots
        👋 ${humans} Humans`, true)
            .addField(`Presences:`, `
        ${client.emoji.presence.online}${onlineMembers} Online
        ${client.emoji.presence.offline}${offlineMembers} Offline
        ${client.emoji.presence.dnd}${dndMembers} DND
        ${client.emoji.presence.idle}${idleMembers} Idle`, true)
            .addField("Guild:", `
        :id: Guild: ${guildName}
        🕰️Created At: ${guildCreatedAt} (${guildCreatedAtFromNow})
        👑Owner: [${guildOwner}](https://discord.com/users/${message.guild.ownerID} 'ID: ${message.guild.ownerID}.\nCreated At: ${guildOwner.user.createdAt}')
        📍Region: ${guildRegion}
        ⌨️ AFK Channel: ${afkChannel}
        `, true)
            .addField("Server Features", guildFeatures, true)
            .addField("Misc", `
            ${client.emoji.server.role}${roleSize} Roles
            ${channelSize} **Channels**:
            ${client.emoji.server.text} ${textChannels} Text Channels
            ${client.emoji.server.vc} ${voiceChannels} Voice Channels
            🙂 ${emojiSize} Emojis`, true)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setImage(guildBanner)
        return message.channel.send(embed)



    }
}