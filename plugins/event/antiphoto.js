exports.default = {
   start: async (m, {
      conn
   }) => {
      if (!m.fromMe && !m.isAdmin && !m.isOwner && db.chats[m.chat]?.antiPhoto && (m?.type === 'imageMessage' || /image/.test(m?.mtype))) {
          m.reply('Maaf Kak Anti Photo Aktif'), m.delete()
      }
   }
}