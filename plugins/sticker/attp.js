const ttp = require('../../lib/src/scraper/ttp.js');
exports.default = {
   tags: 'sticker',
   help: ['attp', 'ttp'],
   command: ['attp', 'ttp'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Kirim perintah ${prefix+command} text\ncontoh: ${prefix+command} ${setting.botName}`);
      const result = await ttp(text);
      await conn.adReply(m.chat, wait, cover, m)
      await conn.sendSticker(m.chat, result.url, m, {
         packname: setting.botName,
         author: `${setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
      })
   },
   limit: 2
}