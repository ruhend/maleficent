exports.default = {
   tags: 'owner',
   help: ['leavegc', 'leavegroup'],
   command: ['leavegc', 'leavegroup'],
   start: async (m, { 
      sock
   }) => {
      await m.reply(
         'see u, bot akan keluar dari grup. jangan rinduin aku ya🥺.'
      );
      await sock.group.leaveGroup([m.chat]);
   },
   owner: true,
   group: true
};
