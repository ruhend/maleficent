exports.default = {
   tags: 'tools',
   help: ['totag'],
   command: ['totag'],
   start: async (m, {
      conn,
      prefix,
      command
   }) => {
      const members = m.participantsMentionedJid
      if (/audio|video|image|document|sticker/.test(m?.quoted ? m.quoted.mtype : m.mtype)) {
         const media = m.quoted ? await m.quoted.download() : await m.download()
         conn.sendFile(m.chat, media, m.quoted ? m.quoted.text : m.text, m, {
            ptt: false,
            mentions: members
         })
      } else {
         conn.reply(m.chat, m?.quoted?.text ?? m.text, m, { mentions: members })
      }         
   },
   admin: true,
   group: true
}