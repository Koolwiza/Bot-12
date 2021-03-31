module.exports = class BaseAntiSpam {

    removeMessages (messages, channel, cache) {
        channel.bulkDelete(messages.filter(c => c.deletable))
        return this.removeFromCache(messages, cache)

    }

    removeFromCache(messages, cache) {
        let tempCache = []
        for(const v of cache) {
            if(!messages.includes(v)) tempCache.push(v)
        }
        return tempCache
    }
}   