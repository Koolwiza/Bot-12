module.exports = async (client, reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(reaction.message.author.id !== client.user.id || user.id === client.user.id) return;
    if(reaction.emoji.name === '🗑️') reaction.message.delete()
}