exports.default = {
   tags: 'random',
   help: [
      'aesthetic', 'bike', 'blackpink', 'car', 'cat', 'cosplay', 'doggo',
      'doll', 'islamic', 'justina', 'keyes', 'notnot', 'ppcp', 'ppcouple',
      'procfile', 'proc', 'program', 'pubg', 'rose', 'ryujin', 'tatasurya',
      'walhp', 'wallpaperhp', 'walml', 'wallpaperml', 'zangboy', 'zanggirl',
      'blowjob', 'eba', 'hentai', 'manstrubation', 'manstru', 'milf', 'neko',
      'neko2', 'pussy', 'pusy', 'yuri', 'zetai', 'husbu', 'loli', 'megumin',
      'naruto', 'shota', 'waifu', 'yuki'
   ],
   command: [
      'aesthetic', 'bike', 'blackpink', 'car', 'cat', 'cosplay', 'doggo',
      'doll', 'islamic', 'justina', 'keyes', 'notnot', 'ppcp', 'ppcouple',
      'procfile', 'proc', 'program', 'pubg', 'rose', 'ryujin', 'tatasurya',
      'walhp', 'wallpaperhp', 'walml', 'wallpaperml', 'zangboy', 'zanggirl',
      'blowjob', 'eba', 'hentai', 'manstrubation', 'manstru', 'milf', 'neko',
      'neko2', 'pussy', 'pusy', 'yuri', 'zetai', 'husbu', 'loli', 'megumin',
      'naruto', 'shota', 'waifu', 'yuki'
   ],
   start: async (m, {
      conn,
      command
   }) => {
      let file = '',
         caption = '',
         isSpecial = false,
         specialUrl = ''
      switch (command) {
         case 'aesthetic':
            file = 'aesthetic.json'
            caption = '𝗔𝗘𝗦𝗧𝗛𝗘𝗧𝗜𝗖'
            break
         case 'bike':
            file = 'bike.json'
            caption = '𝐁𝐈𝐊𝐄'
            break
         case 'blackpink':
            file = 'blackpink.json'
            caption = '𝐁𝐋𝐀𝐂𝐊𝐏𝐈𝐍𝐊'
            break
         case 'car':
            file = 'car.json'
            caption = '𝐂𝐀𝐑'
            break
         case 'cat':
            file = 'cat.json'
            caption = '𝐂𝐀𝐓'
            break
         case 'cosplay':
            file = 'cosplay.json'
            caption = '𝐂𝐎𝐒𝐏𝐋𝐀𝐘'
            break
         case 'doggo':
            file = 'doggo.json'
            caption = '𝐃𝐎𝐆𝐆𝐎'
            break
         case 'doll':
            file = 'doll.json'
            caption = '𝐃𝐎𝐋𝐋'
            break
         case 'islamic':
            file = 'islamic.json'
            caption = '𝐈𝐒𝐋𝐀𝐌𝐈𝐂'
            break
         case 'justina':
            file = 'justina.json'
            caption = '𝐉𝐔𝐒𝐓𝐈𝐍𝐀'
            break
         case 'keyes':
            file = 'keyes.json'
            caption = '𝐊𝐄𝐘𝐄𝐒'
            break
         case 'notnot':
            file = 'notnot.json'
            caption = '𝐍𝐎𝐓𝐍𝐎𝐓'
            break
         case 'ppcp':
         case 'ppcouple':
            file = 'ppcp.json'
            caption = '𝐏𝐏𝐂𝐏'
            break
         case 'procfile':
         case 'proc':
            file = 'procfile.json'
            caption = '𝐏𝐑𝐎𝐂𝐅𝐈𝐋𝐄'
            break
         case 'program':
            file = 'program.json'
            caption = '𝐏𝐑𝐎𝐆𝐑𝐀𝐌'
            break
         case 'pubg':
            file = 'pubg.json'
            caption = '𝐏𝐔𝐁𝐆'
            break
         case 'rose':
            file = 'rose.json'
            caption = '𝐑𝐎𝐒𝐄'
            break
         case 'ryujin':
            file = 'ryujin.json'
            caption = '𝐑𝐘𝐔𝐉𝐈𝐍'
            break
         case 'tatasurya':
            file = 'tatasurya.json'
            caption = '𝐓𝐀𝐓𝐀 𝐒𝐔𝐑𝐘𝐀'
            break
         case 'walhp':
         case 'wallpaperhp':
            file = 'walhp.json'
            caption = '𝐖𝐀𝐋𝐋𝐏𝐀𝐏𝐄𝐑 𝐇𝐏'
            break
         case 'walml':
         case 'wallpaperml':
            file = 'walml.json'
            caption = '𝐖𝐀𝐋𝐋𝐏𝐀𝐏𝐄𝐑 𝐇𝐏'
            break
         case 'zangboy':
            file = 'zangboy.json'
            caption = '𝐙𝐀𝐍𝐆𝐁𝐎𝐘'
            break
         case 'zanggirl':
            file = 'zanggirl.json'
            caption = '𝐙𝐀𝐍𝐆𝐆𝐈𝐑𝐋'
            break
         case 'blowjob':
            file = 'blowjob.json'
            caption = '𝐁𝐋𝐎𝐖𝐉𝐎𝐁'
            break
         case 'eba':
            file = 'eba.json'
            caption = '𝐄𝐁𝐀'
            break
         case 'hentai':
            file = 'hentai.json'
            caption = '𝐇𝐄𝐍𝐓𝐀𝐈'
            break
         case 'manstrubation':
         case 'manstru':
            file = 'manstrubation.json'
            caption = '𝐌𝐀𝐍𝐒𝐓𝐑𝐔𝐁𝐀𝐓𝐈𝐎𝐍'
            break
         case 'milf':
            file = 'milf.json'
            caption = '𝐌𝐈𝐋𝐅'
            break
         case 'neko':
            file = 'neko.json'
            caption = '𝐍𝐄𝐊𝐎'
            break
         case 'neko2':
            isSpecial = true
            specialUrl = 'https://nekos.life/api/v2/img/waifu'
            caption = '𝐍𝐄𝐊𝐎'
            break
         case 'pussy':
         case 'pusy':
            file = 'pussy.json'
            caption = '𝐏𝐔𝐒𝐒𝐘'
            break
         case 'yuri':
            file = 'yuri.json'
            caption = '𝐘𝐔𝐑𝐈'
            break
         case 'zetai':
            file = 'zetai.json'
            caption = '𝐙𝐄𝐓𝐀𝐈'
            break
         case 'husbu':
            file = 'husbu.json'
            caption = '𝐇𝐔𝐒𝐁𝐔'
            break
         case 'loli':
            file = 'loli.json'
            caption = '𝐋𝐎𝐋𝐈'
            break
         case 'megumin':
            file = 'megumin.json'
            caption = '𝐌𝐄𝐆𝐔𝐌𝐈𝐍'
            break
         case 'naruto':
            file = 'naruto.json'
            caption = '𝐍𝐀𝐑𝐔𝐓𝐎'
            break
         case 'shota':
            file = 'shota.json'
            caption = '𝐒𝐇𝐎𝐓𝐀'
            break
         case 'waifu':
            file = 'waifu.json'
            caption = '𝐖𝐀𝐈𝐅𝐔'
            break
         case 'yuki':
            file = 'yuki.json'
            caption = '𝐘𝐔𝐊𝐈'
            break
      }
      if (!file && !isSpecial) return
      await conn.adReply(m.chat, loading, cover, m)
      if (isSpecial) {
         const data = await toJSON(specialUrl)
         conn.sendFile(m.chat, data.url, caption, m)
      } else {
         const data = await toJSON(`https://raw.githubusercontent.com/ruhend/database/main/random/${file}`)
         for await (let v of data) await conn.sendFile(m.chat, v, '', m)
         m.reply('👆 ' + caption)
      }
   },
   limit: 2
}