  const Discord = require('discord.js')

  module.exports = {
      name: 'ban',
      description: 'Ban a member from the server',
      usage: 'ban <user> [reason]',
      aliases: [],
      required: ['BAN_MEMBERS'],
      user: ['BAN_MEMBERS'],
      category: __dirname.split("commands\\")[1],

      premium: false,
      guildOnly: false,
      async execute(message, args, client, data) {
          if (!message.member.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS) || client.modRole(message, data.guild)) return client.authorPerms(message, ["BAN_MEMBERS"])
          if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) return client.clientPerms(message, ["BAN_MEMBERS"])


          let user = await client.resolveUser(args[0])

          if (!user) return message.args("Please provide a user to ban!\n```@user or userID```")
          if (user.id === message.author.id) return message.error("You can't ban yourself")

          let a = await message.guild.members.fetch(user.id).catch(c => {})
          if (a.roles.highest.position >= message.guild.me.roles.highest.position) return message.error("Provided member has equal or higher role than me.")

          let reason = args.slice(1).join(" ")
          if (!reason) reason = "No reason provided"

          try {
              let member = await message.guild.members.fetch(user.id).catch(c => {})
              await user.send(`**${client.emoji.misc.xmark} You have been banned from ${message.guild.name} for ${reason}**`)
              await message.guild.members.ban(member, {
                  reason: reason,
                  days: 7
              })
              return message.sendE("Success", `I have banned ${user.tag} | ${reason}`, client.colors.green)
          } catch (err) {
              client.logger.log(`There was an error banning ${user.username}.\n${err}`, "error")
              message.error("There was an error banning this user, please try again")
          }
      }
  }