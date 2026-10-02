exports.default = {
   tags: 'user',
   help: ['afk'],
   command: ['afk'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (m.fromMe) return m.reply('Diri Sendiri Tidak Boleh Afk Nomor Rawan Terbanned') 
      const lids = text.includes('@') ?
         conn.parseMention(text) :
         []
      const arrPN = []
      const lidToPN = new Map()
      for (const lid of lids) {
         const participant = m.participants.find(v => v.jid === lid)
         if (!participant?.phoneNumber) continue
         const pn = participant.phoneNumber
         const lidNumber = lid.split('@')[0]
         const pnNumber = pn.replace(/@s\.whatsapp\.net$/i, '')
         arrPN.push(pn)
         lidToPN.set(lidNumber, pnNumber)
      }
      const captionFinal = text.replace(/@(\d+)/g, (mention, lidNumber) => {
         const pnNumber = lidToPN.get(lidNumber)
         return pnNumber ?
            `@${pnNumber}` :
            mention
      })
      const reason = text ?
         captionFinal :
         'Ngewe'
      const caption = `Kamu Sekarang AFK Dengan Alasan: ${reason}`
      const tags = [m.sender].concat(arrPN)
      conn.adReply(m.chat, caption, cover, m, {
         mentions: tags,
         showAds: false
      }).then(() => {
         db.users[m.sender].afkReason = captionFinal
         db.users[m.sender].afkTime = +new Date()
      })
   },
   group: true
}