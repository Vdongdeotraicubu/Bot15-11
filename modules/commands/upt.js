const os = require('os');
const si = require('systeminformation');

module.exports.config = {
  name: "upt",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "R1zaX",
  description: "Random ảnh theo api - uptime",
  commandCategory: "Lệnh hệ thống",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Users }) => {
  const cpus = os.cpus();
  const cpu = os.cpus()[0];
  // console.log("CPU Information:");
  // console.log(`Model: ${cpu.model}`);
  // console.log(`Speed: ${cpu.speed}MHz`);

  // Calculate and display CPU usage
  const getCpuUsage = () => {
      let totalIdle = 0, totalTick = 0;
      cpus.forEach((cpu) => {
          for (type in cpu.times) {
              totalTick += cpu.times[type];
          }
          totalIdle += cpu.times.idle;
      });
      return 1 - totalIdle / totalTick;
  };
  const dateNow = Date.now();
   const time = process.uptime(),
        gio = Math.floor(time / (60 * 60)),
        phut = Math.floor((time % (60 * 60)) / 60),
        giay = Math.floor(time % 60);
  // console.log(`CPU Usage: ${(getCpuUsage() * 100).toFixed(2)}%`);

  // RAM Information
  const totalMemoryGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
  const freeMemoryGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
  const usedMemoryGB = (totalMemoryGB - freeMemoryGB).toFixed(2);
  const usedMemoryPercentage = ((usedMemoryGB / totalMemoryGB) * 100).toFixed(2);

  // console.log(`Total Memory: ${totalMemoryGB} GB`);
  // console.log(`Free Memory: ${freeMemoryGB} GB`);
   //console.log(`Used Memory: ${usedMemoryGB} GB (${usedMemoryPercentage}%)`);
si.osInfo(function(data) {
si.graphics(function(graphicsData) {
    if (graphicsData.controllers.length > 0) {
      const gpu = graphicsData.controllers[0];
 return api.sendMessage(`━━━━[ 𝗜𝗡𝗙𝗢 𝗦𝗘𝗥𝗩𝗘𝗥 ]━━━━\n\nHệ thống hoạt động được ${gio} : ${phut} : ${giay}\n\n➜ Hệ điều hành: ${data.distro}\n➜ 𝗖𝗣𝗨: ${cpu.model}\nSpeed: ${cpu.speed}MHz\n➜ 𝗖𝗣𝗨 𝗨𝘀𝗮𝗴𝗲: ${(getCpuUsage() * 100).toFixed(2)}%\n➜ 𝗚𝗣𝗨: ${gpu.model}\n➜ 𝗥𝗔𝗠: ${usedMemoryGB} GB (${usedMemoryPercentage}%) / ${totalMemoryGB} GB\n➜ 𝗡𝗢𝗗𝗘 -𝗩: ${process.version}\nThư mục làm việc hiện tại: ${process.cwd()}\n➜ 𝗣𝗶𝗻𝗴: ${Date.now() - dateNow} ms`,event.threadID);
}
});
});
}