const { fbdl } = require('ruhend-scraper')
exports.default = {
   tags: 'download',
   help: ['facebook'],
   command: ['facebook', 'fb'],
   start: async (m, { 
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`masukan url atau link facebook nya\ncontoh: ${prefix+command} https://www.facebook.com/share/r/18JH2gJRJQ`)
      const data = await fbdl(text)
      m.reply(wait)
      await conn.sendFile(m.chat, data[0], 'Facebook', m)
   },
   limit: 2
}