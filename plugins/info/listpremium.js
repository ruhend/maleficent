exports.default = {
   tags: 'info',
   help: ['listpremium', 'listprem'],
   command: ['listpremium', 'listprem'],
   start: async (m, {
      conn
   }) => {
      let users = Object.entries(db.users).filter(user => user[1].premiumTime)
      let premiumUsers = users.map(([jid, user]) => {
         return {
            jid: jid,
            reason: user.premiumTime || ''
         }
      })
      let premiumList = premiumUsers.map(user => `${user.jid.split('@')[0]}\nPremium Sampai: ${user.reason}`).join('\n')
      let text = `Berikut Adalah List Pengguna Premium ${setting.botName}\n`
      text += `Total : ${premiumUsers.length}\n`
      text += `User: ${premiumList ? '\n' + premiumList : ''}`
      conn.adReply(m.chat, text, cover, m)
   },
   owner: true
}