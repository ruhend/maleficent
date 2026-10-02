exports.default = {
   tags: 'sticker',
   help: ['bratvid', 'stextvid'],
   command: ['bratvid', 'bratvideo', 'stextvid'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Kirim perintah ${prefix+command} text\ncontoh: ${prefix+command} ${setting.botName}`);
      await conn.adReply(m.chat, wait, cover, m);
      await conn.sendSticker(m.chat, await Utils.bratvid(text), m, {
         packname: setting.botName,
         author: `${setting.footer === '' ? setting.footer : setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
     })
   },
   limit: 2
}