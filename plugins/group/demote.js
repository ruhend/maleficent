exports.default = {
   tags: 'group',
   help: ['demote', 'hapusadmin', 'unadmin'],
   command: ['demote', 'hapusadmin', 'unadmin'],
   start: async (m, { 
      sock, 
      args 
   }) => {
      const targets = (0, socket.extractTarget)(m, args, {
         multiple: true
      });
      if (!targets.length) return m.reply((0, socket.formatTargetUsage)(m));
      const creds = sock.getCredentials?.();
      const botJid = creds?.meJid;
      const filtered = targets.filter((t) => t !== botJid);
      if (filtered.length !== targets.length) {
         await m.reply('⚠️ Tidak bisa demote bot sendiri.');
      }
      if (!filtered.length) return;
      return (0, socket.executeParticipantAction)(
         m,
         {
            sock
         },
         {
            method: 'demoteParticipants',
            action: 'demote',
            successTitle: '✅ *Berhasil diturunkan dari admin:*',
            failureTitle: '❌ *Gagal:*',
            targets: filtered
         }
      );
   },
   group: true,
   botAdmin: true,
   admin: true,
}
