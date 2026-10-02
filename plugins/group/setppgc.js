const fs = require('fs')
exports.default = {
   tags: 'group',
   help: ['setppgc', 'setppgroup'],
   command: ['setppgc', 'setppgroup'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (/image/.test(m.quoted ? m.quoted.mtype : m.mtype)) {
         try {
            const media = m.quoted ? await conn.getFile(m.quoted.content) : await conn.getFile(m.content)
            m.react('🖕')
            const { img } = await Utils.generateProfilePicture(await fs.promises.readFile(media))
            await conn.profile.setProfilePicture(img, m.chat)
            return m.reply(`Sukses mengganti Foto Profile Group`)
         } catch (e) {
            console.log(e)
            return m.reply(`Terjadi kesalahan, coba lagi nanti\n${e}`)
         }
      } else {
         return m.reply(`Kirim gambar dengan caption *${prefix + command}* atau tag gambar yang sudah dikirim`)
      }
   },
   group: true,
   admin: true,
   botAdmin: true
}