const search = require('yt-search');
const fetch = require('node-fetch');
exports.default = {
   tags: 'download',
   help: ['play', 'lagu'],
   command: ['play', 'lagu'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Masukan Lagu Yang Ingin Di Cari\ncontoh ${prefix+command} papinka sana sini aku rindu atau .play linknya https://youtu.be/A5Jj6Ib91zA`);
      m.react('🎧')
      let data = await search(text)
      const res = data.all
      const url = data.videos[0]
      const link = url.url
      const thumb = `https://i.ytimg.com/vi/${url.videoId}/0.jpg`
      let result = '';
      result += `🎧 〔 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐏𝐋𝐀𝐘 〕\n`
      result += `*⭔ Title:* ${url.title}\n`
      result += `*⭔ Durasi:* ${url.timestamp}\n`
      result += `*⭔ Views:* ${url.views.toLocaleString()}\n`
      result += `*⭔ Name Channel:* ${url.author.name}\n`
      result += `*⭔ Channel:* ${url.author.url}\n`
      result += `*⭔ URL Video:* ${url.url}\n\n`
      result += ` *Loading audio sedang dikirim...*`
      conn.adReply(m.chat, result, thumb ?? cover, m)
      const audio = await Scraper.ocean(link, 'mp4', 144).catch(async () => await Scraper.ocean(link, 'mp4', 360)).catch(async () => await Scraper.ocean(link, 'mp4', 480)).catch(async () => await Scraper.ocean(link, 'mp4', 720)).catch(async () => await Scraper.ocean(link, 'mp4', 1080)).catch(async () => await Scraper.ocean(text, 'mp3')).catch(async () => await toBuffer((await (await fetch(`https://api.azbry.com/api/download/ytmp3?url=${link}`)).json()).result.download));
      const pretty = await Utils.mp3Play(audio?.media || audio);
      if (audio.media) m.react('✅')
      else if (audio && !audio.media) m.react('🔥')
      await conn.sendFile(m.chat, pretty, url.title, m, { ptt: true })
   },
   limit: 2
}