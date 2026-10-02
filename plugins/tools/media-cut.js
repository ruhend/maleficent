exports.default = {
   tags: 'tools',
   help: ['cutaudio', 'pangkasaudio', 'cutvideo', 'pangkasvideo'],
   command: ['cutaudio', 'pangkasaudio', 'cutvideo', 'pangkasvideo'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (/cutaudio|pangkasaudio/.test(command)) {
         if (/audio|document/.test(m.quoted ? m.quoted.mtype : m.mtype)) {
            const time_1 = text.split(' ')[0]
            if (!time_1) return m.reply(`contoh ${prefix+command} awal akhir\ncontoh ${prefix+command} 00:01 01:25\n\nsesuaikan saja waktunya perhatikan juga panjang waktu audionya\n\njika ingin jadi voice note tambahkan di belakang\n--vn atau --ptt\n\ncontoh\n${prefix+command} 00:01 01:25 --vn\natau\n${prefix+command} 00:01 01:25 --ptt`);
            const time_2 = text.split(' ')[1]
            if (!time_2) return m.reply(`contoh ${prefix+command} awal akhir\ncontoh ${prefix+command} 00:01 01:25\n\nsesuaikan saja waktunya perhatikan juga panjang waktu audionya\n\njika ingin jadi voice note tambahkan di belakang\n--vn atau --ptt\n\ncontoh\n${prefix+command} 00:01 01:25 --vn\natau\n${prefix+command} 00:01 01:25 --ptt`);
            const path = await conn.getFile(m.quoted ? m.quoted.content : m.content) 
            m.react('🕒')
            const audio = await Utils.cropAudio(path, time_1, time_2);                 
            m.react('✅')
            conn.sendFile(m.chat, audio, '', m, {
               ptt: text.includes('--vn') || text.includes('--ptt') ? true : false
            })
         } else {
            return m.reply('Balas audio nya Mana ?')
         }
      } else if (/cutvideo|pangkasvideo/.test(command)) {
         if (/video|document/.test(m.quoted ? m.quoted.mtype : m.mtype)) {    
            const time_1 = text.split(' ')[0]
            if (!time_1) return m.reply(`contoh ${prefix+command} awal akhir\ncontoh ${prefix+command} 00:01 01:25\n\nsesuaikan saja waktunya perhatikan juga panjang waktu videonya`);
            const time_2 = text.split(' ')[1]
            if (!time_2) return m.reply(`contoh ${prefix+command} awal akhir\ncontoh ${prefix+command} 00:01 01:25\n\nsesuaikan saja waktunya perhatikan juga panjang waktu videonya`);
            m.reply('Tunggu Sedang Di Proses..');
            const path = await conn.getFile(m.quoted ? m.quoted.content : m.content)             
            m.react('🕒')
            const video = await Utils.cropVideo(path, time_1, time_2);
            m.react('✅')
            conn.sendFile(m.chat, video, '', m)
         } else {
            return m.reply('Balas audio / video nya Mana ?')
         }
      }
   }
}