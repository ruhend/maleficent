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
   tags: 'user',
   help: ['daftar', 'verify', 'register'],
   command: ['daftar', 'verify', 'register'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (db.users[m.sender].registered) return m.reply(`❗Kamu Sudah Daftar`)
      let user = db.users[m.sender]
      user.autoreg = {
         state: true,
         number: m.sender
      };
      const nama = text.split(".")[0]
      const umur = text.split(".")[1]
      if (!nama || !umur) return m.reply(`*Masukkan nama dan umur yang benar*\n*contoh* *${prefix + command}* *nadia.50*\n\n*daftar otomatis silahkan balas ketik* *y*`)      
      const sn = makeid(10)
      const date = `${waktu.tanggal} ${waktu.time} ${waktu.suasana}`
      user.registered = true
      user.registeredTime = date
      user.name = nama
      user.umur = umur
      user.seri = sn
      user.limit += 10
      let verified = `Berhasil Daftar √\n\n`
      verified += `Nama: ${nama}\n`
      verified += `Umur: ${umur}\n`
      verified += `Serial Number: ${sn}\n\n`
      verified += `kamu mendapatkan 10 limit\n`
      verified += `setelah mendaftar\n`
      verified += `silahkan Ketik .meni`
      conn.adReply(m.chat, verified, cover, m), delete user.autoreg
   }
}