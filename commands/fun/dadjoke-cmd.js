module.exports = {
	triggers: [
		"dadjoke",
		"joke"
	],
	userPermissions: [],
	botPermissions: [],
	cooldown: 4e3,
	description: "Get a dadjoke!",
	usage: "",
	nsfw: false,
	devOnly: false,
	betaOnly: false,
	guildOwnerOnly: false,
	run: (async (client,message) => {
		message.channel.startTyping();
		var req = await client.request("https://icanhazdadjoke.com",{
			headers:{
				Accept:"application/json",
				"User-Agent": client.config.web.userAgent
			}
		});
	
		var j = JSON.parse(req.body);
	
		message.channel.send(j.joke);
		return message.channel.stopTyping();
	})
};