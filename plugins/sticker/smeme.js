exports.default = {
   tags: 'sticker',
   help: ['smeme', 'memek'],
   command: ['smeme', 'memek'],
   start: async (m, { 
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Balas Atau Kirim image dengan caption ${prefix + command} text1 | text2`);
      if (/(webp|image|video)/.test(m?.quoted ? m.quoted.mtype : m.mtype)) {
         m.react('🕒')
         const up = text.split('|')[0] ? text.split('|')[0] : ' '
         const down = text.split('|')[1] ? text.split('|')[1] : ' '
         const media_url = await Scraper.uploadUgu(await conn.getFile(m?.quoted ? m.quoted.content : m.content))
         const media_vid = await conn.getFile(m?.quoted ? m.quoted.content : m.content)
         if (m?.quoted) var data = m?.quoted?.mtype == 'video/mp4' ? await Utils.smeme(await toBuffer(media_vid), up, down, 'video') : await toBuffer(`https://api.memegen.link/images/custom/${encodeURIComponent(up ? up : '')}/${encodeURIComponent(down ? down : '')}.png?background=${media_url}`);         
         if (m?.mtype && !m.quoted) var data = m?.mtype == 'video/mp4' ? await Utils.smeme(await toBuffer(media_vid), up, down, 'video') : await toBuffer(`https://api.memegen.link/images/custom/${encodeURIComponent(up ? up : '')}/${encodeURIComponent(down ? down : '')}.png?background=${media_url}`);
         conn.sendSticker(m.chat, data, m, {
            packname: setting.botName,
            author: `${setting.footer === '' ? sticker_wm : setting.footer}\ncreated: \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
         })
      } else {
         return m.reply(`Balas Atau Kirim Gambar dengan caption ${prefix + command} text1 | text2`)
      }
   },
   limit: 2
}