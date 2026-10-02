exports.default = {
   tags: 'info',
   help: ['owner', 'creator'],
   command: ['owner', 'creator'],
   start: async (m) => {
      const number = String(setting.owner[0]).replace(/\D/g, '');
      const name = setting.ownerName;
      const vcard = [
         'BEGIN:VCARD',
         'VERSION:3.0',
         `FN:${name}`,
         `TEL;type=CELL;type=VOICE;waid=${number}:+${number}`,
         'END:VCARD'
      ].join('\n');
      await m.reply({
         contactMessage: {
            displayName: name,
            vcard
         }
      });
   }
};
