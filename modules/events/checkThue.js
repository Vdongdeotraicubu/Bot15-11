module.exports.config = {
  name: "checkthue",
  eventType: ["log:subscribe"],
  version: "1.0.0",
  credits: "R1zaX",
  description: "Noti check danh sách thuê bot"
};

module.exports.run = async function({ api, event, Users }) {
  let form_mm_dd_yyyy = (input = '', split = input.split('/')) => `${split[1]}/${split[0]}/${split[2]}`;
  const { threadID, logMessageData } = event
  const { getCurrentUserID: botID, sendMessage: send, unsendMessage: unsend } = api
  let thuebot;
  try { thuebot = JSON.parse(require('fs').readFileSync(process.cwd() + '/modules/commands/hethong/data/thuebot.json')); } catch { thuebot = []; };
  let find_thuebot = thuebot.find($ => $.t_id == event.threadID);

  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    if (find_thuebot) {
      let time_diff = new Date(form_mm_dd_yyyy(find_thuebot.time_end)).getTime() - (Date.now() + 25200000);
      let days = (time_diff / (1000 * 60 * 60 * 24)) << 0;
      let hour = (time_diff / (1000 * 60 * 60) % 24) << 0;
      var name1 = (await Users.getData(find_thuebot.id)).name

      return send(`━━━〈✅ 𝗖𝗢𝗡𝗙𝗜𝗥𝗠 ✅〉━━━\n\nChào người thuê: ${name1}\n📆 𝗡𝗴𝗮̀𝘆 𝗧𝗵𝘂𝗲̂: ${find_thuebot.time_start}\n⏳ 𝗡𝗴𝗮̀𝘆 𝗵𝗲̂́𝘁 𝗵𝗮̣𝗻 : ${find_thuebot.time_end}\n\📝 𝗧𝗶̀𝗻𝗵 𝘁𝗿𝗮̣𝗻𝗴: ${new Date(form_mm_dd_yyyy(find_thuebot.time_end)).getTime() >= Date.now() + 25200000 ? '𝗖𝗵𝘂̛𝗮 𝗛𝗲̂́𝘁 𝗛𝗮̣𝗻 ✅' : 'Đã Hết Hạn ❎'}\n📌 𝗕𝗮̣𝗻 𝗖𝗼̀𝗻 ${days} ngày ${hour} giờ là 𝗵𝗲̂́𝘁 𝗵𝗮̣𝗻.\n\n→ Xem bảng lệnh bot: /𝗺𝗲𝗻𝘂 𝗮𝗹𝗹`, event.threadID, async function() {
      setTimeout(async function() {
        if (new Date(form_mm_dd_yyyy(find_thuebot.time_end)).getTime() <= Date.now() + 25200000) {
      api.sendMessage(`⚠️ Nhóm này đã hết hạn thuê từ ${find_thuebot.time_end}`, 7279289682097811);
        }
    }, 2000);
  });
    } else if (!find_thuebot) {
      return send(`━━━〈⚠️ 𝗖𝗔̉𝗡𝗛 𝗕𝗔́𝗢 ⚠️〉━━━\n\n> Box của bạn 𝗸𝗵𝗼̂𝗻𝗴 𝗻𝗮̆̀𝗺 trong danh sách được sử dụng bot. Hãy liên hệ với ADMIN!\n\n> Nếu bạn là người thuê bot? Vui lòng nhắn với Chủ Bot để được phê duyệt`, event.threadID, async function() {
        setTimeout(async function() {
          await api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
        }, 10000);
      }),
      setTimeout(async function() {
      api.sendMessage("❌ Nhóm này không nằm trong danh sách thuê", 7279289682097811)
    }, 2000);
    };
   // if (new Date(form_mm_dd_yyyy(find_thuebot.time_end)).getTime() <= Date.now() + 25200000) return api.sendMessage(`⚠️ Nhóm này đã hết hạn thuê từ ${find_thuebot.time_end}`, 7279289682097811)
  }
}