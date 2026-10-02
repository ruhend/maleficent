exports.default = {
   tags: 'owner',
   help: ['reset', 'reboot', 'restart'],
   command: ['reset', 'reboot', 'restart'],
   start: async (m) => {
      await m.reply('rebooting...');
      setTimeout(async () => {
         await reset()
      }, 1000);
   },
   owner: true
};
