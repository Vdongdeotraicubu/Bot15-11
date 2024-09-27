module.exports.config = {
  name: "vẽ",
  version: "1.0.",
  hasPermssion: 0,
  credits: "jameslim",
  description: "Tạo ảnh từ AI qua text",
  commandCategory: "image",
  usages: "+ yêu cầu",
  cooldowns: 2,
};
module.exports.run = async ({api, event, args }) => {
const axios = require('axios');
const fs = require('fs-extra');
 let { threadID, messageID } = event;
  let query = args.join(" ");
  if (!query) return api.sendMessage("Làm ơn thêm lời nhắn mô tả vào !!", threadID, messageID);
let path = __dirname + `/cache/poli.png`;
  const poli = (await axios.get(`https://image.pollinations.ai/prompt/${query}`, {
    responseType: "arraybuffer",
  })).data;
  fs.writeFileSync(path, Buffer.from(poli, "utf-8"));
  api.sendMessage({
    body: "Ảnh của bạn yêu cầu đây",
    attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID);
};