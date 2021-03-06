module.exports = {
	triggers: [
		"ping",
		"pong"
	],
	userPermissions: [],
	botPermissions: [],
	cooldown: .5e3,
	description: "Get the bots ping",
	usage: "",
	nsfw: false,
	devOnly: false,
	betaOnly: false,
	guildOwnerOnly: false,
	run: (async function(message) {
		message.channel.startTyping();
		let m = await message.channel.send("Checking Ping..");
		m.edit("Ping Calculated!");
		m.delete().catch(noerr => null);
		message.channel.send(`Bot Ping: ${(m.createdTimestamp - message.createdTimestamp)}ms${"\n"}API Ping: ${Math.round(this.ws.ping)}ms`);
		return message.channel.stopTyping();
	})
};