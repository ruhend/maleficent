exports.default = {
   tags: 'download',
   help: ['pinterest', 'pin', 'pint'],
   command: ['pinterest', 'pin', 'pint'],
   start: async (m, {
      conn, 
      text,
      prefix,
      command
  }) => {
      if (!text) return m.reply(`contoh: ${prefix+command} Input Query`)
      const data = await fetchJSON(`https://api.siputzx.my.id/api/s/pinterest?query=${text}&type=image`);
      m.react('🕒')
      const images = data.data.map(item => item.image_url).filter(Boolean);
      await conn.adReply(m.chat, wait, cover, m);
      for await (let i of images) await conn.sendFile(m.chat, i, '', m)
   },
   limit: 1
}