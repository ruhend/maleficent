const { Image } = require('node-webpmux'); 
exports.default = {
   tags: 'tools',
   help: ['getexif', 'exif'],
   command: ['getexif', 'exif'],
   start: async (m, { 
      conn
   }) => {
      if (!m.quoted) return m.reply('Balas stikernya!')
      if (/webp/.test(m.quoted.mtype)) {
         const img = new Image();
         await img.load(await conn.getFile(m.quoted.content));
         const data = JSON.parse(img.exif.slice(22).toString())
         const result = JSON.stringify(data, null, 2)
         conn.reply(m.chat, result, m);
      } else {
         return m.reply('Balas ke stiker saja bukan pesan lain')
      }
   }   
}