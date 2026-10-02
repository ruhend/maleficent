const fs = require('fs')
const { exec } = require('child_process')
const { ttdl } = require('ruhend-scraper')
exports.default = {
   tags: 'download',
   help: ['tiktok', 'titit', 'tiktokmp3'],
   command: ['tiktok', 'tiktokmp3', 'tt', 'titit', 'ttmp3', 'ttdl'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      switch (command) {
         case 'tiktok':
         case 'tt':
         case 'ttdl':
         case 'titit': {
            if (!text) return m.reply(`masukan tiktok contoh\n${prefix+command} ` + 'https://vm.tiktok.com/ZSqX31DxJ/ \nhttps://vt.tiktok.com/ZSqwXJ2C5/')
            m.react('🕒')
            const { title, author, username, published, like, comment, share, views, bookmark, video, cover: picture, music } = await ttdl(text);
            let caption = `𝐓𝐈𝐊𝐓𝐎𝐊\n`
            caption += `⭔ *Author:* ${author}\n`
            caption += `⭔ *Username:* ${username}\n`
            caption += `⭔ *Published:* ${published}\n`
            caption += `⭔ *Like:* ${like}\n`
            caption += `⭔ *Comment:* ${comment}\n`
            caption += `⭔ *Views:* ${views}\n`
            caption += `⭔ *Bookmark:* ${bookmark}\n`
            caption += `⭔ *Description:* ${title}\n`
            caption += `${setting.botName}`
            const mime = (await fromBuffer(await toBuffer(video))).mime
            if (/video/.test(mime)) {
               await conn.sendFile(m.chat, video, caption, m);
            } else {
               const slides = (await fetchJSON(`https://api.siputzx.my.id/api/d/tiktok/v2?url=${text}`)).data.slides;
               const urls = Object.keys(slides).filter(key => !isNaN(key)).map(key => slides[key].url);
               for await (let v of urls) {
                  const buffer = await toBuffer(v)
                  const inputPath = `tmp/${Date.now()}.jpg`;
                  await fs.promises.writeFile(inputPath, buffer)
                  const outPath = `tmp/${Date.now() + 2}.jpg`;
                  await fs.promises.writeFile(outPath, buffer)
                  await new Promise(async (resolve, reject) => {
                     await exec(`ffmpeg -i ${inputPath} ${outPath} -y`, (err) => {
                        if (err) reject(err);
                        else resolve();
                     })
                  })
                  await conn.sendFile(m.chat, outPath, '', m)
               }
               await conn.sendFile(m.chat, await Utils.mp3Play(await toBuffer(video)), '', m, { ptt: true })
            }
         }
         break
         case 'tiktokmp3':
         case 'ttmp3': {
            if (!text) return m.reply(`Masukan link tiktok nya! \nContoh: ${prefix + command} https://vt.tiktok.com/ZSNYfYdLj`);
            await conn.adReply(m.chat, wait, cover, m);
            const { video } = await ttdl(text);
            await conn.sendFile(m.chat, await Utils.mp3Play(await toBuffer(video)), '', m, { ptt: true });
         }
         break
      }
   },
   limit: 2
}