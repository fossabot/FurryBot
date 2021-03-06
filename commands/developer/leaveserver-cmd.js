module.exports = {
	triggers: [
		"leaveserver"
	],
	userPermissions: [],
	botPermissions: [],
	cooldown: 0,
	description: "Make the bot leave a server (dev only)",
	usage: "[server id]",
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
		if(!this.guilds.has(message.unparsedArgs[0])) {
			message.reply("Guild not found");
			return message.channel.stopTyping();
		}
		this.guilds.get(message.unparsedArgs[0]).leave().then((guild) => {
			message.reply(`Left guild **${guild.name}** (${guild.id})`);
			return message.channel.stopTyping();
		}).catch((err) => {
			message.channel.send(`There was an error while doing this: ${err}`) ;
			return message.channel.stopTyping();
		});
	})
};