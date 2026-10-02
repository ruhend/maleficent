exports.default = {
   tags: 'sticker',
   help: ['brat', 'stext'],
   command: ['brat', 'stext'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Kirim perintah ${prefix+command} text\ncontoh: ${prefix+command} ${setting.botName}`);
      const result = await toBuffer(`https://aqul-brat.hf.space/?text=${text}`);
      await conn.adReply(m.chat, wait, cover, m)
      await conn.sendSticker(m.chat, result, m, {
         packname: setting.botName,
         author: `${setting.footer === '' ? setting.footer : setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
      })
   },
   limit: 2
}