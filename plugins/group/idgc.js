exports.default = {
   tags: 'group',
   help: ['idgc', 'idgrup', 'idgroup', 'grupid', 'groupid'],
   command: ['idgc', 'idgrup', 'idgroup', 'grupid', 'groupid'],
   start: async (m) => {
      await m.reply({
         interactiveMessage: {
            header: {
               title: '📍 Info Group ID',
               hasMediaAttachment: false
            },
            body: {
               text: `📌 *ID Grup:*\n\`\`\`${m.chat}\`\`\``
            },
            footer: {
               text: 'Gunakan tombol di bawah untuk menyalin ID'
            },
            nativeFlowMessage: {
               buttons: [
                  {
                     name: 'cta_copy',
                     buttonParamsJson: JSON.stringify({
                        display_text: '📋 Salin ID Grup',
                        copy_code: m.chat
                     })
                  }
               ],
               messageVersion: 1
            }
         }
      });
   },
   group: true
}