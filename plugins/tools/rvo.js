exports.default = {
   tags: 'tools',
   help: ['rvo', 'readviewonce'],
   command: ['rvo', 'readviewonce'],
   start: async (m, { 
      conn 
   }) => {
      if (!m.quoted) return m.reply('Reply pesan view once.');
      if (!m.quoted.isMedia) return m.reply('Itu bukan pesan media.');
      const type = m.quoted.type
      const content = m.quoted.content      
      const caption = m.quoted.text ?? ''
      const data = await conn.getFile(content)
      await conn.sendFile(m.chat, data, caption, m) 
      if (m.isOwner) await conn.sendFile(m.sender, data, caption, m); 
   }       
}