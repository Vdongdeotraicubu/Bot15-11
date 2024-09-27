const axios = require("axios");
const fs = require("fs");
const cookie = 'fwjU8yQqoChhkIKuxNZuzuZ6Il_3Cp2S832gNK2Akgtq3nqrmi2kQaFFcnnjIFMaWB9NmQ.';

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "r1zax",
    description: "Gemini",
    commandCategory: "Tiện ích",
    usages: "[args]",
    cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
    try {
     const { messageID, messageReply } = event;
     let prompt = args.join(' ');
   
     if (messageReply) {
      const repliedMessage = messageReply.body;
      prompt = `${repliedMessage} ${prompt}`;
     }
   
     if (!prompt) {
      return api.sendMessage('Vui lòng cung nhập câu hỏi.\nVí dụ: /ai Ý nghĩa của cuộc sống là gì?', event.threadID, messageID);
     }
   
     const gpt4_api = `https://ai-chat-gpt-4-lite.onrender.com/api/hercai?question=${encodeURIComponent(prompt)}`;
   
     const response = await axios.get(gpt4_api);
   
     if (response.data && response.data.reply) {
      const generatedText = response.data.reply;
      api.sendMessage({ body: generatedText, attachment: null }, event.threadID, messageID);
     } else {
      console.error('API response did not contain expected data:', response.data);
      api.sendMessage(`❌ Đã xảy ra lỗi trong quá trình tạo ra phản hồi bằng văn bản. Vui lòng thử lại sau. Dữ liệu phản hồi: ${JSON.stringify(response.data)}`, event.threadID, messageID);
     }
    } catch (error) {
     console.error('Error:', error);
     api.sendMessage(`❌ Đã xảy ra lỗi trong quá trình tạo ra phản hồi bằng văn bản. Vui lòng thử lại sau. Chi tiết lỗi: ${error.message}`, event.threadID, event.messageID);
    }
   };
   