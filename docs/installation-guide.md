# Installation Guide

## Before you begin

**1.** Please ensure you have [Node.js](https://nodejs.org/en/download/) v12 (14 if you're using discord.js/master) or higher and Git

**2.** Run the command `git clone https://www.github.com/Koolwiza/Bot-12`

**3.** `cd` to the directory


## Fill config file

```
{
    "token": "",
    "google_api_key": "",
    "owners": [
        "",
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
        "antibots": false
    }
}
```
IF google api key is not provided/invalid, google command does not execute

## Dependencies

 - Fill the emoji file [here](https://github.com/Koolwiza/Bot-12/blob/main/data/emojis.json)
 - Install all needed libraries: `npm i`

> To verify, run the command `node scripts/verify.js`
 
 ## Launch the bot

Node
 - `node bot12.js`

PM2
 - `npm install pm2 -g`
 - `pm2 start bot12.js`

Nodemon
 - `npm install nodemon -g`
 - `nodemon bot12.js`
 
 > :warning: NOTE 
 > IF THERE ARE ANY ERRORS, PLEASE HEAD TO [COMMON-ERRORS](https://github.com/Koolwiza/Bot-12/blob/main/docs/common-errors.md) BEFORE ASKING ME
