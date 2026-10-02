exports.default = {
   start: async (m, {
      conn
   }) => {
      if (m?.text === '@all') m.delete()
      if (m?.mentionedJid) {
         if (m?.mentionedJid?.length > 10) {
           // if (m.isAdmin || m.isOwner || m.fromMe) return
            m.delete()//m.reply(`Hidetag atau Tagall Terdeteksi`)
         }
      }
   }
}