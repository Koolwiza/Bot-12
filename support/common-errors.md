
# Common Errors

These are errors you might come across when running the bot, if there are any errors not included in this page, please let me know.

### ffmpeg/avconv not found

As a part of the Music category, it requires ffmpeg, to fix this issue, run the command `npm install ffmpeg-static`.
If you still have an issues after this, let me know

### Can't install enmap
If you are receiving an error saying you can't install quick.db, you might need to install windows build tools.

I am only familiar with using windows so if anyone else knows how to do so using mac/linux, let me know ;)

- Open Windows Powershell using Administrator, and `cd` to your directory. 
- Type the command `npm install windows-build-tools --vs2015 --global`

Afer this, you should be able to run the bot/install enmap

### better_sqlite3.node is not a valid Win32

I'm not too sure what's the cause for this error. 
However running the command `npm rebuild` to uninstall all packages and to install them again seems to do the trick for me.

### Cannot find module <module_name>

Simple, install the module using `npm install <module_name>`

**Other errors will be supported, let me know by DM'ing me on Discord: Kool#7867**
