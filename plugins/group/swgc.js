exports.default = {
   tags: 'group',
   help: ['swgc'],
   command: ['swgc'],
   start: async (m, {
      sock,
      args
   }) => {
      if (!m.quoted) return m.reply('Reply pesan yang mau dijadikan status grup!')
      if (!m.quoted.full) return m.reply('Data pesan tidak ditemukan!')

      const full = m.quoted.full()
      const content = m.quoted.content
      let msgType
      let raw
      let isVideo = false

      if (typeof full['text/plain'] === 'string') {
         msgType = 'extendedTextMessage'
         raw = { text: full['text/plain'] }
      } else {
         const mediaKey = Object.keys(full).find(key => typeof full[key] === 'object')
         if (!mediaKey) return m.reply('Tipe pesan tidak didukung!')
         if (mediaKey === 'audio/mpeg') throw 'convert dulu lagu / audio nya ke vn ketik .tovn'
         msgType = m.quoted.type
         raw = { ...full[mediaKey] }
         isVideo = mediaKey === 'video/mp4'
      }

      const input = args.join(' ').trim()
      let audienceInfo = null
      if (input) {
         const [listName = '', listEmoji = ''] = input.split('|').map(s => s.trim())
         audienceInfo = {
            statusAudienceMetadata: {
               audienceType: 2,
               ...(listName ? { listName } : {}),
               ...(listEmoji ? { listEmoji } : {})
            }
         }
      }

      const sendStatus = async (message) => {
         await sock.message.send(m.chat, {
            groupStatusMessageV2: { message }
         }, {
            customNodes: [
               { tag: 'meta', attrs: { is_group_status: 'true' } }
            ],
            additionalAttributes: { type: 'text' }
         })
         m.react('✅')
      }

      if (isVideo) {
         const path = await sock.getFile(content)
         const parts = await Utils.chunks(path)

         for (const part of parts) {
            const uploaded = await sock.message.upload(part, {
               type: 'video',
               mimetype: raw.mimetype || 'video/mp4'
            })
            await sendStatus({
               videoMessage: {
                  ...raw,
                  ...uploaded,
                  seconds: undefined, 
                  contextInfo: {
                     ...(raw.contextInfo || {}),
                     ...(audienceInfo || {})
                  }
               }
            })
         }
         return
      }

      if (audienceInfo) {
         raw.contextInfo = {
            ...(raw.contextInfo || {}),
            ...audienceInfo
         }
      }

      await sendStatus({ [msgType]: raw })
   },
   admin: true,
   group: true
}
