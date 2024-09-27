exports.config = {
    name: 'vay',
    version: '0.0.1',
    hasPermssion: 0,
    credits: 'DC-Nam',
    description: '',
    commandCategory: 'Tiền',
    usages: '[]',
    cooldowns: 3
};
let fs = require('fs');

let path = __dirname+'/hethong/vay.json';
let data = [];
let save = ()=>fs.writeFileSync(path, JSON.stringify(data));

if (!fs.existsSync(path))save();else data = JSON.parse(fs.readFileSync(path));

exports.onLoad = async function(o) {
    let Currencies = require("../../includes/controllers/currencies.js")(o);

    while (true) {
        await new Promise(resolve=>setTimeout(resolve, 1000*10));
        let currencies = await Currencies.getAll();

        for (let i of currencies) {
            if (!isFinite(i.money) || !isFinite(i.userID))continue;

            let find_data = data.find($=>$.uid == i.userID+'');

            if (!find_data) find_data = data[data.length] = {
                uid: i.userID+'',
                max: i.money,
                loan: 0,
                date: null
            };
            find_data.money = i.money;
            if (i.money > find_data.max)find_data.max = i.money;
            if (isFinite(find_data.date) && find_data.date < Date.now()) {
                if (find_data.loan >= i.money && i.money > 0)(find_data.loan = find_data.loan - i.money, i.money = 0);
                if (find_data.loan < i.money)(i.money = i.money - find_data.loan, find_data.loan = 0);
                await Currencies.setData(i.userID, i);
            };
            
            if (find_data.loan == 0)find_data.date = null;
        };
        save();
    };
};
exports.run = function(o) {
    let send = (msg, callback)=>o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
    let find_data = data.find($=>$.uid == o.event.senderID);

    send(`Thông tin vay:\n\n- Vay tối đa: ${find_data.max}\n- Số tiền đang vay: ${find_data.loan}\n- ${find_data.date?'Bạn đang trong thời gian vay (trong vòng 7 ngày không trả hệ thống sẽ trừ tiền của bạn)': 'Bạn chưa vay/đã trả nợ xong'}\n\nReply:\n- [vay/trả] {số_tiền}/[all]`, (err, res)=>(res.name = exports.config.name, res.o = o, global.client.handleReply.push(res)));
};
exports.handleReply = function(o) {
    let send = (msg, callback)=>o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);

    let find_data = data.find($=>$.uid == o.event.senderID);
    let money_input = +o.event.args[1];

    if (isNaN(money_input) && o.event.args[1] != 'all')return send(`Tiền phải là con số`);

    switch (o.event.args[0].toLowerCase()) {
        case 'vay': {
            if (find_data.date)return send(`Đang trong thời gian vay vui lòng trả hết nợ để vay tiếp`);
            if (o.event.args[1] == 'all')money_input = find_data.max;
            if (money_input > find_data.max)return send(`Số tiền vay không được vượt quá ${find_data.max}`);

            find_data.loan += money_input;
            find_data.date = Date.now()+(1000*60*60*24*7);
            o.Currencies.increaseMoney(find_data.uid, money_input);
            send(`Đã vay, chú ý: trong vòng 7 ngày không trả hệ thống sẽ trừ tiền của bạn để trả`);
        };
            break;
        case 'trả': {
            if (o.event.args[1] == 'all')money_input = (find_data.loan < find_data.money ?find_data.loan: find_data.money);
            if (money_input > find_data.money)return send(`Không đủ tiền để trả`);

            find_data.loan = find_data.loan - money_input;
            if (find_data.loan == 0)find_data.date = null;
            o.Currencies.decreaseMoney(find_data.uid, money_input);
            send(`${find_data.loan == 0?'Đã trả hết nợ': `Bạn còn nợ ${find_data.loan}`}`);
        };
            break;
        default:
            break;
    };
};