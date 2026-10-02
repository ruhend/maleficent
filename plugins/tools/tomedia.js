exports.default = {
   tags: 'tools',
   help: ['tomedia'],
   command: ['tomedia'],
   start: async (m, {
      conn,
      prefix,
      command
   }) => {
      if (!/text/.test(m?.quoted?.mtype ?? m.mtype)) {
         const media = m?.quoted ? await m?.quoted?.download() : await m.download()
         m.react('🕒')
         await conn.sendFile(m.chat, media, m?.quoted ? m?.quoted?.content?.documentMessage?.fileName : m?.content?.documentMessage?.fileName, m);
      } else {
         return m.reply(`Balas document Atau Kirim document Dengan Caption ${prefix+command} yang ingin di convert ke media`);
      }
   },
   limit: 2
}
