const isAfk = (u) => typeof u?.afkTime === 'number' && u.afkTime !== -1
const durasi = (ms) => {
   if (typeof clockString === 'function') return clockString(ms)
   const d = Math.floor(ms / 86400000)
   const h = Math.floor(ms / 3600000) % 24
   const mnt = Math.floor(ms / 60000) % 60
   const s = Math.floor(ms / 1000) % 60
   return `${d} Hari ${h} Jam ${mnt} Menit ${s} Detik`
}
exports.default = {
   start: async (m, {
      conn
   }) => {
      if (!m?.text || m.isBot) return
      const me = db.users[m.sender]
      if (!me) return
      const warn = async (pn) => {
         const u = db.users[pn]
         if (!isAfk(u)) return
         const reason = u.afkReason ?? ''
         const caption = `*Jangan Tag* *@${pn.split('@')[0]}*\n*Dia Sedang Afk*\n*Dengan Alasan:* ${reason}\n*Selama:*\n${durasi(Date.now() - u.afkTime)}`
         const mentions = [m.sender, pn, ...conn.parseMentionPN(reason)]
         await conn.adReply(m.chat, caption, cover, m, {
            mentions
         })
      }
      const toPN = (jid) => {
         const pn = conn.toJid(jid, m.participants)
         return pn && pn !== m.sender ? pn : null
      }
      if (isAfk(me)) {
         const reason = me.afkReason ?? ''
         const caption = `*Kamu Berhenti AFK*\n*Setelah:* ${reason}\n*Selama:*\n${durasi(Date.now() - me.afkTime)}`
         const mentions = [m.sender, ...conn.parseMentionPN(reason)]
         me.afkTime = -1
         me.afkReason = ''
         await conn.adReply(m.chat, caption, cover, m, {
            mentions
         })
      }
      if (m?.quoted) {
         const ctx = m.raw?.message?.extendedTextMessage?.contextInfo ?? m.raw?.message?.[m.type]?.contextInfo
         const quotedJids = [...new Set([m.quoted.sender, m.quoted.key?.participant, ctx?.participant].filter(Boolean))]
         const quotedPN = quotedJids.map(toPN).find(Boolean)
         if (quotedPN) await warn(quotedPN)
         else {}//console.log('[AFK] quote tidak ke-resolve ke PN:', quotedJids)
      }
      const mentioned = new Set()
      for (const jid of [...(m.mentionedJid ?? []), ...conn.parseMention(m.text)]) {
         const pn = toPN(jid)
         if (pn) mentioned.add(pn)
      }
      for (const pn of mentioned) await warn(pn)
   }
}