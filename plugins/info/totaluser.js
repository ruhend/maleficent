exports.default = {
   tags: 'info',
   help: ['user', 'totaluser'],
   command: ['user', 'totaluser'],
   start: async (m, {
      conn
   }) => {
      const user = Object.keys(db.users).length
      const user_reg = Object.entries(db.users).filter(user => user[1].registered)
      const registered = user_reg.map(([jid, user]) => jid)
      const caption = `Total user: ${user} pengguna\nTotal terdaftar: ${registered.length} pengguna`
      conn.adReply(m.chat, caption, cover, m)
   }
}