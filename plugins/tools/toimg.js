const fs = require('fs')
const { exec } = require('child_process')
exports.default = {
   tags: 'tools',
   help: ['toimage', 'toimg'],
   command: ['toimage', 'toimg'],
   start: async (m, { 
      conn,
      prefix,
      command
   }) => {
      if (!/webp|image/.test(m?.quoted ? m.quoted.mtype : m.mtype)) return m.reply(`balas stiker dengan caption *${prefix + command}*`);
      const media = m?.quoted ? await m.quoted.download() : await m.download()
      const ran = `tmp/${Date.now()}.webp`
      await fs.promises.writeFile(ran, media)
      const out = `tmp/${Date.now() + 1}.png`
      await conn.adReply(m.chat, wait, cover, m);
      await exec(`ffmpeg -i ${ran} ${out}`, async (err) => {
         if (err) return m.reply(`${err}`);
         await conn.sendFile(m.chat, out, "Berhasil Ke Image ✔", m)
      })
   },
   limit: 2
}