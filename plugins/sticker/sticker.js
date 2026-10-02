exports.default = {
   tags: 'sticker',
   help: ['sticker'],
   command: ['sticker', 's', 'stiker'],
   start: async (m, { 
      conn,
      text,
      prefix,
      command
   }) => {
      const caption = `balas gambarnya atau kirim gambar yang mau di jadikan stiker\ncontoh: ${prefix+command}\nhanya support gambar video dokumen dan sticker saja`
      if (m.quoted && m?.quoted?.mtype !== 'text/plain') {
         m.react('🕒')
         const file = await m.quoted.download()
         await conn.sendSticker(m.chat, file, m, {
             pacname: setting.botName,
             author: `${setting.footer === '' ? setting.footer : setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`              
         })  
      } else if (m.mtype && m.mtype !== 'text/plain') {
         m.react('🕒')
         const file = await m.download()
         await conn.sendSticker(m.chat, file, m, {
             pacname: setting.botName,
             author: `${setting.footer === '' ? setting.footer : setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`              
         })
      } else {
         throw caption
      }
   },
   limit: 2
}