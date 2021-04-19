module.exports = {
    /**
     * Fill config values with your desired things
     */
    "token": "",
    "google_api_key": "",
    "support": "https://discord.gg/JHJQ4tG2rf",
    "owners": [
        "774352602678558790",
        "660552441166823462"
    ],
    "defaultSettings": {
        "prefix": "^",
        "joinchannel": null,
        "joinmessage": "Welcome to the server {member:mention}! We are now at {server:members} members!",
        "leavechannel": null,
        "leavemessage": "{member:mention} left the server... We are down to {server:members} members",
        "modrole": null
    },
    "defaultPlugins": {
        "welcomemessages": false,
        "deletemodcmds": false,
        "antibots": false,
    },
    "userData":{
        "premium":false,
        "inventory":{
            "fishing_rod":0,
            "hunting_rifle":0,
            "fish":0,
            "animals":0
        },
        "balance":0,
    },
    "shop":{
        "Fishing Rod": 25000,
        "Hunting Rifle": 25000,
        "Premium": 100000,
    },
    "market":{
        "fish":250,
        "animals":350
    },
    "plugins": { // IF YOU CHANGE ANY OF THESE VALUES, THEY WILL BE APPLIED TO NEWLY ADDED GUILDS
        "defaultAntiAlt": {
            "age": 30, // Days
            "punishment": "kick",
            "whitelisted": [],
            "log": "",
            "enabled":false
        },
        "defaultAutoMod": {
            "links": false,
            "invites": false,
            "spoilers": false,
            "largemsgs": false,
        },
        "defaultAntiSpam":{
            "enabled":false,
            "muteThreshold":  6,
            "kickThreshold": 9,
            "banThreshold": 15, // Number of spammed messages
            "spamMsgsInterval": 10000, // 10 seconds
            "muteRole": "", // ID
            "muteLength": 60 * 60 * 1000 // Mute for 1h
        }
    },
    "status": [{
            "type": "PLAYING",
            "name": "@{client} 🤖"
        },
        {
            "type": "WATCHING",
            "name": "{guilds} servers"
        }, {
            "type": "WATCHING",
            "name": "{users} users"
        }
    ]

    /* 
      Multiple statuses
      If you only want one, leave one
      Variable templates include:
      {client} - Client's username
      {guilds} - Client's guilds
      {users} - Client's cached users
      {channels} - Client's channels
     */
}