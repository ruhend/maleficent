// base zapo sul bot maleficent style
const chalk = require('chalk');
const path = require('path');
const ms = require('ms');
const handler = socket;
const messageCore = socket;
const loadPlugins = socket;
const functions = socket;
const rawMessage = socket;
const usersIdentity = socket;
const groupCache = socket;
const Logger = socket.Logger;
const PLUGINS_DIR = path.join(__dirname, 'plugins');
const PROCESS_STARTED_AT = Math.floor(Date.now() / 1000);
const handledCommandIds = new Set();
const MAX_HANDLED_COMMANDS = 8192;
const { format } = require('util');
function claimCommand(id) {
   if (!id || handledCommandIds.has(id)) return false;
   handledCommandIds.add(id);
   if (handledCommandIds.size > MAX_HANDLED_COMMANDS) {
      handledCommandIds.delete(handledCommandIds.values().next().value);
   }
   return true;
}
const handledEventIds = new Set();
function claimEvent(id) {
   if (!id || handledEventIds.has(id)) return false;
   handledEventIds.add(id);
   if (handledEventIds.size > MAX_HANDLED_COMMANDS) {
      handledEventIds.delete(handledEventIds.values().next().value);
   }
   return true;
}

function isHistoricalMessage(m) {
   const offline =
      m.raw?.offline === true ||
      m.raw?.offline === '1' ||
      m.raw?.rawNode?.attrs?.offline === '1';
   if (offline) return true; //console.log(m.raw.message.audioMessage.ptt)
   const timestamp = Number(m.raw?.messageTimestamp);
   return (
      Number.isFinite(timestamp) &&
      timestamp > 0 &&
      timestamp < PROCESS_STARTED_AT
   );
}

function extractArgs(m) {
   if (!m.command) return [];
   const stripped = m.text.slice(m.prefix.length + m.command.length).trim();
   return stripped ? stripped.split(/\s+/) : [];
}
const usedCommandRecently = new Set();
const isFiltered = (from) => {
   return !!usedCommandRecently.has(from)
};
const addFilter = (from) => {
   usedCommandRecently.add(from)
   setTimeout(() => {
      return usedCommandRecently.delete(from)
   }, 3000); // Delay Spam Every 3 Second
};
const addSpam = (sender, _db) => {
   let position = false
   Object.keys(_db).forEach((i) => {
      if (_db[i].id === sender) {
         position = i
      }
   })
   if (position !== false) {
      _db[position].spam += 1
   } else {
      const bulin = ({
         id: sender,
         spam: 1,
         expired: Date.now() + ms('10m')
      })
      _db.push(bulin)
   }
};
const resetspam = (_dir) => {
   setInterval(() => {
      let position = null
      Object.keys(_dir).forEach((i) => {
         if (Date.now() >= _dir[i].expired) {
            position = i
         }
      })
      if (position !== null) {
         // console.log(`Spam expired: ${_dir[position].id}`)
         _dir.splice(position, 1)
      }
   }, 1000)
};
const isSpam = (sender, _db) => {
   let found = false
   for (let i of _db) {
      if (i.id === sender) {
         let spam = i.spam
         if (spam >= 6) {
            found = true
            return true
         } else {
            found = true
            return false
         }
      }
   }
}

