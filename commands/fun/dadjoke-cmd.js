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
	run: (async function(message) {
		message.channel.startTyping();
		let req, j;
		req = await this.request("https://icanhazdadjoke.com",{
			headers:{
				Accept:"application/json",
				"User-Agent": this.config.web.userAgent
			}
		});
	
		j = JSON.parse(req.body);
	
		message.channel.send(j.joke);
		return message.channel.stopTyping();
	})
};