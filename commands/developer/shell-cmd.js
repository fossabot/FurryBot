module.exports = {
	triggers: [
		"shell",
		"sh"
	],
	userPermissions: [],
	botPermissions: [],
	cooldown: 0,
	description: "Execute shell code (dev only)",
	usage: "[args]",
	nsfw: false,
	devOnly: false,
	betaOnly: false,
	guildOwnerOnly: false,
	run: (async function(message) {
		// extra check, to be safe
		if (!this.config.developers.includes(message.author.id)) return message.reply("You cannot run this command as you are not a developer of this bot.");
		message.channel.startTyping();
		let exec, start, res, end, data, embed;
		exec = message.unparsedArgs.join(" ");
		start = this.performance.now();
		try {
			res = await this.shell(exec);
		}catch(e){
			res = e.length > 1000 ? "Logged To Console" : `\`\`\`fix\nError Executing:\n${typeof res !== "undefined" && ![null,undefined,""].includes(res.stderr) ? res.stderr : e}\`\`\``;
			end = this.performance.now();
			if(e.length > 6000) {
				const req = await this.request("https://pastebin.com/api/api_post.php",{
					method: "POST",
					form: {
						"api_dev_key": this.config.apis.pastebin.devKey,
						"api_user_key": this.config.apis.pastebin.userKey,
						"api_option": "paste",
						"api_paste_code": e,
						"api_paste_private": 2,
						"api_paste_name": "Furry Bot Eval",
						"api_paste_expire_date": "N"
					}
				});
				res = `Uploaded ${req.body.toString()}`;
			}
			data = {
				title: `Executed - Time: \`\`${(+end-start).toFixed(3)}ms\`\``,
				author: {
					name: message.author.tag,
					icon_url: message.author.displayAvatarURL()
				},
				color: 3322313,
				fields: [
					{
						name: ":inbox_tray: Input",
						value: `\`\`\`fix\n${exec}\`\`\``,
						inline: false
					}, {
						name: ":outbox_tray: Output",
						value: res,
						inline: false
					}
				]
			};
	
			this.logger.error(`[Eval]: ${typeof res !== "undefined" && ![null,undefined,""].includes(res.stderr) ? res.stderr : e}`);
			Object.assign(data,message.embed_defaults());
			embed = new this.Discord.MessageEmbed(data);
			message.channel.send(embed).catch(err => {
				message.channel.send(`I could not return the result: ${err}`).catch(error => {
					message.author.send(`I could not return the result: ${error}`).catch(noerr => null);
				});
			});
			return message.channel.stopTyping();
		}
		if([null,undefined,""].includes(res.stdout)) {
			res = "```fix\nfinished with no return```";
		} else {
			if(res.length > 6000) {
				const req = await this.request("https://pastebin.com/api/api_post.php",{
					method: "POST",
					form: {
						"api_dev_key": this.config.apis.pastebin.devKey,
						"api_user_key": this.config.apis.pastebin.userKey,
						"api_option": "paste",
						"api_paste_code": res,
						"api_paste_private": 2,
						"api_paste_name": "Furry Bot Eval",
						"api_paste_expire_date": "N"
					}
				});
				res = `Uploaded ${req.body.toString()}`;
			} else if(res.length > 1000) {
				console.log(`[Eval]: ${res.stdout}`);
				res = "Logged To Console";
			}
			res = "```fix\n"+res.stdout+"```";
		}
		end = this.performance.now();
		data = {
			title: `Executed - Time: \`${(+end-start).toFixed(3)}ms\``,
			author: {
				name: message.author.tag,
				icon_url: message.author.displayAvatarURL()
			},
			color: 3322313,
			fields: [
				{
					name: ":inbox_tray: Input",
					value: "```fix\n"+exec+"```",
					inline: false
				}, {
					name: ":outbox_tray: Output",
					value: res,
					inline: false
				}
			]
		};
		
		Object.assign(data,message.embed_defaults());
		embed = new this.Discord.MessageEmbed(data);
		message.channel.send(embed).catch(err => {
			console.error(err);
			message.channel.send(`I could not return the result: ${err}`).catch(error => {
				message.author.send(`I could not return the result: ${err}`).catch(noerr => null);
			});
		});
		return message.channel.stopTyping();
	})
};