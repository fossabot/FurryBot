module.exports = (async(self,local)=>{
    local.channel.startTyping();
    if(local.args.length < 1) {
        local.channel.stopTyping();
        return new Error("ERR_INVALID_USAGE");
    }
    var set = local.args.join("%20");
    self.user.setAvatar(set).then((user)=>{
        var attachment = new self.Discord.MessageAttachment(user.displayAvatarURL());
        local.message.reply(`Set Avatar to (attachment)`,attachment);
        return local.channel.stopTyping();
    }).catch((err)=>{
       local.channel.send(`There was an error while doing this: ${err}`) ;
       return local.channel.stopTyping();
    })
})