exports.default = {
   tags: 'group',
   help: ['ht', 'h', 'hidetag'],
   command: ['ht', 'h', 'hidetag'],
   start: async (m, {
      conn,
      text,        
   }) => {          
      conn.adReply(m.chat, m?.quoted ? m?.quoted?.text : text ? text : '', cover, m, {
         mentions: m.participantsMentionedLid
      })
   },
   admin: true,
   group: true
}