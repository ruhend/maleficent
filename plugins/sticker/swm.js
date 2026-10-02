const fs = require('fs');
exports.default = {
   tags: 'sticker',
   help: ['stickerwm', 'wm', 'take'],
   command: ['stickerwm', 'swm', 'wm', 'take'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      const pack = text.split('|')[0] ? text.split('|')[0] : ''
      const own = text.split('|')[1] ? text.split('|')[1] : ''
      let author;
      if (own === '')
      author = m.isPremium ? '' : '\n' + setting.botName + ' ' + setting.footer;
      else 
      author = m.isPremium ? own : `${own}\n${setting.botName} ${setting.footer}`;
      if (m.mtype || m.quoted || /webp|sticker|image|video/.test(m.mtype) || m.type === 'stickerMessage' || m.type === 'imageMessage') {
         m.react('😆');
         const buffer = m?.quoted ? await m.quoted.download() : await m.download();
         if (text) {
            m.react('🕒')
            conn.sendSticker(m.chat, buffer, m, {
               packname: pack,
               author: author !== '' ? author + `\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}` : `\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
            }).catch(async () => {
               const p = `./tmp/${Date.now()}.webp`;
               await fs.promises.writeFile(p, buffer);
               const media = (await Scraper.webp2mp4File(p)).result;
               conn.sendSticker(m.chat, media, m, {
                  packname: pack,
                  author: author !== '' ? author + `\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}` : `\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
               })
            })
         } else {
            conn.sendSticker(m.chat, buffer, m, {
               packname: setting.botName,
               author: `${setting.footer === '' || setting.footer === '' ? setting.footer : setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
            }).catch(async () => {
               const p = `./tmp/${Date.now()}.webp`;
               await fs.promises.writeFile(p, buffer);
               const media = (await Scraper.webp2mp4File(p)).result;
               conn.sendSticker(m.chat, media, m, {
                  packname: pack,
                  author: `${setting.footer === '' || setting.footer === '' ? setting.footer : setting.footer}\ncreated : \n${waktu.tanggal}\n${waktu.time} ${waktu.suasana}`
               })
            })
         }
      } else if (/lottie/.test(m.type) || /lottie/.test(m.quoted.mtype)) {
         throw 'Belum support sticker animasi dari WhatsApp resmi';
      } else {
         return m.reply(`Balas stiker dengan caption ${prefix + command}\ngunakan | sebagai pemisahan (optional)`);
      }
   },
   limit: 2
}