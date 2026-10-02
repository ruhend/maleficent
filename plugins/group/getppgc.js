exports.default = {
   tags: 'group',
   help: ['getppgc', 'ppgc', 'ppgroup', 'ppgrup'],
   command: ['getppgc', 'ppgc', 'ppgroup', 'ppgrup'],
   start: async (m, { 
      sock 
   }) => {
      const pp = await sock.profile.getProfilePicture(m.chat, 'image');
      if (!pp?.url) return m.reply('❌ Foto profil grup tidak ada atau diprivasi.');
      const res = await fetch(pp.url);
      const buffer = Buffer.from(await res.arrayBuffer());
      await sock.message.send(
         m.chat,
         {
            type: 'image',
            media: buffer,
            mimetype: 'image/jpeg',
            caption: '✅ Foto profil grup'
         },
         {
            quoted: m
         }
      );
   },
   group: true
}