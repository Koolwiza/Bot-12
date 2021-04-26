const Enmap = require('enmap'),
    _ = require('lodash'),
    timeouts = new Enmap({
        name: "timeouts",
        fetchAll: true,
        autoFetch: true
    })

module.exports = class Timeouts {
    constructor(key, time) {
        this.key = key
        this.time = time
    }

    add(callback) {

        let tNow = Date.now()
        if (!timeouts.has(this.key)) {
            timeouts.set(this.key, tNow)
        } else {
            let timeout = this.time
            let time = (timeouts.get(this.key) - Date.now()) + timeout
    
            setTimeout(() => {
                timeouts.delete(this.key)
                if (_.isFunction(callback)) {
                    return callback()
                }
            }, time)
        }
        
    }
}