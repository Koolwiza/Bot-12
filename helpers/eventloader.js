const glob = require('glob'), fs = require('fs')

module.exports = async (client, path) => {


  function getEvents(dir = "") {
      return new Promise((resolve, reject) => {
          if(dir.length === 0) return reject("Error: provide directory to look in")
          if(!fs.existsSync(dir)) return reject("Error: directory does not exist")

        glob(`${dir}/*.js`, (err, files) => {
          if(err) return reject(err)
          let eventF = files.map(c => '../' + c)
          return resolve(eventF)
        })
      }) 
  }  

  let evtFiles = await getEvents(path).catch(err => {
    console.error(err)
    process.exit(1)
  })
    


  client.logger.log(`Loading a total of ${evtFiles.length} events.`)
  evtFiles.forEach(file => {
    const eventName = file.slice(10).split(".")[0];
    const event = require(file);
    client.on(eventName, event.bind(null, client));
  });

}