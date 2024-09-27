module.exports.config = {
	name:"vdsex",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "",
	description: "Random video girl theo api",
	commandCategory: "system",
	cooldowns: 3
};
module.exports.run = async ({ api, event }) => {
	const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
return api.sendMessage({body:'Video sẽ của bạn đây 🌚', attachment: (await global.nodemodule["axios"]({
url: (await global.nodemodule["axios"]('https://api.blacksky04.repl.co/images/videosex')).data.url,
method: "GET",
responseType: "stream"
})).data}, event.threadID, event.messageID)
}