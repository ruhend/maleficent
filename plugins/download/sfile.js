exports.default = {
   tags: 'download',
   help: ['sfile'],
   command: ['sfile'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`contoh: ${prefix+command} https://sfile.mobi/agJlyQTbq0T`);
      m.react('🕒')
      const data = await Scraper.sfile(text);     
      const cleanTitle = data.title.split('/')[0].trim()
      const cleanMime = data.mime_type.split('/').pop()      
      const caption = `*SFILE*\n` +
      `*Name:* ${cleanTitle}\n` +
      `*Size:* ${data.size}\n` +
      `*Mimetype:* ${cleanMime}\n` +
      `*Uploaded By:* ${data.author.name}\n` +
      `*Uploaded Date:* ${data.upload_date}\n` +
      `*Total Download:* ${data.downloads}`
      await conn.adReply(m.chat, caption, 'https://files.catbox.moe/wbgchw.jpg', m)
      await conn.sendFile(m.chat, data.direct_cdn_link, '', m, {
         asDocument: true,
         fileName: cleanTitle + `.${cleanMime}`,
         mimetype: data.mime_type
      })
   },
   limit: 2
}