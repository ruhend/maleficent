exports.default = {
   tags: 'tools',
   help: ['removebg', 'rbg'],
   command: ['removebg', 'rbg'],
   start: async (m, {
      conn
   }) => {
      if (/image|webp/.test(m.quoted ? m.quoted.mtype : m.mtype)) {         
         const data = await Scraper.removeBackground(m.quoted ? await conn.getFile(m.quoted.content) : await conn.getFile(m.content))         
         m.react('🕒')
         await conn.sendFile(m.chat, data, '', m)
      } else {
         return m.reply('balas atau kirim gambar nya! atau stikernya')
      }            
   },
   limit: 2   
}