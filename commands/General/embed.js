const Discord = require('discord.js')

module.exports = {
  name: 'embed',
  description: 'Create an embed',
  usage: 'embed',
  aliases: [],
  required: [],
  user: [],
  category: __dirname.split("commands\\")[1],
  
  premium: false,
  guildOnly: false,
  async execute(message, args, client, data) {
    let embedChoices = {
        author: {
            name: "",
            icon_url: "",
            url: ""
        },
        footer: {
            text: "",
            icon_url: ""
        },
        title: "",
        url: "",
        description: "",
        fields: [],
        color: "",
        image: "",
        thumbnail: "",
        timestamp: new Date()
    }

    let prompts = {
        author: [
            "What should the username be?",
            "What should the icon be?",
            "What should the url be?"
        ],
        footer: [
            "What should the text be?",
            "What should the icon be?"
        ],
        title: [
            "What should the title be?"
        ],
        url: [
            "What should the title url be?"
        ],
        description: [
            "What should the description be?"
        ],
        fields: [
            "How many fields should there be? (Max 25)" // Rest prompts filled out later
        ],
        color: [
            "What should the color be?"
        ],
        image: [
            "What should the image be?"
        ],
        thumbnail: [
            "What should the thumbnail be?"
        ]
    }


    let reactionToOption = {
        "😛": "author",
        "🦶": "footer",
        "🗣": "title",
        "🔗":"url",
        "📛":"description",
        "⚽️":"fields",
        "🌈":"color",
        "🖼️":"image",
        "📌":"thumbnail",
        "🖃":"timestamp"
    }

    let embedMsg = `
    **Embed Creator**

    React with the following and answer prompts to determine values for your embed\n    
    `

    for (const [k, v] of Object.entries(reactionToOption)) {
        embedMsg += `${k}: ${v}\n`
    }

    let reactMsg = await message.channel.send(embedMsg)
    const filt = (reaction, user) => Object.keys(reactionToOption).includes(reaction.emoji.name) && user.id === message.author.id
    let collector = reactMsg.createReactionCollector(filt)

    collector.on("collect", async collected => {
        let reaction = collected.emoji
        let prompt = reactionToOption[reaction]

        for(let p in prompt) {
            embedMsg += `\n\n${p}`
            let a = await reactMsg.edit(embedMsg)

            await client.awaitReply()
        }
    })
  }
}