exports.default = {
   start: async (m, {
      conn
   }) => {
      if (!m.fromMe && !m.isAdmin && !m.isOwner && db.chats[m.chat]?.antiBot && m.isBot) {
         m.reply('Maaf Kak Admin Mengaktifkan Anti Bot Lain')
         m.delete()
         await sleep(2000)
         conn.group.removeParticipants(m.chat, [m.sender])
      }
   }
}