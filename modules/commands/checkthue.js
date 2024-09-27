module.exports.config = {
  name: "checkthue",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "R1zaX",
  description: "Noti thông báo hết hạn thuê bot",
  commandCategory: "DEV",
  usages: "[]",
  cooldowns: 0
};

module.exports.run = async function({ api, event, Users }) {
      let form_mm_dd_yyyy = (input = '', split = input.split('/')) => `${split[1]}/${split[0]}/${split[2]}`;
      const { threadID, logMessageData } = event
      const { getCurrentUserID: botID, sendMessage: send, unsendMessage: unsend } = api
      let thuebot;
   try { thuebot = JSON.parse(require('fs').readFileSync(process.cwd() + '/modules/commands/hethong/data/thuebot.json')); } catch { thuebot = []; };
      let find_thuebot = thuebot.find($ => $.t_id == event.threadID);
  
        if (find_thuebot) {
    let time_diff = new Date(form_mm_dd_yyyy(find_thuebot.time_end)).getTime() - (Date.now() + 25200000);
    let days = (time_diff / (1000 * 60 * 60 * 24)) << 0;
    let hour = (time_diff / (1000 * 60 * 60) % 24) << 0;
    const nameUser = global.data.userName.get(event.author) || await Users.getNameUser(event.author);
        return send(`Chào ${nameUser} \nNhóm ${(global.data.threadInfo.get(find_thuebot.t_id) || {}).threadName} \nĐã thuê từ ${find_thuebot.time_start} -> ${find_thuebot.time_end}\n\n📌 𝗕𝗮̣𝗻 𝗖𝗼̀𝗻 ${days} ngày ${hour} giờ là 𝗵𝗲̂́𝘁 𝗵𝗮̣𝗻`, event.threadeID);
      } else if (!find_thuebot) {
        return send(`Chào ${nameUser}! Nhóm bạn Không nằm trong danh sách thuê Bot`, event.threadeID);
      } else {
        return send(`Chào ${nameUser} \nNhóm ${(global.data.threadInfo.get(find_thuebot.t_id) || {}).threadName} \nĐã thuê từ ${find_thuebot.time_start} -> ${find_thuebot.time_end}\n\n𝗧𝗶̀𝗻𝗵 𝘁𝗿𝗮̣𝗻𝗴: ${new Date(form_mm_dd_yyyy(find_thuebot.time_end)).getTime() >= Date.now() + 25200000 ? '𝗖𝗵𝘂̛𝗮 𝗛𝗲̂́𝘁 𝗛𝗮̣𝗻 ✅' : 'Đã Hết Hạn ❎'}`, event.threadeID);
          }
}

