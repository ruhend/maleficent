exports.default = {
   tags: 'group',
   help: ['promote', 'jadikanadmin', 'jadiadmin'],
   command: ['promote', 'jadikanadmin', 'jadiadmin'],
   start: async (m, { sock, args }) => {
      return (0, socket.executeParticipantAction)(
         m,
         {
            sock,
            args
         },
         {
            method: 'promoteParticipants',
            action: 'promote',
            successTitle: '✅ *Berhasil dipromosikan jadi admin:*',
            failureTitle: '❌ *Gagal:*',
            args
         }
      );
   },
   group: true,
   botAdmin: true,
   admin: true
}