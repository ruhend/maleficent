exports.default = {
   tags: 'tools',
   help: ['tovn', 'tomp3', 'toptt', 'toaudio'],
   command: ['tovn', 'tomp3', 'toptt', 'toaudio'],
   start: async (m, {
      conn,
      prefix,
      command
   }) => {
      if (/audio|video|document/.test(m?.quoted ? m.quoted.mtype : m.mtype)) {         
         const media = m?.quoted ? await m?.quoted?.download() : await m.download()
         m.react('🕒')
         const audio = await Utils.mp3(media);
         if (/toptt|tovn/.test(command)) {
            await conn.sendFile(m.chat, audio, '', m, {
               ptt: true
            })
         } else {
            await conn.sendFile(m.chat, audio, '', m);
         }
      } else {
         return m.reply(`reply balas audio, video, atau dokumen dengan pesan ${prefix+command}`)
      }
   },
   limit: 1
}