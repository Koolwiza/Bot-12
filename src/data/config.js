module.exports = {
    /**
     * Fill config values with your desired things
     */
    "token": "",
    "google_api_key": "",
    "support":"https://discord.gg/JHJQ4tG2rf",
    "owners": [
        ""
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
        "links": false,
        "invites": false,
        "spoilers": false,
        "deletemodcmds": false,
        "antibots": false,
    },
    "status": [{
            "type": "PLAYING",
            "name": "@{client} 🤖"
        },
        {
            "type": "WATCHING",
            "name": "{guilds} servers"
        }
    ]

    /**
     * Multiple statuses
     * If you only want one, leave one
     * Variable templates include:
     * {client} - Client's username
     * {guilds} - Client's guilds
     * {users} - Client's cached users
     * {channels} - Client's channels
    */
}
