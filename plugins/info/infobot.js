exports.default = {
   tags: 'info',
   help: ['statusbot', 'status', 'info'],
   command: ['statusbot', 'status', 'info'],
   start: async (m, {
      conn
   }) => {
      const Y = 'Aktif 🟢'
      const T = 'Tidak Aktif 🔴'
      let caption = `*STATUS BOT 🤖*\n${setting.botName}\n${conn.getCredentials().meDisplayName}\n\n`
      caption += `Cloud DB: ${global.backup_mongo || global.backup_github || global.backup_gitlab || global.backup_supabase ? Y : T}\n`
      caption += `${global?.backup_mongo ? 'Monggo DB = Aktif ✅' : 'Monggo DB = Tidak Aktif ❎'}\n`
      caption += `${global?.backup_github ? 'Github DB = Aktif ✅' : 'Github DB = Tidak Aktif ❎'}\n`
      caption += `${global?.backup_gitlab ? 'Gitlab DB = Aktif ✅' : 'Gitlab DB = Tidak Aktif ❎'}\n`
      caption += `${global?.backup_supabase ? 'Supabase DB = Aktif ✅' : 'Supabase DB = Tidak Aktif ❎'}\n\n`
      caption += `Self: ${setting.self ? Y : T}\n`
      caption += `Auto Download: ${db.settings.auto_down ? Y : T}\n`
      //caption += `Auto Read Story: ${db.settings.readsw ? Y : T}\n`
    //  caption += `Auto React Story: ${db.settings.reactsw ? Y : T}\n`
      caption += `Anti Call: ${global.anticall ? Y : T}\n`
      caption += `Auto Block PC: ${db.settings.block_pc ? Y : T}\n`
      caption += `Auto Clear Chat: ${db.settings.auto_clear_chat ? Y : T}\n`
      caption += `Group Mode: ${global.group_mode ? Y : T}\n`
      // caption += `Mess Group Only: ${global.group_only_message ? Y : T}\n`
      caption += `Mystery Box: ${global.mystery_box ? Y : T}\n`
      caption += `AdReply: ${global.adReply ? Y : T}\n`
      //   caption += `Use Limit Message: ${global.use_limit_message ? Y : T}\n`
      // caption += `Limit AdReply: ${global.limit_adReply ? Y : T}\n`
      caption += `Read: ${setting.read ? Y : T}\n`
      //caption += `Read Private: ${global.read_private ? Y : T}\n`
      caption += `Typing: ${setting.typing ? Y : T}\n`
      // caption += `Typing Private: ${global.typing_private ? Y : T}\n`
      //  caption += `Recording Group: ${global.recording_group ? Y : T}\n`
      //  caption += `Recording Private: ${global.recording_private ? Y : T}\n`
      //    caption += `Jadibot: ${global.jadibot_engine ? Y : T}\nEngine ${global.jadibot_engine_version ? global.jadibot_engine_version : ''}\n\n`
      caption += `Ram Set: ${setting.ram}\n`
      caption += `Prefix: ${!setting.usedPrefix ? '(tanpa prefix)' : '(perlu prefix)'}\n\n`
      caption += `Untuk mengubah pengaturan langsung dari bot owner bisa cek di menu .set atau ada juga di menu .on .off`
      const msg = await conn.reply(m.chat, caption, m)
      if (!m.isOwner) return await sleep(3000), conn.delete(m.chat, msg);
   }
}