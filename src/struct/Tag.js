const client = require('../../bot12')

module.exports = class Tag {
    constructor(name, reply, author, guild) {
        this.createdAt = new Date()
        this.aliases = []
        this.lastModified = null
        this.uses = 0

        this.name = name
        this.reply = reply
        this.author = author
        this.guild = guild
    }

    save() {
        client.tags.set(`${this.guild}-${this.name}`, {
            created: this.createdAt,
            aliases: this.aliases,
            modified: this.lastModified,
            reply: this.reply,
            uses: 0,
            tagName: this.name,
            author: this.author,
            guild: this.guild
        })
    }

    static alias(type, key, alias) {
        if (!["add", "create", "remove", "delete"].includes(type)) throw new Error("Please provide a valid type-- add, create, remove, delete")

        if (["add", "create"].includes(type)) {
            client.tags.push(key, alias, "aliases")
        } else if (["remove", "delete"].includes(type)) {

            let b = client.tags.get(key)

            if (!b.aliases.includes(alias)) throw new Error("Tag does not have the alias: " + alias)

            b.aliases.remove(alias)
            client.tags.set(key, b)
        }
    }

    static search(query) {
        return client.tags.find(q => q.name.includes(query))
    }

    static list(msg, user = null) {
        if (!user) {
            return client.tags.filter(c => c.guild === msg.guild.id)
        } else {
            return client.tags.filter(c => c.guild === msg.guild.id && c.author === user.id)
        }
    }

    static delete(message, name) {
        if (!client.tags.get(`${message.guild.id}-${name}`)) throw new TypeError("No value with this key exists")
        client.tags.delete(`${message.guild.id}-${name}`)
    }

    static get(key) {
        return client.tags.get(key)
    }

}