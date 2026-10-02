exports.default = {
   tags: 'group',
   help: ['linkgc', 'linkgrup', 'linkgroup', 'grouplink', 'gruplink', 'gclink'],
   command: [
      'linkgc',
      'linkgrup',
      'linkgroup',
      'grouplink',
      'gruplink',
      'gclink',
      'link'
   ],
   start: async (m, {
      sock
   }) => {
      const meta = await sock.group.queryGroupMetadata(m.chat);
      const code = await sock.group.queryInviteCode(m.chat);
      return m.reply(
         `*Grup:* ${meta.subject}\n*Link:* https://chat.whatsapp.com/${code}`
      );
   },
   group: true,
   admin: true,
   botAdmin: true
}