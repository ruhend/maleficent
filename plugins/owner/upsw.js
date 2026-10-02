exports.default = {
   tags: 'owner',
   help: ['upsw', 'upstatus', 'tagsw'],
   command: ['upsw', 'upstatus', 'tagsw'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!m.quoted) return m.reply('balas pesan yang mau dijadikan status !')
      if (!m.quoted.full()) return m.reply('Data pesan tidak ditemukan!')
      if (/tagsw/.test(command)) {
         if (!m.isGroup) throw mess.group
         if (/text/.test(m.quoted.mtype)) {
            m.react('🕒')
            await conn.status.send({
               content: m.quoted.text,
               recipients: m.participantsMentionedLid.concat(Object.values(db.users).map(v =>  v.lid))
            })
            m.react('✅')
         } else {
            const path =  await conn.getFile(m.quoted.content)
            const type = m.quoted.mtype.split('/')[0]
            if (type === 'video') {
               var vid = await Utils.chunks(path)
            }
            m.react('🕒')
            if (type !== 'video') {
               await conn.status.send({
                  content: {
                     type: type,
                     caption: m.quoted.text,
                     media: path,
                     mimetype: m.quoted.mtype
                  },
                  recipients: m.participantsMentionedLid.concat(Object.values(db.users).map(v =>  v.lid))
               })
               m.react('✅')
            } else {
               for await (let v of vid) {
                  await conn.status.send({
                     content: {
                        type: type,
                        caption: m.quoted.text,
                        media: v,
                        mimetype: m.quoted.mtype
                     },
                     recipients: m.participantsMentionedLid.concat(Object.values(db.users).map(v =>  v.lid))
                  })
                  m.react('✅')
               }
            }
         }
      } else {
         if (/text/.test(m.quoted.mtype)) {
            m.react('🕒')
            await conn.status.send({
               content: m.quoted.text,
               recipients: Object.values(db.contacts).map(c => c.lid_jid).concat(Object.values(db.users).map(v =>  v.lid))
            })
            m.react('✅')
         } else {
            const path = await conn.getFile(m.quoted.content)
            const type = m.quoted.mtype.split('/')[0]
            if (type === 'video') {
               var vid = await Utils.chunks(path)
            }
            m.react('🕒')
            if (type !== 'video') {
               await conn.status.send({
                  content: {
                     type: type,
                     caption: m.quoted.text,
                     media: path,
                     mimetype: m.quoted.mtype
                  },
                  recipients: Object.values(db.contacts).map(c => c.lid_jid).concat(Object.values(db.users).map(v =>  v.lid))
               })
               m.react('✅')
            } else {
               for await (let v of vid) {
                  await conn.status.send({
                     content: {
                        type: type,
                        caption: m.quoted.text,
                        media: v,
                        mimetype: m.quoted.mtype
                     },
                     recipients: Object.values(db.contacts).map(c => c.lid_jid).concat(Object.values(db.users).map(v =>  v.lid))
                  })
                  m.react('✅')
               }
            }
         }
      }
   },
   owner: true
}