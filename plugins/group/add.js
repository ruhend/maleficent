exports.default = {
   tags: 'group',
   help: ['add', 'addmember', 'invitemember'],
   command: ['add', 'addmember', 'invitemember'],
   start: async (m, { 
      sock, 
      args
   }) => {
      return (0, socket.executeParticipantAction)(
         m,
         {
            sock,
            args
         },
         {
            method: 'addParticipants',
            action: 'add',
            successTitle: '✅ *Berhasil ditambah:*',
            failureTitle: '❌ *Gagal:*',
            args
         }
      );
   },
   group: true,
   botAdmin: true,
   admin: true
};
