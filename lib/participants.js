module.exports = async (update, conn, opts) => {
   const { Welcome, Bye, Number, Desc } = opts
   const musicBye = 'https://files.catbox.moe/eqcyi3.opus'
   const musicWelcome = ['https://files.catbox.moe/eqcyi3.opus']
   const info = await conn.groupMetadata(update.id);
   const phone = `+${Number.split('@')[0]}`;  
   const msg = {
      key: {
         remoteJid: '6283169719788@s.whatsapp.net',
         fromMe: false,
         id: '3EB0'
      },
      pushName: info.subject,
      broadcast: true,
      message: {
         extendedTextMessage: {
            text: update.action == 'remove' ? `👋 Bye ${phone}\nLeaving The Group ${info.subject}` : ` 👋 Welcome ${phone}\nTo The Group ${info.subject}`,
            contextInfo: {
               mentionedJid: [Number],
               remoteJid: Number,
            }
         }
      }
   };
   try {
      var picture = await conn.profilePictureUrl(Number, 'image');
   } catch {
      try {
         var picture = await conn.profilePictureUrl(update.id, 'image');
      } catch {
         var picture = global?.cover ? global?.cover : setting?.thumbnail
      }
   };   
   if (update.action == 'remove') {
      conn.adReply(update.id, Bye, picture, null, {
         mentions: [Number],
         manyForward: true
      });
      const music_1 = await Format.mp3(await toBuffer(musicBye));
      conn.sendFile(update.id, music_1, '', msg, {
         ...opus,
         fileLength: 10240,
         mentions: [Number]
      })
   } else if (update.action == 'add') {
      conn.adReply(update.id, Welcome, picture, null, {
         mentions: [Number],
         manyForward: true
      });
      for (let music of musicWelcome) {
         const music_1 = await Format.mp3(await toBuffer(music));
         conn.sendFile(update.id, music_1, '', msg, {
            ...opus,
            fileLength: 10240,
            mentions: [Number]
         })
      }
   }
}
