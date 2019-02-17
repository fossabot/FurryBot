module.exports = {
	triggers: [
		"sniff"
	],
	userPermissions: [],
	botPermissions: [],
	cooldown: 2e3,
	description: "Sniff.. someone?",
	usage: "<@user/text>",
	nsfw: false,
	devOnly: false,
	betaOnly: false,
	guildOwnerOnly: false,
	run: (async(message) => {
		if(message.args.length === 0) return new Error("ERR_INVALID_USAGE");
		let input, text;
		input = message.args.join(" ");
		text = message.client.varParse(message.c,{author:message.author,input:input});
		message.channel.send(text);
	})
};