module.exports = {
	triggers: [
		"mute",
		"m"
	],
	userPermissions: [
		"MANAGE_GUILD"
	],
	botPermissions: [
		"MANAGE_ROLES"
	],
	cooldown: 2.5e3,
	description: "Stop a user from chatting",
	usage: "<@member/id> [reason]",
	nsfw: false,
	devOnly: false,
	betaOnly: false,
	guildOwnerOnly: false,
	run: (async function(message) {
		if(message.args.length === 0) return new Error("ERR_INVALID_USAGE");
		let user, data, embed, reason, m;
		// get member from message
		user = await message.getMemberFromArgs();
        
		if(!user) return message.errorEmbed("INVALID_USER");
    
		if(message.gConfig.muteRole === null) {
			data = {
				title: "No mute role",
				description: `this server does not have a mute role set, you can set this with \`${message.gConfig.prefix}setmuterole <role>\``,
				color: 15601937
			};
			Object.assign(data, message.embed_defaults("color"));
			embed = new this.Discord.MessageEmbed(data);
			return message.channel.send(embed);
		}
		if(!message.guild.roles.has(message.gConfig.muteRole)) {
			data = {
				title: "Mute role not found",
				description: `The mute role specified for this server <@&${message.gConfig.muteRole}> (${message.guild.id}) was not found, it has been reset. You can set a new one with \`${message.gConfig.prefix}setmuterole <role>\``,
				color: 15601937
			};
			await this.db.updateGuild(message.guild.id,{muteRole:null});
			Object.assign(data, message.embed_defaults("color"));
			embed = new this.Discord.MessageEmbed(data);
			return message.channel.send(embed);
		}
		if(message.guild.roles.get(message.gConfig.muteRole).rawPosition >= message.guild.me.roles.highest.rawPositon) {
			data = {
				title: "Invalid mute role",
				description: `The current mute role <@&${message.gConfig.muteRole}> (${message.guild.id}) seems to be higher than me, please move it below me. You can set a new one with \`${message.gConfig.prefix}setmuterole <role>\``,
				color: 15601937
			};
			Object.assign(data, message.embed_defaults("color"));
			embed = new this.Discord.MessageEmbed(data);
			return message.channel.send(embed);
		}
    
		if(user.roles.has(message.gConfig.muteRole)) {
			data = {
				title: "User already muted",
				description: `The user **${user.user.tag}** seems to already be muted.. You can unmute them with \`${message.gConfig.prefix}unmute @${user.user.tag} [reason]\``,
				color: 15601937
			};
			Object.assign(data, message.embed_defaults()("color"));
			embed = new this.Discord.MessageEmbed(data);
			return message.channel.send(embed);
		}
        
		if(user.id === message.member.id && !message.user.isDeveloper) return message.reply("Pretty sure you don't want to do this to yourthis.");
		if(user.roles.highest.rawPosition >= message.member.roles.highest.rawPosition && message.author.id !== message.guild.owner.id) return message.reply(`You cannot mute ${user.user.tag} as their highest role is higher than yours!`);
		if(user.permissions.has("ADMINISTRATOR")) return message.reply("That user has `ADMINISTRATOR`, that would literally do nothing.");
		reason = message.args.length >= 2 ? message.args.splice(1).join(" ") : "No Reason Specified";
        
		user.roles.add(message.gConfig.muteRole,`Mute: ${message.author.tag} -> ${reason}`).then(() => {
			message.channel.send(`***User ${user.user.tag} was muted, ${reason}***`).catch(noerr => null);
		}).catch(async(err) => {
			message.reply(`I couldn't mute **${user.user.tag}**, ${err}`);
			if(m !== undefined) {
				await m.delete();
			}
		});
		if(!message.gConfig.delCmds && message.channel.permissionsFor(this.user.id).has("MANAGE_MESSAGES")) message.delete().catch(error => null);
	})
};