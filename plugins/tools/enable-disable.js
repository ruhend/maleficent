const { restoreMongo } = require('../../lib/src/cloud/mongo-db.js');
const { restoreGithub } = require('../../lib/src/cloud/github-db.js');
const { restoreGitlab } = require('../../lib/src/cloud/gitlab-db.js');
const { restoreSupabase } = require('../../lib/src/cloud/supabase-db.js');
exports.default = {
   tags: 'tools',
   help: ['on', 'off', 'enable', 'disable'],
   command: ['on', 'off', 'enable', 'disable'],
   start: async (m, {
      conn,
      text,
      prefix,
      command
   }) => {
      const cmd_on = ['on', 'enable']
      const cmd_off = ['off', 'disable']
      const owner_admin = m.isOwner || m.isAdmin
      const $ = `${prefix + command} `
      let caption = `*List Options ${command}*\n*contoh:* \n\n`
      caption += $ + `welcome \n`
      caption += $ + `antilink \n`
      caption += $ + `viewonce / once \n`
      caption += $ + `antitoxic / toxic \n`
      caption += $ + `antiphoto \n`
      caption += $ + `antibot \n`
      caption += $ + `antitagsw \n\n`
      if (m.isOwner) {
         caption +=  ` *OWNER* \n`
         caption += $ + `antispam / spam \n`
         caption += $ + `hd / remini\n`
         caption += $ + `sholat / autosholat\n`
         caption += $ + `blockpc / autoblockpc\n`
         caption += $ + `autodl / auto_down \n`
         caption += $ + `autobackup \n`
         caption += $ + `anticall \n`
       //  caption += $ + `autoreadsw / readsw\n`
       //  caption += $ + `autoreactsw / reactsw\n`
         caption += $ + `autoai / ai \n`
         caption += $ + `auto_sticker / sticker\n\n`
         caption += $ + `*jadibot*\nUntuk menyalakan atau mematikan fitur jadibot\n\n`
         caption += $ + `*autobackupall* \nuntuk menyalakan atau mematikan semua auto backup database\n\n`
         caption += $ + `*gconly / grouponly*\nUntuk mengubah akses bot ke mode group saja\n\n`
   //      caption += $ + `*respononlygroup / respononlygc*\nUntuk mematikan dan mengaktifkan respon message groupOnly\n\n`
         caption += $ + `*adreply*\nUntuk mengaktifkan mode pesan dengan thumbnail atau photo\n\n`
        // caption += $ + `*limitpesan*\nUntuk mengaktifkan pesan limit yang di gunakan\n\n`
        // caption += $ + `*limitadreply*\nUntuk mengaktifkan pesan limit yang di gunakan dengan cover atau foto thumbnail\n\n`
         caption += $ + `*mystery / misteri*\nUntuk mematikan dan mengaktifkan misteri box\n\n`
         caption += $ + `*typing*\nUntuk mematikan dan mengaktifkan typing atau mengetik \n\n`
         //caption += $ + `*typingpc / typingprivate*\nUntuk mematikan dan mengaktifkan typing atau mengetik di private chat\n\n`
        // caption += $ + `*recording*\nUntuk mematikan dan mengaktifkan recording atau merekam\n\n`
        // caption += $ + `*recordingpc / recordingprivate*\nUntuk mematikan dan mengaktifkan recording atau merekam di private chat\n\n`
         caption += $ + `*read*\nUntuk mematikan dan mengaktifkan read atau membaca chat\n\n`
        // caption += $ + `*readpc / readprivate*\nUntuk mematikan dan mengaktifkan read atau membaca chat di private chat\n\n`
         caption += $ + `*clearchat*\nUntuk mengaktifkan dan mematikan clear chat (membersihkan chat ke group)\n\n`
         caption += 'Untuk mengubah pengaturan lain ada juga di menu .set'
      }
      if (!text) return m.reply(caption.trim())
      switch (text.toLowerCase()) {
         case 'welcome': {
            if (!m.isGroup) return m.reply(mess.group)
            if (!owner_admin) return m.reply(mess.admin)
            if (cmd_on.includes(command)) {
               db.chats[m.chat].welcome = true
               m.reply(`Welcome Berhasil Di Nyalakan Di Group ${m.groupName}`)
            } else if (cmd_off.includes(command)) {
               db.chats[m.chat].welcome = false
               m.reply(`Welcome Berhasil Di Matikan Di Group ${m.groupName}`)
            }
         }
         break
         case 'antilink': {
            if (!m.isGroup) return m.reply(mess.group)
            if (!owner_admin) return m.reply(mess.admin)
            if (cmd_on.includes(command)) {
               db.chats[m.chat].antilink = true
               m.reply(`Antilink berhasil diaktifkan di grup ${m.groupName}`)
            } else if (cmd_off.includes(command)) {
               db.chats[m.chat].antilink = false
               m.reply(`Antilink berhasil matikan di grup ${m.groupName}`)
            }
         }
         break
         case 'viewonce':
         case 'once': {
            if (!m.isGroup) return m.reply(mess.group)
            if (!owner_admin) return m.reply(mess.admin)
            if (cmd_on.includes(command)) {
               db.chats[m.chat].viewOnce = true
               m.reply(`View Once berhasil diaktifkan di grup ${m.groupName}`)
            } else if (cmd_off.includes(command)) {
               db.chats[m.chat].viewOnce = false
               m.reply(`View Once berhasil dimatikan di grup ${m.groupName}`)
            }
         }
         break
         case 'anticall': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               save.global('global.anticall = false', 'global.anticall = true')
               m.reply('anti call berhasil di aktifkan')
            } else if (cmd_off.includes(command)) {
               save.global('global.anticall = true', 'global.anticall = false')
               m.reply('anti call berhasil di matikan')
            }
         }
         break
         case 'blockpc':
         case 'autoblockpc': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               db.settings.block_pc = true
               m.reply('auto block private chat berhasil di aktifkan')
            } else if (cmd_off.includes(command)) {
               db.settings.block_pc = false
               m.reply('auto block private chat berhasil di matikan')
            }
         }
         break
         case 'clearchat': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
             //  const status = await checkState()
              // if (!status) return m.reply('auto clear chat gagal di aktifkan karena file state di folder sessions hilang atau tidak ada')
               db.settings.auto_clear_chat = true
               m.reply('auto clear chat berhasil di aktifkan')
            } else if (cmd_off.includes(command)) {
               db.settings.auto_clear_chat = false
               m.reply('auto clear chat berhasil di matikan')
            }
         }
         break
         case 'sholat':
         case 'autosholat': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               save.global('global.auto_sholat = false', 'global.auto_sholat = true')
               m.reply('auto sholat berhasil di aktifkan')
            } else if (cmd_off.includes(command)) {
               save.global('global.auto_sholat = true', 'global.auto_sholat = false')
               m.reply('auto sholat berhasil di matikan')
            }
         }
         break
         case 'autodl':
         case 'auto_down': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               db.settings.auto_down = true
               m.reply(`auto download berhasil diaktifkan`)
            } else if (cmd_off.includes(command)) {
               db.settings.auto_down = false
               m.reply(`auto download berhasil matikan`)
            }
         }
         break
         case 'auto_sticker':
         case 'sticker':
         case 'stiker': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               db.settings.auto_sticker = true
               m.reply(`auto sticker berhasil diaktifkan\nsekarang kamu dapat membuat stiker hanya dengan mengirim foto`)
            } else if (cmd_off.includes(command)) {
               db.settings.auto_sticker = false
               m.reply(`auto sticker berhasil matikan`)
            }
         }
         break
         case 'antitoxic':
         case 'toxic': {
            if (!m.isGroup) return m.reply(mess.group)
            if (!owner_admin) return m.reply(mess.admin)
            if (cmd_on.includes(command)) {
               db.chats[m.chat].antiToxic = true
               m.reply(`Anti Toxic berhasil diaktifkan di grup ${m.groupName}`)
            } else if (cmd_off.includes(command)) {
               db.chats[m.chat].antiToxic = false
               m.reply(`Anti Toxic berhasil dimatikan di grup ${m.groupName}`)
            }
         }
         break
         case 'antiphoto': {
            if (!m.isGroup) return m.reply(mess.group)
            if (!owner_admin) return m.reply(mess.admin)
            if (cmd_on.includes(command)) {
               db.chats[m.chat].antiPhoto = true
               m.reply(`Anti Photo berhasil diaktifkan di grup ${m.groupName}`)
            } else if (cmd_off.includes(command)) {
               db.chats[m.chat].antiPhoto = false
               m.reply(`Anti Photo berhasil dimatikan di grup ${m.groupName}`)
            }
         }
         break
         case 'antibot': {
            if (!m.isGroup) return m.reply(mess.group)
            if (!owner_admin) return m.reply(mess.admin)
            if (cmd_on.includes(command)) {
               db.chats[m.chat].antiBot = true
               m.reply(`Anti Bot berhasil diaktifkan di grup ${m.groupName}`)
            } else if (cmd_off.includes(command)) {
               db.chats[m.chat].antiBot = false
               m.reply(`Anti Bot berhasil dimatikan di grup ${m.groupName}`)
            }
         }
         break
         case 'antitagsw': {
            if (!m.isGroup) return m.reply(mess.group)
            if (!owner_admin) return m.reply(mess.admin)
            if (cmd_on.includes(command)) {
               db.chats[m.chat].tagsw = true
               m.reply(`Anti Tag SW berhasil diaktifkan di grup ${m.groupName}`)
            } else if (cmd_off.includes(command)) {
               db.chats[m.chat].tagsw = false
               m.reply(`Anti Tag SW berhasil dimatikan di grup ${m.groupName}`)
            }
         }
         break
         case 'hd':
         case 'remini': {
            if (!m.isGroup) return m.reply(mess.group)
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               db.chats[m.chat].hd = true
               m.reply(`HD / Remini berhasil diaktifkan di grup ${m.groupName}`)
            } else if (cmd_off.includes(command)) {
               db.chats[m.chat].hd = false
               m.reply(`HD / Remini berhasil dimatikan di grup ${m.groupName}`)
            }
         }
         break
         /**
         case 'autoreadsw':
         case 'readsw': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               db.settings.readsw = true
               m.reply(`auto readsw berhasil diaktifkan`)
            } else if (cmd_off.includes(command)) {
               db.settings.readsw = false
               m.reply(`auto readsw berhasil dimatikan`)
            }
         }
         break
         case 'autoreactsw':
         case 'reactsw': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               db.settings.reactsw = true
               m.reply(`auto reactsw berhasil diaktifkan`)
            } else if (cmd_off.includes(command)) {
               db.settings.reactsw = false
               m.reply(`auto reactsw berhasil dimatikan`)
            }
         }
         break*/
         case 'antispam':
         case 'spam': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               db.settings.antispam = true
               m.reply(`anti spam berhasil diaktifkan`)
            } else if (cmd_off.includes(command)) {
               db.settings.antispam = false
               m.reply(`anti spam berhasil dimatikan`)
            }
         }
         break
         case 'autoai':
         case 'ai': {
            if (!m.isGroup && !m.isPremium && !m.isOwner) return m.reply(mess.premium)
            if (m.isGroup && !owner_admin) return m.reply(mess.admin)
            if (!m.isGroup && cmd_on.includes(command)) {
               db.users[m.sender].chat_ai = true
               m.reply(`Auto Chat AI Berhasil Di Nyalakan`)
            } else if (m.isGroup && cmd_on.includes(command)) {
               db.chats[m.chat].chat_ai = true
               m.reply(`Auto Chat AI Berhasil Di Nyalakan Di Group ${m.groupName}`)
            } else if (!m.isGroup && cmd_off.includes(command)) {
               db.users[m.sender].chat_ai = false
               m.reply(`Auto Chat AI Berhasil Di Matikan`)
            } else if (m.isGroup && cmd_off.includes(command)) {
               db.chats[m.chat].chat_ai = false
               m.reply(`Auto Chat AI Berhasil Di Matikan Di Group ${m.groupName}`)
            }
         }
         break
         case 'jadibot': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               save.global('global.jadibot_engine = false', 'global.jadibot_engine = true')
               m.reply(`Fitur jadibot sekarang di aktifan\njadibot siap digunakan`)
            } else if (cmd_off.includes(command)) {
               save.global('global.jadibot_engine = true', 'global.jadibot_engine = false')
               m.reply(`Fitur jadibot sukses di matikan`)
            }
         }
         break
         case 'grouponly':
         case 'gconly': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               save.global('global.group_mode = false', 'global.group_mode = true')
               m.reply(`Sukses Mengubah Ke Group Mode \nPrivate Chat Tidak Bisa Di Akses Kecuali Aku , Owner Dan Premium`)
            } else if (cmd_off.includes(command)) {
               save.global('global.group_mode = true', 'global.group_mode = false')
               m.reply(`Sukses Mematikan Group Mode Sekarang Private Chat Dapat Diakses Semua Orang`)
            }
         }
         break
         /*
         case 'respononlygroup':
         case 'respononlygc': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               save.global('global.group_only_message = false', 'global.group_only_message = true')
               m.reply(`Sukses Mengaktifkan Respon ${mess.groupOnly} Pada Chat Pribadi\nJika Mode Group Aktif Dan Jika Ada Pesan Datang Di Pribadi Chat, Kecuali Aku, Owner, Dan Premium Maka Akan Merespon ${mess.groupOnly}\n`)
            } else if (cmd_off.includes(command)) {
               save.global('global.group_only_message = true', 'global.group_only_message = false')
               m.reply(`Sukses Mematikan Respon Pesan ${mess.groupOnly} Pada Chat Pribadi\nJika Mode Group Aktif Dan Jika Ada Pesan Datang Di Pribadi Chat, Kecuali Aku, Owner, Dan Premium Maka Sama Sekali Tidak Akan Merespon Apapun\n`)
            }
         }
         break
         */
         case 'adreply': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               save.global('global.adReply = false', 'global.adReply = true')
               m.reply(`adReply Berhasil Di Aktifkan`)
            } else if (cmd_off.includes(command)) {
               save.global('global.adReply = true', 'global.adReply = false')
               m.reply(`adReply Berhasil Di Matifkan`)
            }
         }
         break
         /**
         case 'limitadreply': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               save.global('global.limit_adReply = false', 'global.limit_adReply = true')
               m.reply(`Limit adReply Berhasil Di Aktifkan`)
            } else if (cmd_off.includes(command)) {
               save.global('global.limit_adReply = true', 'global.limit_adReply = false')
               m.reply(`Limit adReply Berhasil Di Matifkan`)
            }
         }
         break
         
         case 'limitpesan': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               save.global('global.use_limit_message = false', 'global.use_limit_message = true')
               m.reply(`Limit Pesan Berhasil Di Aktifkan`)
            } else if (cmd_off.includes(command)) {
               save.global('global.use_limit_message = true', 'global.use_limit_message = false')
               m.reply(`Limit Pesan Berhasil Di Matifkan`)
            }
         }
         breakbreak
         **/
         case 'mystery':
         case 'misteri': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               save.global('global.mystery_box = false', 'global.mystery_box = true')
               m.reply(`Mystery Box Berhasil Di Aktifkan`)
            } else if (cmd_off.includes(command)) {
               save.global('global.mystery_box = true', 'global.mystery_box = false')
               m.reply(`Mystery Box Berhasil Di Matikan`)
            }
         }
         break
        // case 'typinggc':
         case 'typing': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
              // save.global('global.typing_group = false', 'global.typing_group = true')
               setting.typing = true
               save.setting() 
               m.reply(`Typing Berhasil Di Aktifkan`)
            } else if (cmd_off.includes(command)) {
               //save.global('global.typing_group = true', 'global.typing_group = false')
               setting.typing = false
               save.setting()
               m.reply(`Typing Berhasil Di Matikan`)             
            }
         }
         break
        /**
        case 'typingpc':
         case 'typingprivate': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               save.global('global.typing_private = false', 'global.typing_private = true')
               m.reply(`Typing Private / Mengetik Di Private Chat Berhasil Di Aktifkan`)
            } else if (cmd_off.includes(command)) {
               save.global('global.typing_private = true', 'global.typing_private = false')
               m.reply(`Typing Private / Mengetik Di Private Chat Berhasil Di Matikan`)
            }
         }
         break
         **/
        // case 'recordinggc':
       /*  case 'recording': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               //save.global('global.recording_group = false', 'global.recording_group = true')
               setting.recording = true
               save.setting()
               m.reply(`Recording / Merekam Berhasil Di Aktifkan`)               
            } else if (cmd_off.includes(command)) {
               //save.global('global.recording_group = true', 'global.recording_group = false')
               setting.recording = false
               save.setting()
               m.reply(`Recording / Merekam Berhasil Di Matikan`)
            }
         }
         break*/
         /*"case 'recordingpc':
         case 'recordingprivate': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               save.global('global.recording_private = false', 'global.recording_private = true')
               m.reply(`Recording Private / Merekam Di Private Chat Berhasil Di Aktifkan`)
            } else if (cmd_off.includes(command)) {
               save.global('global.recording_private = true', 'global.recording_private = false')
               m.reply(`Recording Private / Merekam Di Private Chat Berhasil Di Matikan`)
            }
         }
         break
         **/
      //   case 'readgc':
         case 'read': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               //save.global('global.read_group = false', 'global.read_group = true')
               setting.read = true
               save.setting()      
               m.reply(`Read / Membaca Berhasil Di Aktifkan`)
            } else if (cmd_off.includes(command)) {
               //save.global('global.read_group = true', 'global.read_group = false')
               setting.read = false
               save.setting()
               m.reply(`Read / Membaca Berhasil Di Matikan`)
            }
         }
         break
         /**
         case 'readpc':
         case 'readprivate': {
            if (!m.isOwner) return m.reply(mess.owner)
            if (cmd_on.includes(command)) {
               save.global('global.read_private = false', 'global.read_private = true')
               m.reply(`Read Private / Membaca Di Private Chat Berhasil Di Aktifkan`)
            } else if (cmd_off.includes(command)) {
               save.global('global.read_private = true', 'global.read_private = false')
               m.reply(`Read Private / Membaca Di Private Chat Berhasil Di Matikan`)
            }
         }
         break
         **/
      }

      const off = async () => {
         await save.global('global.backup_mongo = true', 'global.backup_mongo = false')
         await save.global('global.backup_github = true', 'global.backup_github = false')
         await save.global('global.backup_gitlab = true', 'global.backup_gitlab = false')
         await save.global('global.backup_supabase = true', 'global.backup_supabase = false')
      }

      if (cmd_off.includes(command) && /autobackupall/g.test(text)) {
         if (!m.isOwner) return m.reply(mess.owner)
         await m.reply('Mematikan semua auto backup...')
         await off()
         return m.reply('Semua auto backup berhasil dimatikan ✅')
      }

      if (cmd_on.includes(command) && /autobackupall/g.test(text)) {
         if (!m.isOwner) return m.reply(mess.owner)
         const pick = text.split(" ")[1]
         const order = ['mongo', 'github', 'gitlab', 'supabase']
         if (!pick) return m.reply(`masukan database utama kamu dulu\ncontoh:\n${prefix+command} autobackupall mongo`)
         if (!order.includes(pick)) return m.reply('main harus salah satu dari: mongo, github, gitlab, supabase')
         const list = [pick, ...order.filter(x => x !== pick)]
         await m.reply(`Menyalakan auto backup semua database...`)
         await off()
         await Utils.autoBackupAllDB(m, list, restoreMongo, restoreGithub, restoreGitlab, restoreSupabase)
         return await m.reply('Semua auto backup database berhasil diproses\nrestarting...'), sleep(2000), reset()
      }

      if (/autobackup/g.test(text) || text.split(" ")[1]) {
         if (!m.isOwner) return m.reply(mess.owner)
         const pick = text.split(" ")[1]
         const backupall = `\n\n(optional) kamu juga bisa menyalakan atau mematikan semua autobackup dengan mengetik ${prefix+command} autobackupall\ntapi jika semua nya sudah diisi dengan benar dan tempat backup nya memang sudah kamu buat atau sudah jadi`
         if (!pick) throw `masukan tempat database yang di gunakan contoh:\n${prefix+command} ${text} mongo \n\nhanya tersedia: \n\nmongo\ngithub\ngitlab\nsupabase` + backupall
         if (!['mongo', 'github', 'gitlab', 'supabase'].includes(pick)) throw 'hanya ada (mongo, github, gitlab, supabase) saja sekarang' + backupall
         if (cmd_on.includes(command) && pick === 'mongo') {
            if (backup_mongo) throw 'autobackup monggo audah di aktifkan atau di nyalakan sebelum nya untuk cek ketik .status'
            m.reply('menyalakan auto backup db ke mongo...')
            const response = await restoreMongo()
            if (!response) return response
            await save.global('global.backup_mongo = false', 'global.backup_mongo = true')
            await m.reply('auto backup monggo database berhasil di aktifkan\nrestarting...')
            reset()
         } else if (cmd_off.includes(command) && pick === 'mongo') {
            if (!backup_mongo) throw 'autobackup monggo audah di nonaktifkan atau dimatikan sebelumnya\nuntuk cek ketik .status'
            await m.reply('mematikan auto backup db ke mongo...')
            await save.global('global.backup_mongo = true', 'global.backup_mongo = false')
            return m.reply('auto backup monggo database berhasil di matikan')
         } else if (cmd_on.includes(command) && pick === 'github') {
            if (backup_github) throw 'autobackup github sudah di aktifkan atau di nyalakan sebelum nya untuk cek ketik .status'
            m.reply('menyalakan auto backup db ke cloud github...')
            const data = await restoreGithub()
            if (!data.status) {
               await m.reply('Gagal Menyalakan autobackup github')
               throw data
            }
            await save.global('global.backup_github = false', 'global.backup_github = true')
            return await m.reply('auto backup github database berhasil di aktifkan\nrestarting...'), reset()
         } else if (cmd_off.includes(command) && pick === 'github') {
            if (!backup_github) throw 'autobackup github sudah di nonaktifkan atau dimatikan sebelumnya\nuntuk cek ketik .status'
            await m.reply('mematikan auto backup db ke cloud github...')
            save.global('global.backup_github = true', 'global.backup_github = false')
            return m.reply('auto backup database github berhasil di matikan')
         } else if (cmd_on.includes(command) && pick === 'gitlab') {
            if (backup_gitlab) throw 'autobackup gitlab sudah di aktifkan atau di nyalakan sebelum nya untuk cek ketik .status'
            m.reply('menyalakan auto backup db ke cloud gitlab...')
            const data = await restoreGitlab()
            if (!data.status) {
               await m.reply('Gagal Menyalakan autobackup gitlab')
               throw data
            }
            await save.global('global.backup_gitlab = false', 'global.backup_gitlab = true')
            return await m.reply('auto backup gitlab database berhasil di aktifkan\nrestarting...'), reset()
         } else if (cmd_off.includes(command) && pick === 'gitlab') {
            if (!backup_gitlab) throw 'autobackup gitlab sudah di nonaktifkan atau dimatikan sebelumnya\nuntuk cek ketik .status'
            await m.reply('mematikan auto backup db ke cloud gitlab...')
            save.global('global.backup_gitlab = true', 'global.backup_gitlab = false')
            return m.reply('auto backup database gitlab berhasil di matikan')
         } else if (cmd_on.includes(command) && pick === 'supabase') {
            if (backup_supabase) throw 'autobackup supabase sudah di aktifkan atau di nyalakan sebelum nya untuk cek ketik .status'
            m.reply('menyalakan auto backup db ke cloud supabase...')
            const data = await restoreSupabase()
            if (!data.status) {
               await m.reply('Gagal Menyalakan autobackup supabase')
               throw data
            }
            await save.global('global.backup_supabase = false', 'global.backup_supabase = true')
            return await m.reply('auto backup supabase database berhasil di aktifkan\nrestarting...'), reset()
         } else if (cmd_off.includes(command) && pick === 'supabase') {
            if (!backup_supabase) throw 'autobackup supabase sudah di nonaktifkan atau dimatikan sebelumnya\nuntuk cek ketik .status'
            await m.reply('mematikan auto backup db ke cloud supabase...')
            save.global('global.backup_supabase = true', 'global.backup_supabase = false')
            return m.reply('auto backup database supabase berhasil di matikan')
         }
      }
   }
}