exports.default = {
   tags: 'owner',
   help: ['ubahnama'],
   command: ['ubahnama'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      if (!text) throw `Masukan nama profil nya contoh: \n${prefix + command} My Bot`
      await conn.profile.setPushName(text)
      m.reply(`Sukses Menggantikan Nama Profil Menjadi ${text}`)
   },
   owner: true
}