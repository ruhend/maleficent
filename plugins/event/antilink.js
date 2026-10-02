exports.default = {
   start: async (m, {
      conn
   }) => {
      if (db.chats[m.chat]?.antilink && !m.key.fromMe && !m.isBot) {
         try {
            if (m?.text?.includes('https://chat.whatsapp.com')) {
               if (m.isAdmin) return m.reply('You have the authority to send the link as an admin.');
               if (m.isOwner) return m.reply('Sending the link is something you are free to do since you are my owner.');
               conn.reply(m.chat, `@${m.sender.split("@")[0]} Terdeteksi Mengirim Kata Kata Aneh!`, m, {
                  mentions: [m.sender]
               }).then(async () => {
                  if (m.isBotAdmin) {
                    const url = await conn.group.queryInviteCode(m.chat)                   
                     if (!m.text.match(url)) { //@867051314767696
                       m.delete()
                       await sleep(2000); 
                       conn.group.removeParticipants(m.chat, [m.sender])
                     } else if (m.text.includes(url)) {
                        m.reply('Oh Ternyata Link Group Ini Hampir Ajh Aku Delete and Kick');
                     }
                  }
               })
            }
         } catch (e) {
            return console.error(e)
         }
      }
   }
}