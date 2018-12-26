module.exports = {
	triggers: [
		"bal",
		"balance",
		"money"
	],
	userPermissions: [],
	botPermissions: [],
	cooldown: 1e3,
	description: "Check your economy balance",
	usage: "",
	nsfw: false,
	devOnly: true,
	betaOnly: true,
	guildOwnerOnly: false,
	run: (async (client,message) => {
		message.channel.startTyping();
		message.reply(`Your balance is ${client.uConfig.bal}.`);
		return message.channel.stopTyping();
	})
};