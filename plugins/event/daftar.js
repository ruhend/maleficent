function makeid(length) {
   let result = '';
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const charactersLength = characters.length;
   for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
         charactersLength));
   }
   return result;
};
exports.default = {
   start: async (m, {
      conn
   }) => {
      if (db.users[m.sender]?.autoreg?.state && m?.text === "y") {
         const umur = m.sender.split('@')[0].slice(-2)
         const sn = makeid(10)
         const date = `${waktu.tanggal} ${waktu.time} ${waktu.suasana}`
         let user = db.users[m.sender]
         user.registered = true
         user.registeredTime = date
         user.name = m.pushName || m.sender.split('@')[0]
         user.umur = umur
         user.seri = sn
         user.limit += 10
         let verified = `Berhasil Daftar Otomatis √\n\n`
         verified += `Nama: ${user.name}\n`
         verified += `Umur: ${umur}\n`
         verified += `Serial Number: ${sn}\n\n`
         verified += `kamu mendapatkan 10 limit\n`
         verified += `setelah mendaftar\n`
         verified += `silahkan Ketik .meni`
         conn.adReply(m.chat, verified, cover, m), delete db.users[m.sender].autoreg 
      }
   }
}