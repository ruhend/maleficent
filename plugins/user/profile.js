exports.default = {
   tags: 'user',
   help: ['profile', 'my', 'me', 'profil'],
   command: ['profile', 'my', 'me', 'profil'],
   start: async (m, {
      conn,
      text
   }) => {
      const prem = m.isPremium ? 'Aktif' : 'Tidak'
      const isRegister = db.users[m.sender].registered
      const reg = isRegister ? 'Sudah Daftar' : 'Belum Daftar'
      const limitUser = db.users[m.sender].limit
      const userData = db.users[m.sender]
      const tag = text.match(/@/g)
      m.react('🍎')
      if (tag) {
         try {
            const mention = conn.toJid(cleanNumber(text) + '@lid', m.participants)
            const userTag = db.users[mention]
            const isRegisterTag = db.users[mention].registered
            const limitUserTag = db.users[mention].limit
            const regTag = isRegisterTag ? 'Sudah Daftar' : 'Belum Daftar'
            const isPremiumTag = db.users[mention].premium
            const premTag = isPremiumTag ? 'Aktif' : 'Tidak'
            const _regtime = `${userTag.registeredTime === "" ? "" : '\n ‎ ‎ ‎ ‎ ‎ ‎ ' + userTag.registeredTime}`
            let Other = `👤 *User Profile* @${mention.split("@")[0]}\n`
            Other += `📝 Total Penggunaan Perintah\n ‎ ‎ ‎ ‎ ‎ ‎ Bot: ${userTag.hitCmd} Kali\n`
            Other += `🏷 Terdaftar: ${regTag}\n`
            Other += `🗓 Waktu Daftar:${_regtime}\n`
            Other += `📌 Premium: ${premTag}\n`
            Other += `📍 Nama: ${userTag.name}\n`
            Other += `💋 Umur: ${userTag.umur}\n`
            Other += `📎 Seri: ${userTag.seri}\n`
            Other += `🔖 Limit: ${limitUserTag}\n`
            Other += `💰 Uang: ${userTag.uang}\n`
            Other += `🛍 Kupon: ${userTag.kupon}\n`
            conn.adReply(m.chat, Other, 'https://files.catbox.moe/xldrmi.png', m, {
               mentions: [mention]
            })
         } catch (e) {
            throw new Error('Profile Not Active: \n' + e)
         }
      } else if (!tag) {
         const Regtime = `${userData.registeredTime === "" ? "" : '\n ‎ ‎ ‎ ‎ ‎ ‎ ' + userData.registeredTime}`
         let Profile = `👤 *User Profile* @${m.sender.split('@')[0]}\n`
         Profile += `📝 Total Penggunaan Perintah\n ‎ ‎ ‎ ‎ ‎ ‎ Bot: ${userData.hitCmd} Kali\n`
         Profile += `🏷 Terdaftar: ${reg}\n`
         Profile += `🗓 Waktu Daftar:${Regtime}\n`
         Profile += `📌 Premium: ${prem}\n`
         Profile += `📍 Nama: ${userData.name}\n`
         Profile += `💋 Umur: ${userData.umur}\n`
         Profile += `📎 Seri: ${userData.seri}\n`
         Profile += `🔖 Limit: ${limitUser}\n`
         Profile += `💰 Uang: ${userData.uang}\n`
         Profile += `🛍 Kupon: ${userData.kupon}\n`
         conn.adReply(m.chat, Profile, 'https://files.catbox.moe/xldrmi.png', m)
      }
   }
}