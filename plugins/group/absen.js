exports.default = {
   tags: 'group',
   help: ['absen', 'absenstart', 'tutupabsen', 'hapusabsen', 'cekabsen'],
   command: ['absen', 'absenstart', 'tutupabsen', 'hapusabsen', 'cekabsen'],
   start: async (m, { 
      conn, 
      text,
      prefix,
      command 
   }) => {
      switch (command) {
         case 'absenstart': {
            if (!m.isAdmin) return m.reply('Hanya Admin Yang Dapat Memulai Absen');
            db.chats[m.chat].absen = true
            m.reply('Absen Di Mulai\nSekarang Member Bisa Absen Ketik .absen atau hadir');
         }
         break

         case 'absen': {
            if (!db.chats[m.chat].absen) return m.reply('absen belum di mulai perintahkan admin untuk memulai absen ketik .absenstart')
            if (db.chats[m.chat].absen_user.includes(m.sender)) return m.reply('kamu sudah absen ketik .cekabsen')
            db.chats[m.chat].absen_user.push(m.sender)
            db.chats[m.chat].absen_count += 1
            let caption = db.chats[m.chat].absen_text
            caption += `• ${m.pushName || ""} @${m.key.participant.split('@')[0]}\n`
            db.chats[m.chat].absen_text = caption
            conn.adReply(m.chat,` *ABSEN*\n\nketik .absen atau hadir\nuntuk mengakhiri absen ketik .tutupabsen\n\nTotal Hadir: ${db.chats[m.chat].absen_count}\n\n` + db.chats[m.chat].absen_text, 'https://files.catbox.moe/v34xjn.png', m, {
               mentions: conn.parseMention(db.chats[m.chat].absen_text)
            })
         }
         break

         case 'tutupabsen':
         case 'hapusabsen': {
            if (!m.isAdmin) return m.reply('Hanya Admin Yang Dapat Menghapus Absen');
            db.chats[m.chat].absen = false
            db.chats[m.chat].absen_count = 0
            db.chats[m.chat].absen_user = []
            db.chats[m.chat].absen_text = ''
            m.reply('Sukses Mengakhiri Absen')
         }
         break

         case 'cekabsen': {
            conn.adReply(m.chat, ` *ABSEN*\n\nketik .absen atau hadir\nuntuk mengakhiri absen ketik .tutupabsen\n\nTotal Hadir: ${db.chats[m.chat].absen_count}\n\n` + db.chats[m.chat].absen_text, 'https://files.catbox.moe/v34xjn.png', m, {
               mentions: conn.parseMention(db.chats[m.chat].absen_text)
            })
         }
         break             
      }
   },
   group: true
}