exports.default = {
   start: async (m, {
      conn
   }) => {      
      if (m?.text == 'hadir' && db.chats[m.chat]?.absen) {
         if (db.chats[m.chat]?.absen_user.includes(m.key.participant)) {
            return m.reply('kamu sudah absen ketik .cekabsen')
         } else if (!(db.chats[m.chat]?.absen_user.includes(m.key.participant))) {
            db.chats[m.chat].absen_user.push(m.key.participant)
            db.chats[m.chat].absen_count += 1
            const text = `• ${m.pushName || ""} @${m.key.participant.split('@')[0]}\n`
            db.chats[m.chat].absen_text += text
            conn.adReply(m.chat, ` *ABSEN*\n\nketik .absen atau hadir\nuntuk mengakhiri absen ketik .tutupabsen\n\nTotal Hadir: ${db.chats[m.chat]?.absen_count}\n\n` + db.chats[m.chat]?.absen_text, 'https://files.catbox.moe/v34xjn.png', m, {
               mentions: conn.parseMention(db.chats[m.chat]?.absen_text)
            })
         }
      }
   }
}