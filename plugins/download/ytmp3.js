exports.default = {
   tags: 'download',
   help: ['ytmp3'],
   command: ['ytmp3', 'yta'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Masukan kontolnya! \nContoh: ${prefix+command} https://youtu.be/MvsAesQ-4zA`);       
      m.react('🎵')
      const audio = await Scraper.ocean(text, 'mp4', 144).catch(async () => await Scraper.ocean(text, 'mp4', 360)).catch(async () => await Scraper.ocean(text, 'mp4', 480)).catch(async () => await Scraper.ocean(text, 'mp4', 720)).catch(async () => await Scraper.ocean(text, 'mp4', 1080)).catch(async () => await Scraper.ocean(text, 'mp3'));
      conn.adReply(m.chat, wait, audio?.thumbnail || cover, m);
      const media = await Utils.mp3Play(audio.media);
      await conn.sendFile(m.chat, media, '', m, {
         asDocument: true,
         fileName: `${audio.title}~Ruhend-MD.mp3`,
         mimetype: 'audio/mpeg'
      })
   },
   limit: 2
}