exports.default = {
   start: async (m, {
      conn
   }) => {
      const menfess = global.db.menfess
      const mf = Object.values(menfess).find(v => v.status === true && v.penerima == m.sender)
      const mf_from = Object.values(menfess).find(v => v.status === true && v.dari == m.sender)
      if (mf && !m.isBot && !m.isGroup) {
         if (/[,.#!]/.test(m.text)) return false
         const text = `Hai kak @${mf.dari.split('@')[0]}, kamu menerima balasan nih.\ndari: @${mf.penerima.split('@')[0]}\nPesan balasannya:\n${m.text}\n\n> kamu bisa langsung balas`.trim();
         await conn.reply(mf.dari, text, fake_wa, {
            mentions: [mf.dari, mf.penerima]
         }).then(async () => {
            if (m.isBot || m.isGroup) {
               return false
            } else {
               const pesan = {
                  waktu: `${waktu.tanggal} ${waktu.time}`,
                  nama: m.pushName,
                  number: `${mf.penerima.split('@')[0]}`,
                  pesan: m.text
               }
               mf.pesan.push(pesan)
               await conn.reply(m.chat, 'Berhasil mengirim balasan.', m)
            }
         })
      } else if (mf_from && !m.isBot && !m.isGroup) {
         if (m.command == 'menfessclose' || m.command == 'tutupmenfess' || m.command == 'akhirimenfess') return false
         if (/[,.#!]/.test(m.text)) return false
         const text = `Hai kak @${mf_from.penerima.split('@')[0]}, kamu menerima balasan nih.\n\nPesan balasannya:\n${m.text}\n\n> kamu bisa langsung balas`.trim();
         await conn.reply(mf_from.penerima, text, fake_wa, {
            mentions: [mf_from.penerima]
         }).then(async () => {
            if (!m.isBot || !m.isGroup) {
               const pesan = {
                  waktu: `${waktu.tanggal} ${waktu.time}`,
                  nama: m.pushName,
                  number: `${mf_from.dari.split('@')[0]}`,
                  pesan: m.text
               }
               mf_from.pesan.push(pesan)
               await conn.reply(m.chat, 'Berhasil mengirim balasan.\n\n> jika serasa menfess sudah atau cukup kamu dapat mengakhiri memfess dengan mengetik .menfessclose atau .tutupmenfess', m)
            }
         })
      }
   }
}