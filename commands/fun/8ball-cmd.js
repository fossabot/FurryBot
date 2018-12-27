module.exports = {
	triggers: [
		"8ball"
	],
	userPermissions: [],
	botPermissions: [],
	cooldown: 2e3,
	description: "Ask the magic 8ball a question!",
	usage: "<question>",
	nsfw: false,
	devOnly: false,
	betaOnly: false,
	guildOwnerOnly: false,
	run: (async (client,message) => {
        if(message.args.length < 1) return new Error("ERR_INVALID_USAGE");
        var responses = [
            "It is certain",
            "Without a doubt",
            "Most likely",
            "Yes",
            "Reply was hazy, try again later",
            "Ask again later",
            "My answer is no",
            "No",
            "Very doubtful"
        ],
        response = responses[Math.floor(Math.random() * responses.length)];
        return message.reply(`The Magic 8ball said ${response}.`);
    })
};