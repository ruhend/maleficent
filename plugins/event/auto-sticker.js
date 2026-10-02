exports.default = {
   start: async (m, {
      conn
   }) => {
      if (db.settings?.auto_sticker && m.type === 'imageMessage' && !m.isBot) {
         if (withPrefix(m.text, 'remini|sticker|stiker|s|hd|smeme')) return m.react("🚫")
         if (!m.fromMe && db.users[m.sender].limit < 0) return m.reply(mess.limit);
         m.react('▫️');
         conn.sendSticker(m.chat, await m.download(), m, {
            packname: setting.botName,
            author: `${setting.footer === '' ? sticker_wm : setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
         }).then(() => {
            if (!m.fromMe) {
               db.users[m.sender].limit -= 2
               m.reply(limit_message.replace('%limit', 2))
            }
         })
      }
   }
}