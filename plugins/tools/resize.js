exports.default = {
   tags: 'tools',
   help: ['crop', 'resize'],
   command: ['crop', 'resize'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (/image/.test(m.quoted ? m.quoted.mtype : m.mtype)) {
         if (!text) return m.reply(`balas atau kirim photo dengan text\ncontoh ${prefix+command} lebar panjang\ncontoh ${prefix+command} 480 480`)
         const [s_1, s_2] = text.trim().split(/\s+/)
         if (!s_1) throw `contoh ${prefix+command} lebar\ncontoh ${prefix+command} 480 480`
         if (!s_2) throw `contoh ${prefix+command} panjang\ncontoh ${prefix+command} 480 480`
         await m.reply('Tunggu Sedang Di Proses..')
         const image = m.quoted ? await conn.getFile(m.quoted.content) : await conn.getFile(m.content)
         const data = await Utils.cropImage(image, s_1, s_2)
         conn.sendFile(m.chat, data, 'Done!', m)
      } else {
         throw 'Photonya Mana ?'
      }
   }
}