module.exports = {
	commands: require("fs").readdirSync(__dirname).filter(c => c !== "index.js").map(c => {
		let a = require(`${__dirname}/${c}`);
		Object.assign(a,{
			path:`${__dirname}/${c}`,
			category: __dirname.split("\\").reverse()[0]
		});
		delete require.cache[require.resolve(`${__dirname}/${c}`)];
		return a;
	}),
	name: "Moderation",
	description: "Stomp down the server baddies with your ban hammer.",
	path: __dirname
};
