const Discord = require('discord.js')

module.exports = {
  name: 'rob',
  description: 'Rob a user with money ',
  usage: 'rob',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    let user = await client.resolveUser(args[0])
    if(!user) return client.missingArgs(message, "Please provide a user or invalid user")

    let userP = client.userProfiles.get(user.id)
    if(userP.balance < 1000) return client.error(message, "This user is too poor! You can only rob users with more than 1k coins.")

    let percent = (Math.floor(Math.random() * 50))
    let robA = userP.balance * percent/100

    client.userProfiles.math(user.id, "subtract", robA, "balance")
    client.userProfiles.math(message.author.id, "add", robA, "balance")

    return message.channel.send(client.baseEmbed(message, {
        title: "Rob Successful",
        description: `You got away with ${client.emoji.misc.coin} **${robA}** `,
        color: client.colors.green
    }))
  }
}