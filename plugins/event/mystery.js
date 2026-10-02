exports.default = {
   start: async (m, {
      conn
   }) => {
      if (word(m.text, 'open') && gift[m.chat] && m.isGroup && !m.isBot) {
         if (gift[m?.chat?.hadiah] == undefined) return
         if (gift[m.chat]) gift[m.chat].lastActive = Date.now();
         await m.reply('Tunggu Sedang Membuka Kotak');
         const caption = `🎁 *Selamat @${m.sender.split('@')[0]} Kamu Mendapatkan* 🎉\n` +
            `*+${gift[m.chat].hadiah.limit} Limit* 🎟\n` +
            `*+${gift[m.chat].hadiah.uang} Uang* 💰\n` +
            `*Mystery Box Akan Ada Lagi Selanjutnya* ♻`;
         await conn.reply(m.chat, caption, gift[m.chat].msg, { mentions: [m.sender]});
         db.users[m.sender].limit += parseInt(gift[m.chat].hadiah.limit);
         db.users[m.sender].uang += parseInt(gift[m.chat].hadiah.uang);
         await sleep(1000);
         await conn.delete(m.chat, gift[m.chat].msg);
         delete gift[m.chat];
      } else if (word(m.text, 'open') && !gift[m.chat] && m.isGroup && !m.isBot) {
         m.reply('Ups Kotak Mystery Mungkin Sudah Kadaluwarsa, Tunggu Selanjutnya!');
      }
   }
}