module.exports = {
	triggers: [
		"reset",
		"resetguild",
		"resetsettings",
		"resetguildsettings"
	],
	userPermissions: [],
	botPermissions: [],
	cooldown: 36e5,
	description: "Reset guild settings",
	usage: "",
	nsfw: false,
	devOnly: false,
	betaOnly: false,
	guildOwnerOnly: true,
	run: (async function(message) {
		let choice;
		message.channel.send("this will erase ALL guild (server) settings, are you sure you want to do this?\nType **yes** or **no**.");
		message.channel.awaitMessages(m => ["yes","no"].includes(m.content.toLowerCase()) && m.author.id === message.author.id,{max:1,time:6e4,errors:["time"]}).then(async(m) => {
			choice = m.first().content.toLowerCase() === "yes" ? true : false;
			if(!choice) {
				return message.reply("Canceled reset.");
			} else {
				await message.reply(`All guild settings will be reset shortly.\n(note: prefix will be **${this.config.defaultPrefix}**)`);
				this.db.resetGuild(message.guild.id).catch((e) => {
					this.logger.error(e);
					return message.channel.send("There was an internal error while doing this");
				});
			}
		}).catch((e) => {
			if(e instanceof this.Discord.Collection) {
				return message.reply("Timed out.");
			} else {
				this.logger.error(e);
				return message.reply("An unknown error occured, please contact the bot owner.");
			}
		});
		return;
	})
};