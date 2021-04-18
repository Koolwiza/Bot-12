const { MessageEmbed } = require('discord.js')
const ms = require('ms');
module.exports = {
        name: "end",
        description: "Ending giveaway",
        accessableby: "Administrator",
        category: "giveaway",
        aliases: ["giveaway-end"],
        usage: '<giveawaymessageid>',
         premium: false,
         guildOnly: false,
         async execute(message, args, client, data) {
      if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
return client.authorPerms(message, "Manage messages or role 'Giveaways'")
    }

    // If no message ID or giveaway name is specified
    if(!args[0]){
if(!args[0]) return message.args("Please specify a message ID")
    }

    // try to found the giveaway with prize then with ID
    let giveaway = 
    // Search with giveaway prize
client.giveawaysManager
    // Search with giveaway ID
    bot.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // If no giveaway was found
    if(!giveaway){
return message.error(`Unable to find a giveaway for \`${args.join(" ")}\``)
    }

    // Edit the giveaway
    bot.giveawaysManager.edit(giveaway.messageID, {
        setEndTimestamp: Date.now()
    })
    // Success message
    .then(() => {
        // Success message
        message.channel.send('Giveaway will end in less than '+(bot.giveawaysManager.options.updateCountdownEvery/1000)+' seconds...');
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is already ended.`)){
message.error("This giveaway is already ended")
        } else {
client.logger.error(e)
message.error("An error occured. Please try again!")
        }
    });
    }
}
