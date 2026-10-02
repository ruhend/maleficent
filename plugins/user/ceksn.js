exports.default = {
   tags: 'user',
   help: ['sn', 'ceksn'],
   command: ['sn', 'ceksn'],
   start: async (m, {
      conn
   }) => {
      const Serial = db.users[m.sender].seri
      if (Serial !== "") {
         const msg = await conn.reply(m.chat, Serial, m)
         const $ = {
            key: {
               id: msg.id,
               remoteJid: m.chat,
               fromMe: true
            },
            pushName: 'WhatsApp',
            broadcast: true,
            sender: m.sender,            
            ...(msg)
         };
         conn.adReply(m.chat, `@${m.sender.split('@')[0]} itu adalah serial number kamu silahkan salin`, cover, $)         
      } else {
         return m.reply('nomor sn kamu tidak ditemukan silahkan .daftar')
      }
   }
}