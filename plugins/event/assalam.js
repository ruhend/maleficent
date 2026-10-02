exports.default = {
   start: async (m, {
      conn
   }) => {
      if (m?.text?.toLowerCase()?.includes('assalamualaikum') || m?.text?.toLowerCase()?.includes('assalamu\'alaikum')) {
         conn.adReply(m.chat, 'waalaikumsalam', cover, m, {
            mentions: [m.sender]
         })
      }
   }
}