module.exports = {
	triggers: [
		"seticon"
	],
	userPermissions: [],
	botPermissions: [],
	cooldown: 0,
	description: "Change the bots icon (dev only)",
	usage: "<icon url>",
	nsfw: false,
	devOnly: true,
	betaOnly: false,
	guildOwnerOnly: false,
	run: (async function(message) {
		// extra check, to be safe
		if (!this.config.developers.includes(message.author.id)) return message.reply("You cannot run this command as you are not a developer of this bot.");
		message.channel.startTyping();
		if(message.unparsedArgs.length === 0) {
			message.channel.stopTyping();
			return new Error("ERR_INVALID_USAGE");
		}
		let set, attachment;
		set = message.unparsedArgs.join("%20");
		this.user.setAvatar(set).then((user) => {
			attachment = new this.Discord.MessageAttachment(user.displayAvatarURL());
			message.reply("Set Avatar to (attachment)",attachment);
			return message.channel.stopTyping();
		}).catch((err) => {
			message.channel.send(`There was an error while doing this: ${err}`) ;
			return message.channel.stopTyping();
		});
	})
};