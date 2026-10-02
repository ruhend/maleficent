exports.default = {
   tags: 'tools',
   help: ['tambah', 'kurang', 'kali', 'bagi'],
   command: ['tambah', 'kurang', 'kali', 'bagi'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) return m.reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`);
      const [num_one, num_two] = text.trim().split(/\s+/);
      if (!num_one || !num_two) return m.reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`);
      const nilai_one = Number(num_one);
      const nilai_two = Number(num_two);
      if (isNaN(nilai_one) || isNaN(nilai_two)) return m.reply('Angka tidak valid.');
      if (command == 'tambah') return m.reply(`${nilai_one + nilai_two}`);
      if (command == 'kurang') return m.reply(`${nilai_one - nilai_two}`);
      if (command == 'kali') return m.reply(`${nilai_one * nilai_two}`);
      if (command == 'bagi') return m.reply(`${nilai_one / nilai_two}`);
   }
}