function schema(m) {
   if (m.sender.endsWith('@s.whatsapp.net')) {
      db.users[m.sender] ??= {};
      //   if (!('lid' in db.users[m.sender])) db.users[m.sender].lid = m.isGroup ? m.key.participant : m.key.remoteJid 
      if (Object.keys(db.users[m.sender]).length === 0) {
         db.users[m.sender] = {
            lid: m.isGroup ? m.key.participant : m?.key?.remoteJid === "status@broadcast" ? m.key.participant : m.key.remoteJid,
            name: m?.pushName ?? m.sender.split('@')[0],
            registered: false,
            registeredTime: '',
            umur: '',
            seri: '',
            premium: false,
            premiumTime: '',
            banned: false,
            bannedReason: '',
            limit: m.isOwner ? 1000 : 20,
            kupon: 5,
            uang: 1000,
            hitCmd: 0,
            notes: '',
            lastClaim: '',
            lastHour: '',
            lastUang: '',
            lastKupon: '',
            lastSpin: '',
            spin: 10,
            is_spin: false,
            afkTime: -1,
            afkReason: '',
            chat_ai: false
         };
      }
   }
   if (m.chat.endsWith('@g.us')) {
      db.chats[m.chat] ??= {};
      if (Object.keys(db.chats[m.chat]).length === 0) {
         db.chats[m.chat] = {
            name: m.groupName,
            welcome: true,
            antilink: true,
            mute: false,
            absen: false,
            absen_count: 0,
            absen_user: [],
            absen_text: '',
            viewOnce: true,
            antiToxic: true,
            antiPhoto: false,
            antiBot: false,
            chat_ai: false,
            tagsw: true,
            description: m.groupDesc,
            welcomeCaption: global.group_welcome || '',
            byeCaption: global.group_bye || ''
         };
      } else {
         if (
            m.groupName &&
            m.groupName !== 'Grup Tanpa Nama' &&
            db.chats[m.chat].name !== m.groupName
         ) {
            db.chats[m.chat].name = m.groupName;
         }
         if (
            m.groupDesc &&
            m.groupDesc !== 'Grup Tanpa Desc' &&
            db.chats[m.chat].description !== m.groupDesc
         ) {
            db.chats[m.chat].description = m.groupDesc;
         }
      }
   }
   const settings = global.db.settings ? global.db.settings : global.db.settings = {};
   if (Object.keys(settings).length === 0) {
      global.db.settings = {
         menu_type: 2,
         cover: setting.cover,
        // readsw: true, udh di tes tes g bisa 2 mode ini di lib zapo 
        // reactsw: true,
         antispam: true,
         block_pc: false,
         auto_down: false,
         auto_sticker: false,
         auto_clear_chat: false,
         custom_tags: []
      }
   }
}
async function processCommand(m, sock) {
   if (!m.command) return
   const users = global.db.users[m.sender]
   if (users === undefined) await schema(m)
   const args = extractArgs(m)
   const orang_spam = [];
   const antispam = db.settings.antispam;
   resetspam(orang_spam);
   if (antispam && m.command && isFiltered(m.sender) && !m.isBot && !(m.prefix === undefined || m.prefix === '')) {
      addSpam(m.sender, orang_spam);
      return m.reply(mess.spam);
   };
   if (antispam && m.command && args.length < 1 && !m.isBot) addFilter(m.sender);
   
   const text = m?.text?.split(' ')?.slice(1)?.join(' ') ?? false
   m.args = args
   const plugin = global.plugins?.get(m.command) || false
   if (!plugin) return
   const prefix = m.prefix
   const command = m.command
   //if (setting.usedPrefix && !m.prefix && !m.isOwner) return
   if (plugin.owner && !m.isOwner && setting.evaluate.includes(m.command)) return
   if (setting.self && !m.isOwner && !users.premium) return
   if (m.isGroup && db.chats[m.chat].mute && !m.isOwner && !m.fromMe && !m.isPremium) return
   if (global.group_mode && !m.isGroup && !m.isBot && !m.fromMe && !m.isOwner && !m.isPremium) return
   const owner = setting.owner.map(num => `${num}@s.whatsapp.net`) //.concat(setting.ownerNumber.map(num => `${num}@lid`));
   if (db.settings.block_pc && !m.fromMe && !owner.includes(m.sender) && m.chat !== 'status@broadcast' && !m.isGroup && !m.isPremium && !m.isOwner) {
      console.log(`Private => ${m.sender.split('@')[0]}\n`, m.text);
      console.log(`${m.sender.split('@')[0]} Blocked From Private Chat`)
      return await sock.privacy.blockUser(m.sender)
   };
   if ((db.users[m.sender]?.banned) && !m.isBot && !m.fromMe) {
      if (command && prefix !== '') {
         console.log(`${m.isGroup ? `${m.groupName} => ${m.chat.split('@')[0]}\n` : m.sender.split("@")[0]}\n`, m.text);
         return m.reply(mess.banned + `${db.users[m.sender].bannedReason}`);
      } else {
         console.log(m.isGroup ? `${m.groupName} => ${m.chat}` : `${m.sender.split("@")[0]}`);
         console.log(m.isGroup ? `${m?.pushName} - ${m.sender.split("@")[0]}` : `${m.sender.split("@")[0]}`)
         console.log(body)
         return console.log(mess.banned.replace(/\*/g, ''), `${db.users[m.sender].bannedReason}`);
      }
   };
   if (plugin.disable) return failed(m, sock).disable()
   if (plugin.owner && !m.isOwner) return failed(m, sock).owner()
   if (plugin.private && m.isGroup) return failed(m, sock).private()
   if (plugin.register && !users.registered) return failed(m, sock).register()
   if (plugin.premium && !users.premium && !m.isOwner) return failed(m, sock).premium()
   if (plugin.group && !m.isGroup) return failed(m, sock).group()
   if (plugin.admin && !m.isAdmin && !m.isOwner) return failed(m, sock).admin()
   if (plugin.botAdmin && !m.isBotAdmin) return failed(m, sock).botAdmin()
   const limitCost = plugin.limit ? 1 : Number(plugin.limit || 0);
   if (limitCost > 0) {
      users.limit = Number.isFinite(Number(users.limit)) ? Number(users.limit) : 0;
      if (users.limit < limitCost) return failed(m, sock).limit(users)
      else {
         m.limit = true
         users.limit -= limitCost;
      }
   }
   const context = {
      sock,
      args,
      text,
      prefix,
      command,
      conn: sock
   };
   try {
      await plugin.start(m, context);
   } catch (e) {
      console.error(e)
      m.reply(format(e))
      throw e
   } finally {
      users.hitCmd += 1
      if (m.limit) m.reply(limit_message.replace('%limit', plugin.limit))
   }
}
const send = (m, sock, msg) => adReply ? sock.adReply(m.chat, msg, cover, m) : m.reply(msg)
const failed = (m, sock) => ({
   disable: () => send(m, sock, mess.disable),
   owner: () => send(m, sock, mess.owner),
   private: () => send(m, sock, mess.private),
   register: () => send(m, sock, mess.register),
   premium: () => send(m, sock, mess.premium),
   group: () => send(m, sock, mess.group),
   admin: () => send(m, sock, mess.admin),
   botAdmin: () => send(m, sock, mess.botAdmin),
   limit: (users) => send(m, sock, mess.limit + `\n*Limit Kamu Tersisa ${users.limit}*`)
});
async function runEventPlugins(m, sock) {
   const events = global.eventPlugins;
   if (!events || events.size === 0) return;
   if (!claimEvent(m.id)) return;
   if (setting.self && !m.isOwner && !m.isPremium) return;
   if (m.isGroup && db.chats[m.chat].mute && !m.isOwner && !m.fromMe && !m.isPremium) return
   if (global.group_mode && !m.isGroup && !m.isBot && !m.fromMe && !m.isOwner && !m.isPremium) return

   if ((db.users[m.sender]?.banned) && !m.isBot && !m.fromMe) {
      if (m.command && m.prefix !== '') {
         console.log(`${m.isGroup ? `${m.groupName} => ${m.chat.split('@')[0]}\n` : m.sender.split("@")[0]}\n`, m.text);
         // include command with prefix or not, don't reply
         //return m.reply(mess.banned + `${db.users[m.sender].bannedReason}`);
      } else {
         console.log(m.isGroup ? `${m.groupName} => ${m.chat}` : `${m.sender.split("@")[0]}`);
         console.log(m.isGroup ? `${m?.pushName} - ${m.sender.split("@")[0]}` : `${m.sender.split("@")[0]}`)
         console.log(m.text)
         return console.log(mess.banned.replace(/\*/g, ''), `${db.users[m.sender].bannedReason}`);
      }
   };

   const text = m.text ?? '';
   const context = {
      sock,
      conn: sock,
      args: text ? String(text).trim().split(/\s+/) : [],
      text: m?.text?.split(' ')?.slice(1)?.join(' '),
      prefix: m.prefix,
      command: m.command
   };
   await Promise.allSettled(
      [...events].map(async ([name, plugin]) => {
         if (!plugin.start) return
         try {
            await (plugin.start).call(plugin, m, context);
         } catch (err) {
            console.log(
               chalk.redBright('❌ ') +
               chalk.bgRedBright.black(' ERROR ') +
               ' ' +
               chalk.redBright(`plugins/${name} (event)`)
            );
            console.log(chalk.redBright(err?.stack || err?.message || err));
         }
      })
   );
}
async function messageHandler(sock) {
   const {
      temp: loadedPlugins,
      events: loadedEvents
   } = await loadPlugins.loadPlugins(PLUGINS_DIR);
   global.plugins = loadedPlugins;
   global.eventPlugins = loadedEvents;
   global.cover = global.db?.settings?.cover || setting.cover
   loadPlugins.startPluginWatcher(PLUGINS_DIR);
   Utils.tasks(sock)
   sock.on('message', async (event) => {
      if (setting.eventMessage || setting.eventAll) messageCore.logRawDebug(event);      
      if (event?.key?.isGroup && !groupCache.getCachedGroupMetadata(event?.key?.remoteJid)) await sock.cacheGroupMetadata(event?.key?.remoteJid)
      let m = await handler.serializeMessage(event, sock);
      if (!m) return;            
      if (global.db) await schema(m);
      if (global.isTime) global.isTime()
      if (!('community' in global.db.chats)) global.db.chats.community = {};
      const {
         lidJid,
         pnJid
      } = messageCore.extractIdentityPair(event.key);
      const contactResult = pnJid ?
         usersIdentity.saveOrUpdateContact({
            lidJid,
            pnJid,
            pushName: event.pushName
         }) :
         null;
      rawMessage.saveRawMessage(m);      
      if (m.isNewsletter || !isHistoricalMessage(m) && claimCommand(m.id)) {
         rawMessage.saveRawMessage(m);
         try {
            processCommand(m, sock)
         } catch (err) {
            functions.sendErrorToOwner(sock, err, m, m.command)
         } finally {
            Logger(m, contactResult, sock);
         }
      }
      if (!isHistoricalMessage(m)) {
         runEventPlugins(m, sock).catch((err) => console.log(chalk.redBright('❌ [EVENT] ' + (err?.stack || err?.message || err))))
      }
      if (m.type !== 'protocolMessage') {
         store.saveMessage(m.id, m.raw.message, { chat: m.chat, sender: m.sender })         
      }
   });
   sock.sendMystery = (jid) => {
      return sock.sendFile(jid, 'https://files.catbox.moe/u5rmu8.jpg', 'Mystery Box Tiba\nAda Hadiah Nih\nSilahkan balas *open*', fake_wa)
   };
   sock.sendPrayer = (jid, time) => {
      const caption = `*Waktu ${time} Telah Tiba Silahkan Ambilah Air Wudhu Dan Segera Laksanakan Sholat*\n`
      return sock.adReply(jid, caption.trim(), global?.cover || setting.cover, fake_wa);
   };
   sock.on('message_send', async (sendEvent) => {
      const outgoing = await handler.serializeOutgoing(sendEvent, sock)
      if (global.isTime) global.isTime()
      Logger(outgoing, null, sock)
      rawMessage.saveRawMessage(outgoing)
   });
   let isOwner = false
   const ownerLids = new Set()
   sock.on('call', (event) => {
      const pn = event.callerPnJid ?? event.callCreatorJid
      const lid = event.senderLidJid
      console.log(event.type, event.isVideo ? 'video' : 'voice', 'from', pn ?? lid,
         event.groupJid ? `(group ${event.groupJid})` : '')
      if (!anticall) return
      if (isOwner) return
      const pnNumber = pn?.endsWith('@s.whatsapp.net') ? pn.split('@')[0] : null
      if (pnNumber && setting.owner.includes(pnNumber)) {
         isOwner = true
         if (lid) ownerLids.add(lid)
         return console.log('isOwner:', pn)
      }
      if (lid && ownerLids.has(lid)) {
         isOwner = true
         return console.log('isOwner (lid):', lid)
      }
      return sock.privacy.blockUser(pn ?? lid)
   })
}
exports.messageHandler = messageHandler
const PARTICIPANT_ACTIONS = new Set(['add', 'remove', 'promote', 'demote']);
const GROUP_METADATA_EVENTS_NEEDING_REFRESH = new Set(['subject', 'photo', 'group_code', 'group_description']);
function patchParticipants(jid, action, participants) {
   return groupCache.patchGroupMetadata(jid, (metadata) => {
      if (!Array.isArray(metadata.participants)) return;
      const targetJids = action !== 'add' ? new Set(participants.map((p) => p.jid)) : null;
      switch (action) {
         case 'add':
            for (const p of participants) {
               if (!metadata.participants.some((mp) => mp.jid === p.jid)) {
                  metadata.participants.push({
                     jid: p.jid,
                     type: 'participant',
                     isAdmin: false,
                     isSuperAdmin: false,
                     phoneNumber: p.phoneJid,
                     displayName: p.displayName,
                     username: p.username,
                     expirationSeconds: p.expirationSeconds
                  });
               }
            }
            break;
         case 'remove':
            metadata.participants = metadata.participants.filter((mp) => !targetJids.has(mp.jid));
            break;
         case 'promote':
            for (const mp of metadata.participants) {
               if (targetJids.has(mp.jid)) {
                  mp.isAdmin = true;
                  mp.type = 'admin';
               }
            }
            break;
         case 'demote':
            for (const mp of metadata.participants) {
               if (targetJids.has(mp.jid)) {
                  mp.isAdmin = false;
                  mp.type = 'participant';
               }
            }
            break;
      }
      if (typeof metadata.size === 'number') {
         metadata.size = metadata.participants.length;
      }
   });
}

