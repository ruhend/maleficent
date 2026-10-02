exports.default = {
   tags: 'group',
   help: [
      'setnamegc',
      'setnamegrup',
      'setnamegroup',
      'grupsetname',
      'groupsetname'
   ],
   command: [
      'setnamegc',
      'setnamegrup',
      'setnamegroup',
      'grupsetname',
      'groupsetname'
   ],
   start: async (m, {
      sock,
      args
   }) => {
      const name = args.join(' ').trim();
      if (!name)
         return m.reply(
            `❌ Format salah.\n\n*Contoh:*\n> ${m.prefix}${m.command} Nama Grup Baru`
         );
      await sock.group.setSubject(m.chat, name);
      return m.reply(`✅ Nama grup diganti jadi *${name}*`);
   },
   group: true,
   admin: true,
   botAdmin: true   
}