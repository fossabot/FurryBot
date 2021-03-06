module.exports = {
	triggers: [
		"bulge",
		"bulgie"
	],
	userPermissions: [],
	botPermissions: [],
	cooldown: 3e3,
	description: "*notices bulge* OwO",
	usage: "",
	nsfw: true,
	devOnly: false,
	betaOnly: false,
	guildOwnerOnly: false,
	run: (async function(message) {
		message.channel.startTyping();
		let img, attachment, short, extra;
		img = await this.imageAPIRequest(false,"bulge",true,false);
		if(img.success !== true) {
			this.logger.error(img);
			return message.reply(`API Error:\nCode: ${img.error.code}\nDescription: \`${img.error.description}\``);
		}
		attachment = new this.Discord.MessageAttachment(img.response.image);
		short = await this.shortenUrl(img.response.image);
		extra = short.new ? `**this is the first time this has been viewed! Image #${short.linkNumber}**\n\n` : "";
		message.channel.send(`${extra}Short URL: <${short.link}>\n\nRequested By: ${message.author.tag}`,attachment);
		return message.channel.stopTyping();
	})
};