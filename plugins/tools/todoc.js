exports.default = {
   tags: 'tools',
   help: ['todoc', 'todocument'],
   command: ['todoc', 'todocument'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      const q = m.quoted? m.quoted : m
      if (/audio|video|image|sticker/.test(q.mtype)) {
         if (!text) throw `masukan nama file nya \ncontoh: ${prefix+command} videoku`
         m.react('🕒')
         const media = await conn.getFile(q.content)
         const mtype = q.mtype
         const ext = mtype.split('/')[1].split(';')[0]
         conn.sendFile(m.chat, media, '', m, {
            asDocument: true,
            fileName: `${text}.${ext.replace('mpeg', 'mp3')}`,
            mimetype: mtype
         })
      } else {
         throw `balas atau kirim media yg ingin di jadikan dokumen seperti lagu, gambar, video atau stiker`
      }
   },
   limit: 2
}