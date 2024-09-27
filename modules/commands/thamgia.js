module.exports.config = {
 name: "thamgia",
 version: "1.0.0", 
 hasPermssion: 0,
 credits: "",
 description: "Thêm bạn vào nhóm mà bot đang ở",
 commandCategory: "group", 
 usages: "addthread", 
 cooldowns: 0,
};

module.exports.handleReply = async ({ event, api, handleReply, Threads }) => {
    const permission = ["100013942628281","100061681069898"];
      if (!permission.includes(event.senderID)) return api.sendMessage("[ 𝗗𝗘𝗩 𝗠𝗢𝗗𝗘 ] Lệnh này chỉ dành cho 𝗡𝗵𝗮̀ 𝗣𝗵𝗮́𝘁 𝗧𝗿𝗶𝗲̂̉𝗻 💻", event.threadID, event.messageID);
    var { threadID, messageID, body, senderID } = event;
    var { threadList, author } = handleReply;
    /*if (senderID != author) return;
    api.unsendMessage(handleReply.messageID);*/
   if (handleReply.author != event.senderID) return api.sendMessage("Cút ra cho admin reply", threadID, messageID)
    if (!body || !parseInt(body)) return api.sendMessage('Lựa chọn của bạn phải là một số.', threadID, messageID);
    if (!threadList[parseInt(body) - 1]) return api.sendMessage("Lựa chọn của bạn không nằm trong danh sách", threadID, messageID);
    else {
        try {
            var threadInfo = threadList[parseInt(body) - 1];
            var { participantIDs } = threadInfo;
            if (participantIDs.includes(senderID)) return api.sendMessage('Bạn đã có mặt trong nhóm này.', threadID, messageID);
            api.addUserToGroup(senderID, threadInfo.threadID, (e) => {
              if (e) api.sendMessage(`Đã cảy ra lỗi: ${e.errorDescription}`, threadID, messageID);
              else api.sendMessage(`Bot đã thêm bạn vào nhóm ${threadInfo.name} rồi nha. Kiểm tra ở mục spam hoặc tin nhắn chờ nếu không thấy box nha.`, threadID, messageID);
            });
        }
        catch (error) {
            return api.sendMessage(`Chưa thể thực thi ${error}`, threadID, messageID);
        }
    }
};
module.exports.run = async function({ api, event }) {
	const { threadID, messageID, senderID } = event;
    const commandName = this.config.name;
    var msg = "", index = 1;
    try {
		var spam = await api.getThreadList(50, null, ["INBOX"]) || [];
	} catch (e) { return api.sendMessage(`Không thể lấy danh sách nhóm\nVui lòng thử lại sau`, threadID, messageID) }
	const list = [...spam].filter(group => group.isSubscribed && group.isGroup);
  //fix lại lọc box M-Drasew
    for (const single of list) 
      msg += `${index++}.${single.name}\n`;
    if (list.length != 0) return api.sendMessage(`\nHiện có ${list.length} nhóm bot đang hoạt động\n\n` + msg + `Đã lọc ra ${list.length} nhóm mà bạn có thể tham gia vào\nTổng nhóm đã lưu vào dữ liệu hệ thống: ${global.data.allThreadID.length} nhóm\nReply tin nhắn này kèm số tương ứng với box mà bạn muốn vào.`, threadID, (error, info) => {
		global.client.handleReply.push({
            name: commandName,
            messageID: info.messageID,
            author: senderID,
            threadList: list
       
        });
	}, messageID);
    else return api.sendMessage(`[ Lỗi ] #244`, threadID, messageID);
}