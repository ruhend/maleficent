exports.default = {
   start: async (m, {
      conn
   }) => {
      if (m?.command && !m.isBot) {
         const mean = Utils.command_mean(m.command, cmd_plugins);
         if (mean && !(mean === m.command)) {
            if (setting.prefix.find(p => m.text?.startsWith(p))) {
               conn.adReply(m.chat, `*❗mungkin maksud kamu:*\n  *${m.prefix+mean}*`, cover, m);
            }
         }
      }      
   }
}