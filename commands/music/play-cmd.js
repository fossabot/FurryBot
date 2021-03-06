module.exports = {
	triggers: [
		"play"
	],
	userPermissions: [],
	botPermissions: [],
	cooldown: 2.5e3,
	description: "Play some music",
	usage: "<search/link>",
	nsfw: false,
	devOnly: true,
	betaOnly: false,
	guildOwnerOnly: false,
	run: (async function(message) {
		let t, song, songs, pageCount, pageNumber, a, alreadyPlaying, player;
		message.channel.startTyping();
		if(!message.member.voice.channel) {
			message.reply("You must be in a voice channel.");
			return message.channel.stopTyping();
		}
		if(message.args.length === 0) {
			message.reply("Please provide a query or youtube url.");
			return message.channel.stopTyping();
		}
		if(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(message.args[0])) {
			t = (await this.getSong(message.args[0])).tracks;
			if(t.length === 0) {
				message.reply("Nothing was found!");
				return message.channel.stopTyping();
			}
			song = t[0];
		} else {
			t = (await this.songSearch(message.args.join(" "),"youtube")).tracks;
			if(t.length === 0) {
				message.reply("Nothing was found!");
				return message.channel.stopTyping();
			}
			songs={
				tracks: {
    
				},
				songs: {
    
				}
			};
			songs.tracks = t;
			if(t.length > 1) {
				songs.list = this.chunk(songs.tracks,10);
				for(let key in songs.list) {
					songs.list[key] = songs.list[key].map((t,i) => `__**${i+1}**__ - **${t.info.title}** by *${t.info.author}* - Length: ${Math.floor(t.info.length/1000/60)}m${t.info.length/1000%60}s`);
				}
				pageCount = songs.tracks.length;
				pageNumber = 1;
				song = await this.songMenu(pageNumber,pageCount,songs,message);
			} else {
				song = songs.tracks[0];
			}
		}
		if(!song) return message.reply("Internal Error `play1`");
		if(song instanceof Error) {
			if(song.message === "CANCEL") {
				message.reply("Command canceled.");
				return message.channel.stopTyping();
			}
			message.reply("Internal Error `play2`");
			console.error(song);
		}
		if(song instanceof this.Discord.Collection) {
			message.reply("Request timed out.");
			return message.channel.stopTyping();
		}
		if(song instanceof Object) {
			if(!song.song) {
				if(typeof song.info !== "undefined") {
					song.song = {};
					song.song.info = song.info;
				} else {
					return message.reply("Internal Error `play3`");
				}
			}
			if(song.song.info.length > 6e5 && !message.gConfig.premium) {
				message.reply(`this is too long to be played! The maximum time for this guild is \`10 minutes (6000s)\`, to increase this limit please donate, and mark this server as premium **${this.config.bot.donationURL}**.`);
				return message.channel.stopTyping();
			} 
			a = this.voiceConnections.filter(g => g.channel.guild.id === message.guild.id);
			alreadyPlaying = a.size === 0 ? false : a.first().speaking.has("SPEAKING");
			if(!alreadyPlaying) await this.mdb.collection("guilds").findOneAndUpdate({id: message.guild.id},{
				$set: {
					music: {
						textChannel: message.channel.id
					}
				}
			});
			await this.mdb.collection("guilds").findOneAndUpdate({id: message.guild.id},{
				$push: {
					music: {
						queue: {
							author: song.song.info.author,
							length: song.song.info.length,
							title: song.song.info.title,
							uri: song.song.info.uri,
							addedTimestamp: Date.now(),
							addedBy: message.member.id
						}
					}
				}
			});
			if(!song.msg) {
				if(alreadyPlaying) message.reply(`Added **${song.song.info.title}** by *${song.song.info.author}* (Length: ${Math.floor(song.song.info.length/1000/60)}m${song.song.info.length%60}s) to the queue. Position: ${(await this.mdb.collection("guilds").findOne({id: message.guild.id}).then(res => res.music.queue)).length}`);
				else message.reply(`Now playing **${song.song.info.title}** by *${song.song.info.author}* - Length: ${Math.floor(song.song.info.length/1000/60)}m${song.song.info.length%60}s`);
			} else {
				if(alreadyPlaying) message.reply(`Added **${song.song.info.title}** by *${song.song.info.author}* (Length: ${Math.floor(song.song.info.length/1000/60)}m${song.song.info.length%60}s) to the queue. Position: ${(await this.mdb.collection("guilds").findOne({id: message.guild.id}).then(res => res.music.queue)).length}`);
				else song.msg.edit(`Now playing **${song.song.info.title}** by *${song.song.info.author}* - Length: ${Math.floor(song.song.info.length/1000/60)}m${song.song.info.length%60}s`);
			}
			if(!alreadyPlaying) {
				player = await this.playSong(message.member.voice.channel,song.song.info,"youtube");
			}
		} else {
			if(alreadyPlaying) {
				message.reply(`Added **${song.info.title}** by *${song.info.author}* (Length: ${Math.floor(song.info.length/1000/60)}m${song.info.length%60}s) to the queue. Position: ${(await this.mdb.collection("guilds").findOne({id: message.guild.id}).then(res => res.music.queue)).length}`);
			} else {
				message.reply(`Now playing **${song.info.title}** by *${song.info.author}* - Length: ${Math.floor(song.info.length/1000/60)}m${song.info.length%60}s`);
				player = await this.playSong(message.member.voice.channel,song.info,"youtube");
			}
		}
		return message.channel.stopTyping();
	})
};