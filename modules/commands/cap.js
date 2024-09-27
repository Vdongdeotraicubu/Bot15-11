 const axios = require("axios");
const fs = require("fs");
module.exports.config = {
    name: "cap",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Thiệu Trung Kiên",
    description: "Chụp ảnh profile của người dùng",
    commandCategory: "THÀNH VIÊN",
    usages: "",
    cooldowns: 5
};
  module.exports.handleEvent = async ({ api, event, Threads, args, Users }) => {
try{
  if(event.body.toLowerCase() == "cap"){
    const moment = require("moment-timezone");
    var gio = moment.tz("Asia/Ho_Chi_Minh").format("D/MM/YYYY || HH:mm:ss");
    var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
     if (thu == 'Sunday') thu = '𝗖𝗵𝘂̉ 𝗡𝗵𝗮̣̂𝘁'
  if (thu == 'Monday') thu = '𝗧𝗵𝘂̛́ 𝗛𝗮𝗶'
  if (thu == 'Tuesday') thu = '𝗧𝗵𝘂̛́ 𝗕𝗮'
  if (thu == 'Wednesday') thu = '𝗧𝗵𝘂̛́ 𝗧𝘂̛'
  if (thu == "Thursday") thu = '𝗧𝗵𝘂̛́ 𝗡𝗮̆𝗺'
  if (thu == 'Friday') thu = '𝗧𝗵𝘂̛́ 𝗦𝗮́𝘂'
  if (thu == 'Saturday') thu = '𝗧𝗵𝘂̛́ 𝗕𝗮̉𝘆'
    const name = await Users.getNameUser(event.senderID)
    let mentions = [];
    mentions.push({
      tag: name,
      id: event.senderID
    })
    api.sendMessage({body: `‎→ 𝗖𝗵𝗼̛̀ 𝘁𝗶́ 𝗻𝗵𝗮 ${name} 𝗯𝗼𝘁 đ𝗮𝗻𝗴 𝗰𝗮𝗽
⏳ 𝗖𝗮𝗽 𝘃𝗮̀𝗼 𝗹𝘂́𝗰: ${gio} || (${thu})
💮 𝘃𝗼̛́𝗶 𝗹𝗮̣𝗶 𝘁𝘂̀𝘆 𝘁𝗵𝗲𝗼 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗯𝗼𝘁 𝗺𝗼̛́𝗶 𝗰𝗮𝗽 đ𝘂̛𝗼̛̣𝗰 𝗻𝗵𝗮`, mentions}, event.threadID, event.messageID);
    if (event.type == "message_reply") {
      var uid = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length == 1) {
      var uid = Object.keys(event.mentions)[0];
    }
  else {
          var uid = event.senderID;
    }
    var cookies = `sb=wiaAZSPun_ff07nRTLlFO9wH; wd=1920x945; c_user=100013942628281; xs=15%3AiM_-R7p9LKkMGw%3A2%3A1702897349%3A-1%3A6192; fr=0NTJlsjKpxhyJo1Ff.AWWu2uBiKzWh_DR67plVB2b4qvs.BlgCbC.zJ.AAA.0.0.BlgCgl.AWVpHcmjeDw; presence=C%7B%22lm3%22%3A%22g.7279289682097811%22%2C%22t3%22%3A%5B%7B%22o%22%3A0%2C%22i%22%3A%22g.4681992131845633%22%7D%5D%2C%22utc3%22%3A1702897708534%2C%22v%22%3A1%7D; datr=wiaAZXXnzyX_v_1uzCHtEct_;`,
    vaildItems = ['sb', 'datr', 'c_user', 'xs', 'm_pixel_ratio', 'locale', 'wd', 'fr', 'presence', 'xs', 'm_page_voice', 'fbl_st', 'fbl_ci', 'fbl_cs', 'vpd', 'wd', 'fr', 'presence'];
    var cookie = ``;
    cookies.split(';').forEach(item => {
        var data = item.split('=');
        if (vaildItems.includes(data[0])) cookie += `${data[0]}=${data[1]};`;
    });
    var url = encodeURI(encodeURI((`https://SreenShot.abcdz1238.repl.co/screenshot/${uid}/${cookie}`))),
        path = __dirname + `/cache/${uid}.png`;
    axios({
        method: "GET",
        url: `https://api.screenshotmachine.com/?key=727005&url=${url}&dimension=1024x768`,
        responseType: "arraybuffer"
    }).then(res => {
        fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));
        api.sendMessage({ 	body: `‎🎥 ==== [ 𝗖𝗔𝗣 𝗪𝗔𝗟𝗟 ] ==== 🎥
━━━━━━━━━━━━━━━━
🌸 𝗮̂𝘆 𝗱𝗼̂ 𝗯𝗼𝘁 𝗰𝗮𝗽 𝘅𝗼𝗻𝗴 𝗿𝗼̂̀𝗶 𝗻𝗲̀ ${name}
⏰ 𝗩𝗮̀𝗼 𝗹𝘂́𝗰: ${gio} || (${thu})
━━━━━━━━━━━━━━━━━━
⚙️ 𝗕𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝗱𝘂̀𝗻𝗴 ${global.config.PREFIX}𝗰𝗮𝗽 + 𝘁𝗮𝗴 𝗵𝗼𝗮̣̆𝗰 𝗿𝗲𝗽𝗹𝘆 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴 đ𝗲̂̉ 𝗯𝗼𝘁 𝗰𝗮𝗽
━━━━━━━━━━━━━━━━━━
→ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝗰𝗮𝗽 𝘄𝗮𝗹𝗹 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗰𝗮𝗽`,mentions,
                         attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    }).catch(err => console.log(err));
  }
} catch(e){
    console.log(e)
}}
module.exports.run = async function ({ api,Users,event, args }) {
  const moment = require("moment-timezone");
  var gio = moment.tz("Asia/Ho_Chi_Minh").format("D/MM/YYYY || HH:mm:ss");
    var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
     if (thu == 'Sunday') thu = '𝗖𝗵𝘂̉ 𝗡𝗵𝗮̣̂𝘁'
  if (thu == 'Monday') thu = '𝗧𝗵𝘂̛́ 𝗛𝗮𝗶'
  if (thu == 'Tuesday') thu = '𝗧𝗵𝘂̛́ 𝗕𝗮'
  if (thu == 'Wednesday') thu = '𝗧𝗵𝘂̛́ 𝗧𝘂̛'
  if (thu == "Thursday") thu = '𝗧𝗵𝘂̛́ 𝗡𝗮̆𝗺'
  if (thu == 'Friday') thu = '𝗧𝗵𝘂̛́ 𝗦𝗮́𝘂'
  if (thu == 'Saturday') thu = '𝗧𝗵𝘂̛́ 𝗕𝗮̉𝘆'
  const name = await Users.getNameUser(event.senderID)

  let mentions = [];
    mentions.push({
      tag: name,
      id: event.senderID
    })
    api.sendMessage({body: `‎→ 𝗖𝗵𝗼̛̀ 𝘁𝗶́ 𝗻𝗵𝗮 ${name} 𝗯𝗼𝘁 đ𝗮𝗻𝗴 𝗰𝗮𝗽
⏳ 𝗖𝗮𝗽 𝘃𝗮̀𝗼 𝗹𝘂́𝗰: ${gio} || (${thu})
💮 𝘃𝗼̛́𝗶 𝗹𝗮̣𝗶 𝘁𝘂̀𝘆 𝘁𝗵𝗲𝗼 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗯𝗼𝘁 𝗺𝗼̛́𝗶 𝗰𝗮𝗽 đ𝘂̛𝗼̛̣𝗰 𝗻𝗵𝗮`, mentions},event.threadID, event.messageID);
    const uid = event.type == 'message_reply' ? event.messageReply.senderID: !!Object.keys(event.mentions)[0] ? Object.keys(event.mentions)[0]: !!args[0] ? args[0]: event.senderID;
    var cookies = `sb=wiaAZSPun_ff07nRTLlFO9wH; wd=1920x945; c_user=100013942628281; xs=15%3AiM_-R7p9LKkMGw%3A2%3A1702897349%3A-1%3A6192; fr=0NTJlsjKpxhyJo1Ff.AWWu2uBiKzWh_DR67plVB2b4qvs.BlgCbC.zJ.AAA.0.0.BlgCgl.AWVpHcmjeDw; presence=C%7B%22lm3%22%3A%22g.7279289682097811%22%2C%22t3%22%3A%5B%7B%22o%22%3A0%2C%22i%22%3A%22g.4681992131845633%22%7D%5D%2C%22utc3%22%3A1702897708534%2C%22v%22%3A1%7D; datr=wiaAZXXnzyX_v_1uzCHtEct_;`,
    vaildItems = ['sb', 'datr', 'c_user', 'xs', 'm_pixel_ratio', 'locale', 'wd', 'fr', 'presence', 'xs', 'm_page_voice', 'fbl_st', 'fbl_ci', 'fbl_cs', 'vpd', 'wd', 'fr', 'presence'];
    var cookie = `sb=wiaAZSPun_ff07nRTLlFO9wH; wd=1920x945; c_user=100013942628281; xs=15%3AiM_-R7p9LKkMGw%3A2%3A1702897349%3A-1%3A6192; fr=0NTJlsjKpxhyJo1Ff.AWWu2uBiKzWh_DR67plVB2b4qvs.BlgCbC.zJ.AAA.0.0.BlgCgl.AWVpHcmjeDw; presence=C%7B%22lm3%22%3A%22g.7279289682097811%22%2C%22t3%22%3A%5B%7B%22o%22%3A0%2C%22i%22%3A%22g.4681992131845633%22%7D%5D%2C%22utc3%22%3A1702897708534%2C%22v%22%3A1%7D; datr=wiaAZXXnzyX_v_1uzCHtEct_;`;
    cookies.split(';').forEach(item => {
        var data = item.split('=');
        if (vaildItems.includes(data[0])) cookie += `${data[0]}=${data[1]};`;
    });
    var url = encodeURI(encodeURI((`https://SreenShot.abcdz1238.repl.co/screenshot/${uid}/${cookie}`))),
        path = __dirname + `/cache/${uid}.png`;
    axios({
        method: "GET",
        url: `https://api.screenshotmachine.com/?key=727005&url=${url}&dimension=1024x768`,
        responseType: "arraybuffer"
    }).then(res => {
        fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));
        api.sendMessage({ 	body: `『‎🎥 ==== [ 𝗖𝗔𝗣 𝗪𝗔𝗟𝗟 ] ==== 🎥
━━━━━━━━━━━━━━━━
🌸 𝗮̂𝘆 𝗱𝗼̂ 𝗯𝗼𝘁 𝗰𝗮𝗽 𝘅𝗼𝗻𝗴 𝗿𝗼̂̀𝗶 𝗻𝗲̀ ${name}
⏰ 𝗩𝗮̀𝗼 𝗹𝘂́𝗰: ${gio} || (${thu})
━━━━━━━━━━━━━━━━━━
⚙️ 𝗕𝗮̣𝗻 𝗰𝗼́ 𝘁𝗵𝗲̂̉ 𝗱𝘂̀𝗻𝗴 ${global.config.PREFIX}𝗰𝗮𝗽 + 𝘁𝗮𝗴 𝗵𝗼𝗮̣̆𝗰 𝗿𝗲𝗽𝗹𝘆 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗻𝗴𝘂̛𝗼̛̀𝗶 𝗱𝘂̀𝗻𝗴 đ𝗲̂̉ 𝗯𝗼𝘁 𝗰𝗮𝗽
━━━━━━━━━━━━━━━━━━
→ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝗰𝗮𝗽 𝘄𝗮𝗹𝗹 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗰𝗮𝗽`, mentions,
                         attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    }).catch(err => console.log(err));
      }