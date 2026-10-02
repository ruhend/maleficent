exports.default = {
   start: async (m, {
      conn
   }) => {
      try {
         if (m?.ptt && m.isBot && !m.key.fromMe) await conn.delete(m.chat, m.key)    
      } catch (e) {
         return console.error(e)
      } 
   }
}