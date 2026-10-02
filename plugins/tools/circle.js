exports.default = {
   tags: 'tools',
   help: ['circle', 'bulat'],
   command: ['circle', 'bulat'],
   start: async (m, { 
      conn,
      text,
      prefix,
      command
   }) => {
      if (/image/.test(m.quoted ? m.quoted.mtype : m.mtype)) {
         const buffer = await toBuffer(m.quoted ? await conn.getFile(m.quoted.content) : await conn.getFile(m.content))
         m.react('🕒');
         const image = text ? await Utils.circlePhoto(buffer, parseInt(text)) : await Utils.circlePhoto(buffer);
         await conn.sendFile(m.chat, image, '', m)
       } else {
          return m.reply(`Balas atau kirim gambar dengan caption ${prefix+command} yang mau di jadikan ke bulat\noptional kamu dapat menyesuaikan ukuran gambar contoh:\n${prefix+command} 300`)
       }
   },
   limit: 1
}