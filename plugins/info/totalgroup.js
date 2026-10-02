exports.default = {
   tags: 'info',
   help: ['totalgroup', 'totalgc'],
   command: ['totalgroup', 'totalgc'],
   start: async (m, {
      conn,
      store,
      text,
      Format
   }) => {
      m.reply(`Obtaining data please wait \n${text.includes('--desc') ? '' : 'use --desc to see description (optional)'}\nMaybe this takes a long time ...`)
      let group = Object.keys(db.chats)
      let count = 0
      let caption = ''
      for await (let i of group) {
         try {
            if (i === 'community') continue
            const accept = await conn.cacheGroupMetadata(i)
            if (!accept) continue
            count += 1
         } catch {
            if (i !== 'community') delete db.chats[i]
            await sleep(1000)
         }
      }
      let teks_gc = `*Total Data Chat ${setting.botName}*\nTotal Group: ${count} group\n\n`
      for await (let i of Object.keys(db.chats)) {
         if (i === 'community') continue
         const data = await conn.cacheGroupMetadata(i)
         const nama = data.subject
         const desc = data.desc || 'No Description'
         teks_gc += `*ID:* ${i}\n*Name:* ${nama}\n${text.includes('--desc') && isOwner ? `*Description:* ${desc}` : ''}\n\n`
      }      
      caption += teks_gc
      conn.adReply(m.chat, caption.trim(), cover, m)
   }
}