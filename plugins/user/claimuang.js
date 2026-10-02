exports.default = {
   tags: 'user',
   help: ['claimuang'],
   command: ['claimuang'],
   start: async (m, {
      conn
   }) => {
      let give = 250
      let currentTime = new Date().getTime()
      let lastUang = new Date(db.users[m.sender].lastUang).getTime()
      let timeDiff = Math.floor((currentTime - lastUang) / (1000 * 60 * 60))
      let remainingTime
      if (timeDiff < 24) {
         remainingTime = 24 - timeDiff
      } else {
         db.users[m.sender].uang += give
         db.users[m.sender].lastUang = new Date().toJSON()
         const text = `Claim Uang berhasil. Kamu dapat ${give} Uang\nKamu Bisa melakukan claim uang lagi dalam 24 jam mendatang.\nGunakan Untuk Membeli Limit\ncontoh .buylimit 50`
         conn.adReply(m.chat, text, cover, m)
      }
      if (typeof remainingTime === "number") {
         return m.reply(`Kamu sudah melakukan claim uang sebelumnya. Tunggu ${remainingTime} jam lagi sebelum dapat melakukan claim uang kembali.`)
      }
   }
}