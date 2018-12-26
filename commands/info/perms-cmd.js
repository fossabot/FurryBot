module.exports = {
	triggers: [
		"perms",
		"listperms"
	],
	userPermissions: [],
	botPermissions: [],
	cooldown: 2e3,
	description: "Check your own and the bots permissions",
	usage: "",
	nsfw: false,
	devOnly: false,
	betaOnly: false,
	guildOwnerOnly: false,
	run: (async (client,message) => {
		var allow_user = Object.keys(client._.pickBy(message.member.permissions.serialize(),((val,key) =>{return val;}))),
		deny_user = Object.keys(client._.pickBy(message.member.permissions.serialize(),((val,key) => {return !val;}))),
		allow_bot = Object.keys(client._.pickBy(message.guild.me.permissions.serialize(),((val,key) => {return val;}))),
		deny_bot = Object.keys(client._.pickBy(message.guild.me.permissions.serialize(),((val,key) => {return !val;})));
	
		var au = allow_user.length === 0 ? "NONE" : allow_user.join("**, **"),
		du = deny_user.length === Object.keys(client.Discord.Permissions.FLAGS).length ? "NONE" : deny_user.join("**, **"),
		ab = allow_bot.length === 0 ? "NONE" : allow_bot.join("**, **"),
		db = deny_bot.length === Object.keys(client.Discord.Permissions.FLAGS).length ? "NONE" : deny_bot.join("**, **");
		var data = {
			title: "Permission Info",
			fields: [
				{
					name: "User",
					value: `__Allow__:\n**${au}**\n\n\n__Deny__:\n**${du}**`,
					inline: false
				},{
					name: "Bot",
					value: `__Allow__:\n**${ab}**\n\n\n__Deny__:\n**${db}**`,
					inline: false
				}
			]
		}
		Object.assign(data,message.embed_defaults());
		var embed = new client.Discord.MessageEmbed(data);
		return message.channel.send(embed);
	})
};