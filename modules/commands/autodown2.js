var 
  ytdl = require('ytdl-core'),
  fs = require("fs-extra"),
  cheerio = require("cheerio"),
  axios = require("axios"),
  { resolve } = require('path'),
  downloadMusicFromYoutube = async function (link, path) {
    var timestart = Date.now();
    if (!link) return 'Thiếu link';
    var 
      resolveFunc = function () { },
      rejectFunc = function () { },
      returnPromise = new Promise(function (resolve, reject) {
        resolveFunc = resolve;
        rejectFunc = reject;
      });
    ytdl(link, {
      filter: format => format.quality == 'tiny' && format.audioBitrate == 128 && format.hasAudio == true
    })
      .pipe(fs.createWriteStream(path))
      .on("close", async () => {
        var data = await ytdl.getInfo(link);
        var result = {
         title: data.videoDetails.title,
          dur: Number(data.videoDetails.lengthSeconds),
          viewCount: data.videoDetails.viewCount,
          likes: data.videoDetails.likes,
          uploadDate: data.videoDetails.uploadDate,
          sub: data.videoDetails.author.subscriber_count,
          author: data.videoDetails.author.name,
          timestart
        };
        resolveFunc(result);
      });
    return returnPromise;
  },

  convertHMS = function (value) {
    const sec = parseInt(value, 10); 
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60); 
    let seconds = sec - (hours * 3600) - (minutes * 60); 
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return (hours != '00' ? hours + ':' : '') + minutes + ':' + seconds;
  },
  path = __dirname + "/cache/whatthefuck.mp4",
  config = {
    name: "autodown2",
    hasPermssion: 4,
    version: "1.0",
    description: "Sam",
    credits: "Sam",
    commandCategory: "Tiện ích",
    usages: "[args]",
    cooldowns: 5
  },
  handleEvent = async function ({ api, event, Threads }) {
    var m = (await Threads.getData(event.threadID)).data;
    if (m[config.name] == false) return;
    for (i of event.body.split(" ")) {
      if (i.indexOf("https://") == 0) {
        for (e of i.split("/")) {
          if (e == "youtu.be" || e == "www.youtube.com" || e == "youtube.com") {
            var 
              youtube = __dirname + "/cache/wtf.mp3",
              data = await downloadMusicFromYoutube(i, youtube);
            api.sendMessage({ 
              body: `→ 𝗔̂𝗺 𝗻𝗵𝗮̣𝗰: ${data.title}\n→ 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻: ${convertHMS(data.dur)}\n→ 𝗧𝗮́𝗰 𝗴𝗶𝗮̉: ${data.author}\n→ 𝗟𝘂̛𝗼̛̣𝘁 𝘅𝗲𝗺: ${data.viewCount}\n→ 𝗟𝘂̛𝗼̛̣𝘁 𝘁𝗵𝗶́𝗰𝗵: ${data.likes}\n→ 𝗧𝗮̉𝗶 𝗹𝗲̂𝗻: ${data.uploadDate}\n→ 𝗧𝗵𝗲𝗼 𝗱𝗼̃𝗶: ${data.sub}\n→ 𝗧𝗵𝗼̛̀𝗶 𝗴𝗶𝗮𝗻 𝘅𝘂̛̉ 𝗹𝗶́: ${Math.floor((Date.now()- data.timestart)/1000)}s`,
              attachment: fs.createReadStream(youtube)
            }, event.threadID, () => fs.unlinkSync(youtube));
          }
        }
      }
    }
    return;
  },
  run = async function ({ api, event, Threads }) {
    var data = (await Threads.getData(event.threadID)).data;
    if (data[config.name] == false) data[config.name] = true;
    else data[config.name] = false;
    await Threads.setData(event.threadID, {
      data
    });
    return api.sendMessage({
      body: (data[config.name] == true ? "Bật" : "Tắt") + " thành công autoDown2"
    }, event.threadID);
  }

module.exports = {
  config,
  handleEvent, 
  run
  }