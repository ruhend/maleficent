const toxic = ['kontol', 'anj', 'kntl', 'anjing', 'bngst', 'bgst', 'bangsat', 'memek', 'mmk', 'njir', 'najis', 'anjir', 'jing', 'njing', 'kntl', 'kontol', 'babi', 'monyet', 'mnyt', 'jembut', 'jmbt', 'lol', 'tolol'];
exports.default = {
   start: async (m, {
      conn
   }) => {
      if ((!m.isGroup || db.chats[m.chat]?.antiToxic) && toxic?.some(word => m.text?.toLowerCase()?.includes(word))) {
         if (m.fromMe || m.isBot || m.isOwner || m.isAdmin) return
         conn.adReply(m.chat, `Hey Ketikannya Di Jaga Ya Monyet!`, cover, m);
      }
   }
}