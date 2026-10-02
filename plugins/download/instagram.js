const fs = require('fs')
const { exec } = require('child_process')
const { igdl } = require('ruhend-scraper')
exports.default = {
   tags: 'download',
   help: ['instagram'],
   command: ['instagram', 'ig', 'igdl'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Masukan instagram \ncontoh: ${prefix+command} https://www.instagram.com/p/DX3y0nUkwYR/?img_index=3&igsh=a3ZuZWp2MGtldW1p`);
      m.react("🕒")
      await conn.adReply(m.chat, wait, cover, m);
      const data = await igdl(text);
      for await (let v of data) {
         const mime = (await fromBuffer(await toBuffer(v))).mime
         if (/video/.test(mime)) {
            await conn.sendFile(m.chat, v, '', m);
         } else {
            const buffer = await toBuffer(v)
            const inputPath = `tmp/${Date.now()}.webp`;
            await fs.promises.writeFile(inputPath, buffer)
            const outPath = `tmp/${Date.now() + 2}.jpg`;
            await fs.promises.writeFile(outPath, buffer)
            await new Promise(async (resolve, reject) => {
               await exec(`ffmpeg -i ${inputPath} ${outPath} -y`, (err) => {
                  if (err) reject(err);
                  else resolve();
               })
            })
            await conn.sendFile(m.chat, outPath, '', m);
         }
      }
   },
   limit: 2
}