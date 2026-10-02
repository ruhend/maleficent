const fs = require('fs')
exports.default = {
   tags: 'owner',
   help: ['set', 'setnamebot', 'setbotname', 'setnameowner', 'setnameown', 'setmenu', 'setprefix', 'setfooter', 'setwm', 'setsosmed', 'setram', 'setlink', 'setdelaybox', 'setthumbnail', 'setthumb', 'sthumb', 'setcover', 'setpp', 'setppbot'],
   command: ['set', 'setnamebot', 'setbotname', 'setnameowner', 'setnameown', 'setmenu', 'setprefix', 'setfooter', 'setwm', 'setsosmed', 'setram', 'setlink', 'setdelaybox', 'setthumbnail', 'setthumb', 'sthumb', 'setcover', 'setpp', 'setppbot'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {     
      if (command == 'set') {
         let caption = '*SETTING OWNER* \n*Perintah tersedia untuk mengatur setting bot berikut ini*\n\n'
         caption += '1 .setnamebot atau .setbotname \nUntuk mengganti nama bot \n\n'
         caption += '2 .setnameowner atau .setnameown \nUntuk mengganti nama owner \n\n'
         caption += '3 .setmenu\nUntuk Mengganti Gaya Menu \n\n'
         caption += '4 .setprefix\nUntuk Mengganti Type Penggunaan Prefix\n\n'
         caption += '5 .setfooter atau .setwm \nUntuk mengganti watermark atau footer \n\n'
         caption += '6 .setram atau .ram \nUntuk mengganti nilai ram \n\n'
         caption += '7 .setthumb atau .setthumbnail atau .setcover atau .sthumb \nUntuk mengganti thumbnail utama bot \n\n'
         caption += '8 .setlink \nUntuk mengganti setting link group\n\n'
         caption += '9 .setdelaybox \nUntuk mengganti delay misteri box'
         return m.reply(caption)
      } else if (/setnamebot|setbotname/.test(command)) {
         if (!text) return m.reply(`Masukan Nama Bot nya! \nContoh\n${prefix + command} Maleficent-bot`)
         setting.botName = text
         save.setting()
         return await m.reply(`Sukses mengganti nama bot menjadi ${text}`)
      } else if (/setnameowner|setnameown/.test(command)) {
         if (!text) return m.reply(`Masukan Nama Nya! \nContoh\n${prefix + command} Ruly Henderson`)
         setting.ownerName = text
         save.setting()
         return await m.reply(`Sukses Mengganti Nama Owner Bot Menjadi ${text}`)
      } else if (/setmenu/.test(command)) {
         if (!text) return m.reply(`masukan parameternya contoh \n${prefix + command} 1`)
         const available = ['1', '2']
         if (available.includes(text)) {
            db.settings.menu_type = parseInt(text)
            m.reply(`Sukses Ganti Menu Type Ke ${text}`)
         } else {
            return m.reply(`Opsi Menu Type ${text} Tidak Tersedia Hanya 1 dan 2`)
         }
      } else if (/setprefix/.test(command)) {
         if (!text) return m.reply(`masukan parameternya contoh \n${prefix + command} noprefix atau useprefix`)
         if (text === 'noprefix') {
            setting.usedPrefix = false
            save.setting()
            m.reply(`Sukses Ganti Prefix Type Ke ${text}\nSekarang Command Bisa Merespon Tanpa Perlu Prefix`)
         } else if (text === 'useprefix') {
            setting.usedPrefix = true
            save.setting()
            m.reply(`Sukses Ganti Prefix Type Ke ${text}\nSekarang Bot Hanya Merespon Command Dengan Prefix`)
         } else {
            return m.reply(`Opsi Prefix Type ${text} Tidak Tersedia\nYang Tersedia noprefix atau useprefix`)
         }
      } else if (/setfooter|setwm/.test(command)) {
         if (!text) return m.reply(`Masukan nama footer atau watermark nya! \nContoh\n${prefix + command} © Ruhend`)
         setting.footer = text
         save.setting()
         return await m.reply(`Sukses Mengganti Footer atau Watermark Bot Menjadi ${text}`)
      } else if (/setram|ram/.test(command)) {
         if (!text) return m.reply(`Masukan nilai ram nya! \nContoh\n${prefix + command} 900 MB`)
         setting.ram = text
         save.setting()
         return await m.reply(`Sukses Mengganti Nilai RAM Menjadi ${text}`)
      } else if (/setthumbnail|setthumb|sthumb|setcover/.test(command)) {
         if (/image/.test(m?.quoted ? m.quoted.mtype : m.mtype)) {
            const image = m?.quoted ? await conn.getFile(m.quoted.content) : await conn.getFile(m.content)
            m.reply('Process...')
            const link = (await Scraper.uploadGit(image)).link
            db.settings.cover = link
            setting.cover = link
            cover = link
            save.setting()
            return m.reply(`Sukses Mengganti Thumbnail Bot`)
         } else if (text.startsWith('https')) {
            m.reply('Process...')
            db.settings.cover = text
            setting.cover = text
            cover = text
            save.setting()
            return m.reply(`Sukses Mengganti Thumbnail Bot`)
         } else {
            return m.reply(`Balas Atau Kirim image dengan caption ${prefix + command}\n\nAtau\n\nMasukan link gambar nya contoh ${prefix + command} https://myimage.jpg`)
         }
      } else if (/setlink/.test(command)) {
         if (!text) return m.reply(`Masukan link group nya! \nContoh\n${prefix + command} ${setting.link}\nAtau link lain juga bisa`)
         setting.link = text
         save.setting()
         await m.reply(`Sukses Mengganti Link Setting Menjadi ${text}`)
      } else if (/setdelaybox/.test(command)) {
         if (!text) return m.reply(`Masukan nilainya! \nContoh:\n${prefix + command} 300000\n300 rb itu 5 menit jadi sesuaikan ajah jangan terlalu cepat juga`)
         const newVal = text.replace(/_/g, '')
         save.global(/global\.delay_box\s*=\s*[\d_]+/, `global.delay_box = ${newVal}`)
         await m.reply(`Sukses Mengganti Delay Misteri Box Menjadi ${newVal}`)
      } else if (/delpp|hapuspp/.test(command)) {
         return await conn.removeProfilePicture(conn.decodeJid(conn.user.id)), m.reply('👍')
      } else if (/setppbot|setpp/.test(command)) {
         if (/image/.test(m.quoted ? m.quoted.mtype : m.mtype)) {
            try {
               const media = m.quoted ? await conn.getFile(m.quoted.content) : await conn.getFile(m.content)
               m.react('🖕')
               const { img } = await Utils.generateProfilePicture(await fs.promises.readFile(media))
               await conn.profile.setProfilePicture(img)
               return m.reply(`Sukses mengganti Foto Profile Bot`)
            } catch (e) {
               console.log(e)
               return m.reply(`Terjadi kesalahan, coba lagi nanti\n${e}`)
            }
         } else {
            return m.reply(`Kirim gambar dengan caption *${prefix + command}* atau tag gambar yang sudah dikirim`)
         }
      }
   },
   owner: true
}