exports.default = {
   tags: 'info',
   help: ['listafk'],
   command: ['listafk'],
   start: async (m, {
      conn
   }) => {
      const afk = Object.entries(db.users).filter(v => {
         const user = v[1].afkTime == -1
         const data = !user
         return data
      })

      const clockString = (ms) => {
         let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
         let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
         let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
         let toString = [`*${h} Jam*`, `*${m} Menit*`, `*${s} Detik*`].map(v => v.toString().padStart(2, 0)).join(': ')
         return `${toString}`
      }

      const users = afk.map(([jid, user]) => {
         return {
            jid: jid,
            name: user.name,
            timeAfk: clockString(new Date() - db.users[jid].afkTime),
            reason: user.afkReason
         }
      })

      const data = users.map(user => `• ${user.name}\n Nomor: @${user.jid.split('@')[0]}\n AFK Selama:\n ${user.timeAfk}\n Alasan: ${user.reason}\n`).join('\n')
      const jid = conn.parseMentionPN(data)
      const teks = `*List User AFK*\n *${setting.botName}*\n\n${data.trim()}`

      conn.adReply(m.chat, teks, cover, m, {
         mentions: jid
      })
   }
}