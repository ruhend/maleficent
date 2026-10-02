exports.default = {
   tags: 'tools',
   help: ['tomp4', 'tovideo'],
   command: ['tomp4', 'tovideo'],
   start: async (m, { 
      conn,
      prefix,
      command
   }) => {
      if (!/webp/.test(!m?.quoted ? m?.mtype : m?.quoted?.mtype)) return m.reply(`balas stiker dengan caption *${prefix + command}*`)
      await conn.adReply(m.chat, wait, cover, m);
      const media = await conn.getFile(m?.quoted?.content ?? m?.content);
      const webpToMp4 = await Scraper.webp2mp4File(media)
      conn.sendFile(m.chat, webpToMp4.result, "Berhasil Ke Video ✔", m)
   },
   limit: 2
}