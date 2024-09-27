module.exports.config = {
    name: "anime",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "...!!!...",
    description: "Thông tin anime",
    commandCategory: "tiện ích",
    usages: "infoanime",
    cooldowns: 5
};
module.exports.run = async ({ event, api, args }) => {
    const axios = global.nodemodule["axios"];
    const { threadID, messageID } = event;
    const fs = global.nodemodule["fs-extra"];
    let id = args[1];
    switch (args[0]) {
        case "id":
        case "id": {
            const res = await axios.get(`https://api.jikan.moe/v4/anime/${id}`)
            const { data } = await axios.get(res.data.data.images.jpg.image_url, { responseType: 'arraybuffer' });
            fs.writeFileSync(__dirname + '/cache/aaa.png', Buffer.from(data));
            return api.sendMessage({
                body: `ID: ${res.data.data.mal_id}` +
                    `\nURL: ${res.data.data.url}` +
                    `\nTrailer: ${res.data.data.trailer.youtube_id}` +
                    `\nUrl trailer: ${res.data.data.trailer.url}` +
                    `\nTiêu đề: ${res.data.data.title}` +
                    `\nTiêu đề english: ${res.data.data.title_english}` +
                    `\nTiêu đề japanese: ${res.data.data.title_japanese}` +
                    `\nTừ đồng nghĩa tiêu đề: ${res.data.data.title_synonyms}` +
                    `\nType: ${res.data.data.type}` +
                    `\nSource: ${res.data.data.source}` +
                    `\nEpisodes: ${res.data.data.episodes}` +
                    `\nStatus: ${res.data.data.status}` +
                    `\nAiring: ${res.data.data.airing}` +
                    `\nAired: from: ${res.data.data.aired.from} To: ${res.data.data.aired.to}` +
                    `\nDuration: ${res.data.data.duration}` +
                    `\nRating: ${res.data.data.rating}` +
                    `\nScore: ${res.data.data.score}` +
                    `\nSynopsis: ${res.data.data.synopsis}` +
                    `\nAdmin-bot:  `, attachment: fs.createReadStream(__dirname + '/cache/aaa.png')
            }, threadID, messageID)
        }
        case "random":
        case "rdm": {
            const res = await axios.get(`https://api.jikan.moe/v4/random/anime`)
            const { data } = await axios.get(res.data.data.images.jpg.image_url, { responseType: 'arraybuffer' });
            fs.writeFileSync(__dirname + '/cache/aaaa.png', Buffer.from(data));
            return api.sendMessage({
                body: `ID: ${res.data.data.mal_id}` +
                    `\nURL: ${res.data.data.url}` +
                    `\nTrailer: ${res.data.data.trailer.youtube_id}` +
                    `\nUrl trailer: ${res.data.data.trailer.url}` +
                    `\nTitle: ${res.data.data.title}` +
                    `\nTitle English: ${res.data.data.title_english}` +
                    `\nTitle Japanese: ${res.data.data.title_japanese}` +
                    `\nTitle Synonyms: ${res.data.data.title_synonyms}` +
                    `\nType: ${res.data.data.type}` +
                    `\nSource: ${res.data.data.source}` +
                    `\nEpisodes: ${res.data.data.episodes}` +
                    `\nStatus: ${res.data.data.status}` +
                    `\nAiring: ${res.data.data.airing}` +
                    `\nAired: from: ${res.data.data.aired.from} To: ${res.data.data.aired.to}` +
                    `\nDuration: ${res.data.data.duration}` +
                    `\nRating: ${res.data.data.rating}` +
                    `\nScore: ${res.data.data.score}` +
                    `\nSynopsis: ${res.data.data.synopsis}` +
                    `\nAdmin-bot:   `, attachment: fs.createReadStream(__dirname + '/cache/aaaa.png')
            }, threadID, messageID)
        }
    }
}