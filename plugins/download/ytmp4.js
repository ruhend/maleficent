exports.default = {
   tags: 'download',
   help: ['ytmp4'],
   command: ['ytmp4', 'ytv'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Masukan Link Youtubenya contoh:\n${prefix+command} https://youtu.be/MvsAesQ-4zA`);
      m.react('📥')
      const video = await Scraper.ocean(text, 'mp4', 1080).catch(async () => await Scraper.ocean(text, 'mp4', 720)).catch(async () => await Scraper.ocean(text, 'mp4', 480)).catch(async () => await Scraper.ocean(text, 'mp4', 360));
      const { thumbnail } = await Scraper.getInfoYoutube(text);
      const caption = '*YouTube*\n' +
      `*${video.title}*\n\n` +
      `*Loading video sedang di kirim*`;
       await conn.adReply(m.chat, caption, thumbnail, m);
       await conn.sendFile(m.chat, video.media, '', m, {
          asDocument: true,
          fileName: `${video.title}-${video?.quality || ''}~Ruhend-MD.mp4`,
          mimetype: 'video/mp4'
       })
   },
   limit: 2
}