const search = require('yt-search');
exports.default = {
   tags: 'download',
   help: ['ytsearch'],
   command: ['ytsearch', 'yts'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Masukan Info Yang Ingin Di Cari\ncontoh ${prefix+command} laila canggung`);
      let caption = ''
      const thumb = "https://qu.ax/OcWmv.jpeg"
      const data = (await search(text)).all
      data.forEach(v => caption += `\n\n⭔ ID : ${v.videoId}\n⭔ Title : ${v.title}\n⭔ Views : ${v.views}\n⭔ Duration : ${v.timestamp}\n⭔ Upload At : ${v.ago}\n⭔ Url : ${v.url}\n─────────────────`);
      await conn.adReply(m.chat, wait, cover, m)
      conn.reply(m.chat, `*𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐒𝐄𝐀𝐑𝐂𝐇*` + caption, m)            
   }
}