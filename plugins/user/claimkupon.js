exports.default = {
   tags: 'user',
   help: ['claimkupon'],
   command: ['claimkupon'],
   start: async (m, {
      conn
   }) => {
      let give = 5
      let currentTime = new Date().getTime()
      let lastKupon = new Date(db.users[m.sender].lastKupon).getTime()
      let timeDiff = Math.floor((currentTime - lastKupon) / (1000 * 60 * 60))
      let remainingTime
      if (timeDiff < 48) {
         remainingTime = 48 - timeDiff
      } else {
         db.users[m.sender].kupon += give
         db.users[m.sender].lastKupon = new Date().toJSON()
         let text = `Claim Kupon berhasil. Kamu dapat ${give} Kupon\nKamu Bisa melakukan claim lagi dalam 48 jam mendatang.\n\nJika Ingin Tukar Ke Limit Contoh Penggunaannya: \n.tukarkupon 1 \n\nLihat Ada Berapa Kupon Kamu Berapa Banyak Bisa Di Tukar Ke Limit Ketik .me`
         conn.adReply(m.chat, text, cover, m, {
            showAds: true
         })
      }
      if (typeof remainingTime === "number") {
         return m.reply(`Kamu sudah melakukan claim kupon sebelumnya. Tunggu ${remainingTime} jam lagi sebelum dapat melakukan claim kupon kembali.`)
      }
   }
}