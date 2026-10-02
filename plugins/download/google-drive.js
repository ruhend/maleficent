exports.default = {
   tags: 'download',
   help: ['googledrive'],
   command: ['googledrive', 'gdrive'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Masukan Link Google Drove nya contoh ${prefix+command} https://drive.google.com/file/d/1BKaXs8uIt4_C_dEKUje-nn-XYYNOO07y/view?usp=drivesdk`)      
      const res = await Scraper.gdrive(text)
      m.react('🕒')
      if (!res) throw res
      const drive = ` 𝐆𝐎𝐆𝐆𝐋𝐄 𝐃𝐑𝐈𝐕𝐄\n` +
      ` Name: ${res.fileName}\n` +
      ` Type: ${res.mimetype}\n` +
      ` Size: ${res.fileSize}`
      await conn.adReply(m.chat, drive, cover, m)
      await conn.sendFile(m.chat, res.downloadUrl, '', m, {
         asDocument: true,
         fileName: res.fileName,
         mimetype: res.mimetype
      })
   },
   limit: 2
}