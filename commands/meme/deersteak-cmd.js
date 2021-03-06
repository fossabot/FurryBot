module.exports = {
	triggers: [
		"deersteak",
		"deer_steak"
	],
	userPermissions: [],
	botPermissions: [
		"ATTACH_FILES"
	],
	cooldown: 5e3,
	description: "this is an old meme of ours, carried down for months.",
	usage: "[@user]",
	nsfw: false,
	devOnly: false,
	betaOnly: false,
	guildOwnerOnly: false,
	run: (async function(message) {
		if(!this.config.beta) message.reply("temporarily disabled");
		message.channel.startTyping();
		let image, profile, d, time, i, attachment, messageAttachment;
		image = await this.fsn.readFile(`${process.cwd()}/images/deersteak.png`);
		await this.download(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,`${this.config.rootDir}/tmp/${message.author.id}.png`);
		profile = await this.fsn.readFile(`${process.cwd()}/tmp/${message.author.id}.png`);
		
		d = new Date();
		time = d.getHours() < 10?d.getMinutes() < 10?`0${d.getHours()}:0${d.getMinutes()}`:`0${d.getHours()}:${d.getMinutes()}`:`${d.getHours()}:${d.getMinutes()}`;
		
		i = new this.Canvas(376, 79)
			.addImage(profile, 1, 12, 50, 50)
			.addImage(image, 0, 0, 376, 79)
			.setColor("#36393F")
			.addRect(74, 16, 196, 22)
			.addRect(268, 18, 370, 24)
			.setColor("#555E5D")
			.setTextFont("0.75em Whitney")
			.addText(`Today at ${time}`, 253, 33)
			.setColor("#FFF")
			.addText(message.member.displayName, 77, 33)
			.toBufferAsync();
			
		attachment = new messageAttachment(i);
		
		message.channel.send(`Here you go!\n(this is an inside joke from ${this.users.fetch("185938944460980224").tag} <https://assets.mcprocdn.com/images/deersteak.png>)`,attachment);
		return message.channel.stopTyping();
	})
};