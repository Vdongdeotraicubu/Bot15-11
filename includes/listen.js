module.exports = function({ api, models }) {
  setInterval(function() {
    if (global.config.NOTIFICATION) {
      require("./handle/handleNotification.js")({ api });
    }
  }, 1000 * 60);
  const fs = require("fs");
  const Users = require("./controllers/users")({ models, api }),
    Threads = require("./controllers/threads")({ models, api }),
    Currencies = require("./controllers/currencies")({ models });
  const logger = require("../utils/log.js");
  const moment = require('moment-timezone');
  const axios = require("axios");
  var day = moment.tz("Asia/Ho_Chi_Minh").day();


  const checkttDataPath = __dirname + '/../modules/commands/tt/';
  setInterval(async () => {
    const day_now = moment.tz("Asia/Ho_Chi_Minh").day();
    if (day != day_now) {
      day = day_now;
      const checkttData = fs.readdirSync(checkttDataPath);
      console.log('Bắt đầu kiểm tra tương tác ngày mới');
      await new Promise(async resolve => {
        for (const checkttFile of checkttData) {
          const checktt = JSON.parse(fs.readFileSync(checkttDataPath + checkttFile));
          let storage = [], count = 1;
          for (const item of checktt.day) {
            const userName = await Users.getNameUser(item.id) || 'Tên không tồn tại';
            const itemToPush = item;
            itemToPush.name = userName;
            storage.push(itemToPush);
          };
          storage.sort((a, b) => {
            if (a.count > b.count) {
              return -1;
            }
            else if (a.count < b.count) {
              return 1;
            } else {
              return a.name.localeCompare(b.name);
            }
          });
          let checkttBody = '═✿═╡°𝗖𝗛𝗘𝗖𝗞 𝗕𝗢𝗫°╞═✿═\nDưới đây là số tin nhắn của tất cả thành viên đã nhắn trong ngày\n\n'; checkttBody += storage.slice(0, 10).map(item => {
            return `𝗧𝗢𝗣 ${count++} 👤${item.name} ⁠➜ ${item.count} 💬`;
          }).join('\n');
          api.sendMessage(checkttBody, checkttFile.replace('.json', ''), (err) => err ? console.log(err) : '');

          checktt.day.forEach(e => {
            e.count = 0;
          });
          checktt.time = day_now;
          fs.writeFileSync(checkttDataPath + checkttFile, JSON.stringify(checktt, null, 4));
        }
        resolve();
        
      })

      await new Promise(async resolve => {
        if (day_now == 1) {
          console.log('Bắt đầu kiểm tra tương tác tuần mới');
          for (const checkttFile of checkttData) {
            const checktt = JSON.parse(fs.readFileSync(checkttDataPath + checkttFile));
            let storage = [], count = 1;
            for (const item of checktt.week) {
              const userName = await Users.getNameUser(item.id) || 'Tên không tồn tại';
              const itemToPush = item;
              itemToPush.name = userName;
              storage.push(itemToPush);
            };
            storage.sort((a, b) => {
              if (a.count > b.count) {
                return -1;
              }
              else if (a.count < b.count) {
                return 1;
              } else {
                return a.name.localeCompare(b.name);
              }
            });
            let checkttBody = '═✿═╡°𝗖𝗛𝗘𝗖𝗞 𝗕𝗢𝗫°╞═✿═\nDưới đây là số tin nhắn của tất cả thành viên đã nhắn trong tuần này\n\n'; checkttBody += storage.slice(0, 10).map(item => {
              return `𝗧𝗢𝗣 ${count++} 👤${item.name} ⁠➜ ${item.count} 💬`;
            }).join('\n');
            api.sendMessage(checkttBody, checkttFile.replace('.json', ''), (err) => err ? console.log(err) : '');
            checktt.week.forEach(e => {
              e.count = 0;
            });
            fs.writeFileSync(checkttDataPath + checkttFile, JSON.stringify(checktt, null, 4));
          }
        }
        resolve();
      })

      global.client.sending_top = false;
    }
  }, 1000 * 10);
  //////////////////////////////////////////////////////////////////////
  //========= Push all variable from database to environment =========//
  //////////////////////////////////////////////////////////////////////

  (async function() {

    try {
      logger(global.getText('listen', 'startLoadEnvironment'), '[ Dữ liệu ]');
      let threads = await Threads.getAll(),
        users = await Users.getAll(['userID', 'name', 'data']),
        currencies = await Currencies.getAll(['userID']);
      for (const data of threads) {
        const idThread = String(data.threadID);
        global.data.allThreadID.push(idThread),
          global.data.threadData.set(idThread, data['data'] || {}),
          global.data.threadInfo.set(idThread, data.threadInfo || {});
        if (data['data'] && data['data']['banned'] == !![])
          global.data.threadBanned.set(idThread,
            {
              'reason': data['data']['reason'] || '',
              'dateAdded': data['data']['dateAdded'] || ''
            });
        if (data['data'] && data['data']['commandBanned'] && data['data']['commandBanned']['length'] != 0)
          global['data']['commandBanned']['set'](idThread, data['data']['commandBanned']);
        if (data['data'] && data['data']['NSFW']) global['data']['threadAllowNSFW']['push'](idThread);
      }
      // logger.loader(global.getText('listen', 'loadedEnvironmentThread'));
      for (const dataU of users) {
        const idUsers = String(dataU['userID']);
        global.data['allUserID']['push'](idUsers);
        if (dataU.name && dataU.name['length'] != 0) global.data.userName['set'](idUsers, dataU.name);
        if (dataU.data && dataU.data.banned == 1) global.data['userBanned']['set'](idUsers, {
          'reason': dataU['data']['reason'] || '',
          'dateAdded': dataU['data']['dateAdded'] || ''
        });
        if (dataU['data'] && dataU.data['commandBanned'] && dataU['data']['commandBanned']['length'] != 0)
          global['data']['commandBanned']['set'](idUsers, dataU['data']['commandBanned']);
      }
      for (const dataC of currencies) global.data.allCurrenciesID.push(String(dataC['userID']));
      var spam = await api.getThreadList(50, null, ["INBOX"]) || [];
      const list = [...spam].filter(group => group.isSubscribed && group.isGroup);
      logger.loader(`Đã tải thành công ${global.data.allThreadID.length} Nhóm và ${global.data.allUserID.length} Người Dùng`);
     // api.sendMessage(`➜ Đã tải thành công ${global.data.allThreadID.length} Nhóm và ${global.data.allUserID.length} Người Dùng`, 4681992131845633);
      logger.loader(`Hiện có ${list.length} nhóm bot đang hoạt động\n`);
     // api.sendMessage(`➜ Hiện có ${list.length} nhóm bot đang hoạt động`, 4681992131845633)
    } catch (error) {
      logger.loader(`Không thể tải biến môi trường, lỗi: ${error}`, 'error');
      api.sendMessage(`➜ Không thể tải biến môi trường, lỗi: ${error}`, 4681992131845633)
    }
  }());
  logger(`〈 ${global.config.PREFIX} 〉${(!global.config.BOTNAME) ? "Mirai-Bot" : global.config.BOTNAME}`, "[ Thông tin Bot ]");
var prettyMilliseconds = require('pretty-ms');
// api.sendMessage(`⟳ 𝗛𝗲̣̂ 𝘁𝗵𝗼̂𝗻𝗴 đ𝗮̃ 𝗸𝗵𝗼̛̉𝗶 đ𝗼̣̂𝗻𝗴 𝗹𝗮̣𝗶!\n➜ 𝗞𝗲̂́𝘁 𝘁𝗵𝘂́𝗰 𝘃𝗼̛́𝗶 ${prettyMilliseconds(Date.now() - global.client.timeStart)}`, 4681992131845633)
  ///////////////////////////////////////////////
  //========= Require all handle need =========//
  //////////////////////////////////////////////

  const handleCommand = require("./handle/handleCommand")({ api, models, Users, Threads, Currencies });
  const handleCommandEvent = require("./handle/handleCommandEvent")({ api, models, Users, Threads, Currencies });
  const handleReply = require("./handle/handleReply")({ api, models, Users, Threads, Currencies });
  const handleNotification = require("./handle/handleNotification")({ api, Threads, Users, Currencies, models });
  const handleReaction = require("./handle/handleReaction")({ api, models, Users, Threads, Currencies });
  const handleRefresh = require("./handle/handleRefresh")({ api, Threads, Users, Currencies, models });
  const handleEvent = require("./handle/handleEvent")({ api, models, Users, Threads, Currencies });
  const handleCreateDatabase = require("./handle/handleCreateDatabase")({ api, Threads, Users, Currencies, models });
  // const handleUnsend = require("./handle/handleUnsend")({ senderID, reaction, messageID, threadID, userID }); 

  //DEFINE DATLICH PATH
  const datlichPath = __dirname + "/../modules/commands/hethong/datlich.json";

  //FUNCTION HOẠT ĐỘNG NHƯ CÁI TÊN CỦA NÓ, CRE: DUNGUWU
  const monthToMSObj = {
    1: 31 * 24 * 60 * 60 * 1000,
    2: 28 * 24 * 60 * 60 * 1000,
    3: 31 * 24 * 60 * 60 * 1000,
    4: 30 * 24 * 60 * 60 * 1000,
    5: 31 * 24 * 60 * 60 * 1000,
    6: 30 * 24 * 60 * 60 * 1000,
    7: 31 * 24 * 60 * 60 * 1000,
    8: 31 * 24 * 60 * 60 * 1000,
    9: 30 * 24 * 60 * 60 * 1000,
    10: 31 * 24 * 60 * 60 * 1000,
    11: 30 * 24 * 60 * 60 * 1000,
    12: 31 * 24 * 60 * 60 * 1000
  };
  const checkTime = (time) => new Promise((resolve) => {
    time.forEach((e, i) => time[i] = parseInt(String(e).trim()));
    const getDayFromMonth = (month) => (month == 0) ? 0 : (month == 2) ? (time[2] % 4 == 0) ? 29 : 28 : ([1, 3, 5, 7, 8, 10, 12].includes(month)) ? 31 : 30;
    if (time[1] > 12 || time[1] < 1) resolve("Tháng của bạn có vẻ không hợp lệ");
    if (time[0] > getDayFromMonth(time[1]) || time[0] < 1) resolve("Ngày của bạn có vẻ không hợp lệ");
    if (time[2] < 2022) resolve("Bạn sống ở kỷ nguyên nào thế");
    if (time[3] > 23 || time[3] < 0) resolve("Giờ của bạn có vẻ không hợp lệ");
    if (time[4] > 59 || time[3] < 0) resolve("Phút của bạn có vẻ không hợp lệ");
    if (time[5] > 59 || time[3] < 0) resolve("Giây của bạn có vẻ không hợp lệ");
    yr = time[2] - 1970;
    yearToMS = (yr) * 365 * 24 * 60 * 60 * 1000;
    yearToMS += ((yr - 2) / 4).toFixed(0) * 24 * 60 * 60 * 1000;
    monthToMS = 0;
    for (let i = 1; i < time[1]; i++) monthToMS += monthToMSObj[i];
    if (time[2] % 4 == 0) monthToMS += 24 * 60 * 60 * 1000;
    dayToMS = time[0] * 24 * 60 * 60 * 1000;
    hourToMS = time[3] * 60 * 60 * 1000;
    minuteToMS = time[4] * 60 * 1000;
    secondToMS = time[5] * 1000;
    oneDayToMS = 24 * 60 * 60 * 1000;
    timeMs = yearToMS + monthToMS + dayToMS + hourToMS + minuteToMS + secondToMS - oneDayToMS;
    resolve(timeMs);
  });


  const tenMinutes = 10 * 60 * 1000;

  const checkAndExecuteEvent = async () => {

    /*smol check*/
    if (!fs.existsSync(datlichPath)) fs.writeFileSync(datlichPath, JSON.stringify({}, null, 4));
    var data = JSON.parse(fs.readFileSync(datlichPath));

    //GET CURRENT TIME
    var timeVN = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY_HH:mm:ss');
    timeVN = timeVN.split("_");
    timeVN = [...timeVN[0].split("/"), ...timeVN[1].split(":")];

    let temp = [];
    let vnMS = await checkTime(timeVN);
    const compareTime = e => new Promise(async (resolve) => {
      let getTimeMS = await checkTime(e.split("_"));
      if (getTimeMS < vnMS) {
        if (vnMS - getTimeMS < tenMinutes) {
          data[boxID][e]["TID"] = boxID;
          temp.push(data[boxID][e]); delete data[boxID][e];
        } else delete data[boxID][e];
        fs.writeFileSync(datlichPath, JSON.stringify(data, null, 4));
      };
      resolve();
    })

    await new Promise(async (resolve) => {
      for (boxID in data) {
        for (e of Object.keys(data[boxID])) await compareTime(e);
      }
      resolve();
    })
    for (el of temp) {
      try {
        var all = (await Threads.getInfo(el["TID"])).participantIDs;
        all.splice(all.indexOf(api.getCurrentUserID()), 1);
        var body = el.REASON || "🥰🥰🥰", mentions = [], index = 0;

        for (let i = 0; i < all.length; i++) {
          if (i == body.length) body += " ‍ ";
          mentions.push({
            tag: body[i],
            id: all[i],
            fromIndex: i - 1
          });
        }
      } catch (e) { return console.log(e); }
      var out = {
        body, mentions
      }
      if ("ATTACHMENT" in el) {
        out.attachment = [];
        for (a of el.ATTACHMENT) {
          let getAttachment = (await axios.get(encodeURI(a.url), { responseType: "arraybuffer" })).data;
          fs.writeFileSync(__dirname + `/../modules/commands/cache/${a.fileName}`, Buffer.from(getAttachment, 'utf-8'));
          out.attachment.push(fs.createReadStream(__dirname + `/../modules/commands/cache/${a.fileName}`));
        }
      }
      console.log(out);
      if ("BOX" in el) await api.setTitle(el["BOX"], el["TID"]);
      api.sendMessage(out, el["TID"], () => ("ATTACHMENT" in el) ? el.ATTACHMENT.forEach(a => fs.unlinkSync(__dirname + `/../modules/commands/cache/${a.fileName}`)) : "");
    }

  }
  setInterval(checkAndExecuteEvent, tenMinutes / 10);

  //////////////////////////////////////////////////
  //========= Send event to handle need =========//
  /////////////////////////////////////////////////

  return async (event) => {
    let form_mm_dd_yyyy = (input = '', split = input.split('/')) => `${split[1]}/${split[0]}/${split[2]}`;
    let prefix = (global.data.threadData.get(event.threadID) || {}).PREFIX || global.config.PREFIX;
    let send = (msg, callback) => api.sendMessage(msg, event.threadID, callback, event.messageID);
    let send2 = (msg, callback) => api.sendMessage(msg, 7279289682097811, callback, 7279289682097811);
    if ((event.body || '').startsWith(prefix) && event.senderID != api.getCurrentUserID() && !global.config.ADMINBOT.includes(event.senderID)) {
      let thuebot;
      try { thuebot = JSON.parse(require('fs').readFileSync(process.cwd() + '/modules/commands/hethong/data/thuebot.json')); } catch { thuebot = []; };
      let find_thuebot = thuebot.find($ => $.t_id == event.threadID);

      if (!find_thuebot) return send(`━━━〈 𝗞𝗜𝗘̂̉𝗠 𝗗𝗨𝗬𝗘̣̂𝗧 〉━━━\n\n 𝗕𝗼𝘅 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 𝗸𝗵𝗼̂𝗻𝗴 𝗻𝗮̆̀𝗺 𝘁𝗿𝗼𝗻𝗴 𝗱𝗮𝗻𝗵 𝘀𝗮́𝗰𝗵 𝘁𝗵𝘂𝗲̂ 𝗯𝗼𝘁 𝗯𝗼𝘁.\n\nVui lòng liên hệ 𝗔𝗱𝗺𝗶𝗻\n-> https://m.me/RqzaX.VqnThuqn.040`)
     // if (!find_thuebot) return send2("❌ Nhóm này không nằm trong danh sách thuê")
// api.sendMessage("❌ Nhóm này không nằm trong danh sách thuê", 7279289682097811)
      if (new Date(form_mm_dd_yyyy(find_thuebot.time_end)).getTime() <= Date.now() + 25200000) return send(`━━━〈 𝗧𝗛𝗢̂𝗡𝗚 𝗕𝗔́𝗢 〉━━━\n\n⚠️ Nhóm của bạn đã hết hạn thuê bot, Vui lòng liên hệ admin bot thanh toán để tiếp tục gia hạn.\n\nAdmin: Văn Ťħuận\nhttps://m.me/RqzaX.VqnThuqn.040`);
      //api.sendMessage(`❌ Nhóm này đã hết hạn thuê từ ngày ${find_thuebot.time_end} nằm trong danh sách thuê`, 7279289682097811)
    };
    if (event.type == "change_thread_image") api.sendMessage(`[ 𝗖𝗔̣̂𝗣 𝗡𝗛𝗔̣̂𝗧 𝗡𝗛𝗢́𝗠 ] - ${event.snippet}`, event.threadID);

    switch (event.type) {
      //<--Nhận, xử lí dữ liệu-->//
      case "message":
      case "message_reply":
      case "message_unsend":
        handleCreateDatabase({ event });
        handleCommand({ event });
        handleReply({ event });
        handleCommandEvent({ event });
        break
      //<--Nhận tin nhắn, thông báo thay đổi nhóm-->//
      case "change_thread_image":
      case "event":
        handleEvent({ event });
        handleRefresh({ event });
        if (event.type != "change_thread_image" && global.config.notiGroup) {
          var msg = '[ 𝗖𝗔̣̂𝗣 𝗡𝗛𝗔̣̂𝗧 𝗡𝗛𝗢́𝗠 ] - '
          msg += event.logMessageBody
          if (event.author == api.getCurrentUserID()) {
            msg = msg.replace('Bạn ', global.config.BOTNAME)
          }
          api.sendMessage(msg, event.threadID);
        }
        break;
      //<--Nhận cảm xúc-->//
      case "message_reaction":
        if(event.senderID == api.getCurrentUserID() && event.reaction == '❤') {
					api.unsendMessage(event.messageID)
				}
        handleReaction({ event });
        break;
      default:
        break; 
    }
  };
};