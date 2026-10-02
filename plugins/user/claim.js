exports.default = {
   tags: 'user',
   help: ['claim', 'daily', 'hadiah'],
   command: ['claim', 'daily', 'hadiah'],
   start: async (m, {
      conn
   }) => {
      const give = 20
      const currentTime = new Date().getTime()
      const lastClaim = new Date(db.users[m.sender].lastClaim).getTime()
      const timeDiff = Math.floor((currentTime - lastClaim) / (1000 * 60 * 60))
      let remainingTime
      if (timeDiff < 24) {
         remainingTime = 24 - timeDiff
      } else {
         if (!m.isBot) {
            db.users[m.sender].limit += give
            db.users[m.sender].lastClaim = new Date().toJSON()
            const claim = `Claim berhasil. Kamu dapat ${give} Limit\nKamu Bisa melakukan claim lagi dalam 24 jam mendatang.`
            conn.adReply(m.chat, claim, cover, m)
         }
      }
      if (typeof remainingTime === "number") {
         return m.reply(`Kamu sudah melakukan claim dalam 24 jam terakhir. Tunggu ${remainingTime} Jam lagi sebelum dapat melakukan claim kembali.\nkamu juga bisa claim uang  ketik .claimuang`)
      }
   }
}