function groupEventHandler(sock) {
   sock.on('group', async (event) => {
      const jid = event?.groupJid || event?.chatJid;
      if (!jid) return;
      if (setting.self || self || db.chats[jid]?.mute) return
      const meta = await sock.cacheGroupMetadata(jid)
      const action = String(event?.action || '').toLowerCase();
      const number = event?.participants[0]?.phoneJid
      var picture
      try {
         picture = (await sock.profile.getProfilePicture(number, 'image')).url
      } catch {
         try {
            picture = (await sock.profile.getProfilePicture(jid, 'image')).url
         } catch {
            picture = cover
         }
      }
      const subject = meta.subject
      const num = `${number?.split('@')[0]}` || null
      const musicBye = ['https://files.catbox.moe/h3nmj8.mp3']
      const musicWelcome = ['https://files.catbox.moe/h3nmj8.mp3']
      const msg = {
         key: {
            remoteJid: jid,
            fromMe: true,
            id: '3EB0',
            participant: number
         },
         pushName: subject,
         broadcast: true,
         sender: number,
         message: {
            extendedTextMessage: {
               text: action == 'remove' ? `👋 Bye ${num}\nLeaving The Group ${subject}` : ` 👋 Welcome ${num}\nTo The Group ${subject}`,
               contextInfo: {
                  mentionedJid: [number]
               }
            }
         }
      };
      if (action === 'add') {
         sock.adReply(jid, db.chats[jid]?.welcomeCaption.replace("%user", '@' + num).replace("%subject", subject), picture, msg, {
            mentions: [number]
         });
         for (let music of musicWelcome) {
            sock.sendFile(jid, music, '', msg, {
               ptt: true,
               mentions: [number]
            })
         }
      } else if (action === 'remove') {
         sock.adReply(jid, db.chats[jid]?.byeCaption.replace("%user", '@' + num).replace("%subject", subject), picture, msg, {
            mentions: [number]
         });
         for (let music of musicBye) {
            sock.sendFile(jid, music, '', msg, {
               ptt: true,
               mentions: [number]
            })
         }
      }
      const participants = event?.participants || [];
      if (!('community' in global.db.chats)) global.db.chats.community = {};
      if (event?.details?.announceEnabled) {
         global.db.chats['community'][event.chatJid] = {
            name: event.subject         
         }
      };
      if (PARTICIPANT_ACTIONS.has(action) && participants.length) {
         const patched = patchParticipants(jid, action, participants);
         if (patched) {
            console.log(
               chalk.blue(
                  `[GROUP CACHE] Patch participants (${action}) di ${jid} oleh ${event.authorJid || 'unknown'}`
               )
            );
            return;
         }
      }
      const needsFullRefresh = GROUP_METADATA_EVENTS_NEEDING_REFRESH.has(action);
      groupCache.invalidateGroupMetadata(jid);
      await groupCache.getGroupMetadata(jid, sock, {
         force: needsFullRefresh
      });
      console.log(
         chalk.blue(
            `[GROUP CACHE] ${needsFullRefresh ? 'Refetch' : 'Update'} metadata (action: ${action || 'unknown'}) di ${jid}`
         )
      );
   });
}
exports.groupEventHandler = groupEventHandler;