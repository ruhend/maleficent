exports.default = {
   tags: 'tools',
   help: ['remini', 'hd'],
   command: ['remini', 'hd', 'hdr'],
   start: async (m, {
      conn
   }) => {
      if (/image/.test(m.quoted ? m.quoted.mtype : m.mtype)) {         
         if (!m.isGroup && !m.isPremium && !m.isOwner) return m.reply('HD Di Private Chat Hanya Pengguna Premium Saja\nHubungi Owner Untuk Upgrade Ke Premium .owner');
         const media = m.quoted ? await conn.getFile(m.quoted.content) : await conn.getFile(m.content)
         m.react('🕒')
         const data = await Scraper.ihancer(await toBuffer(media), {
            size: m.isPremium || m.isOwner ? 'high' : 'medium'
         })
         await conn.sendFile(m.chat, data, '', m)
      } else {
         return m.reply('balas atau kirim gambar nya! atau stikernya')
      }            
   },
   limit: 5
}