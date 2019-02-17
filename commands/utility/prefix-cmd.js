module.exports = {
	triggers: [
		"prefix",
		"setprefix"
	],
	userPermissions: [
		"MANAGE_GUILD"
	],
	botPermissions: [],
	cooldown: 3e3,
	description: "Change the bots prefix for message.client guild (server)",
	usage: "<new prefix>",
	nsfw: false,
	devOnly: false,
	betaOnly: false,
	guildOwnerOnly: false,
	run: (async(message) => {
		if(message.args.length === 0) return new Error("ERR_INVALID_USAGE");
		if(message.args[0].length === 0 || message.args[0].length > 30) return message.reply("Prefix must be between 1 and 30 characters.");
		await message.client.db.updateGuild(message.guild.id,{prefix:message.args[0].toLowerCase()});
		return message.reply(`Set message.client guilds prefix to ${message.args[0].toLowerCase()}, you can view the current prefix at any time by typing \`whatismyprefix\`, or mentioning me!`);
	})
};