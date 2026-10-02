const modes = {
   noob: [-3, 3, -3, 3, '+-', 15000, 10],
   easy: [-10, 10, -10, 10, '*/+-', 20000, 40],
   medium: [-40, 40, -20, 20, '*/+-', 40000, 150],
   hard: [-100, 100, -70, 70, '*/+-', 60000, 350],
   extreme: [-999999, 999999, -999999, 999999, '*/', 99999, 9999],
   impossible: [-99999999999, 99999999999, -99999999999, 999999999999, '*/', 30000, 35000],
   impossible2: [-999999999999999, 999999999999999, -999, 999, '/', 30000, 50000]
};
exports.default = {
   start: async (m, {
      conn
   }) => {
      if (boom[m.chat] && m?.text && !m.isBot) {
         let rewards = {
            limit: 20,
            uang: 40
         }
         let failed = {
            uang: 3
         }
         let id = m.chat
         let timeout = 120000
         let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m?.text)

         if (isSurrender && boom && (id in boom)) {
            await m.reply(`Yah Menyerah 🐷`)
            clearTimeout(boom[id][2])
            delete boom[id]
            return
         }

         let json = boom[id][1].find(v => v.position == m?.text)
         let player = boom[id][1].find(v => v.player == m.sender)
         if (!player) return
         if (!json) return
         if (m?.text === false || m?.text < 1 || m?.text > 9) {
            return m.reply(`🙉 Masukkan angka antara 1 - 9.`)
         }

         if (json.emot == '💥') {
            json.state = true
            let bomb = boom[id][1]
            let teks = `💣 *B O M B*\n@${m.sender.split('@')[0]}\n\n`
            teks += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
            teks += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
            teks += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
            teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
            teks += `*Permainan selesai!*\nkotak berisi bom terbuka 🐽\n❌ Uang Kamu Berkurang - ${failed.uang}💲\nMain Lagi .boom`
            conn.reply(m.chat, teks, boom[id][0], {
               mentions: [m.sender]
            }).then(() => {
               delete boom[id]
               db.users[m.sender].uang -= failed.uang
               clearTimeout(boom[id])
            })
         } else if (json.state) {
            return conn.reply(m.chat, `💣 Kotak ${json.number} sudah di buka silahkan pilih kotak yang lain.`, boom[id][0])
         } else {
            json.state = true
            let changes = boom[id][1]
            let open = changes.filter(v => v.state && v.emot != '💥').length
            if (open >= 8) {
               let teks = `💣  *B O M B*\n@${m.sender.split('@')[0]}\n\n`
               teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
               teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
               teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
               teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
               teks += `*Permainan selesai!* kotak berisi bom tidak terbuka `
               let _a = `${teks}\n\nHadiah 🎉:\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`
               conn.reply(m.chat, _a, boom[id][0], {
                  mentions: [m.sender]
               }).then(() => {
                  db.users[m.sender].uang += rewards.uang
                  db.users[m.sender].limit += rewards.limit
                  clearTimeout(boom[id][2])
                  delete boom[id]
               })
            } else {
               let teks = `💣  *B O M B*\n@${m.sender.split('@')[0]}\n`
               teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
               teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
               teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
               teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
               teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
               conn.reply(m.chat, teks, m, {
                  mentions: [m.sender]
               })
            }
         }
      } else if (caklontong.hasOwnProperty(m.sender.split('@')[0]) && m?.text && !m?.text.includes('.cak') && !m?.text.includes('.caklontong') && !m.isBot) {
         const rewards = {
            limit: 15,
            uang: 25
         }
         const lon = Math.floor(Math.random() * 3)
         const tong = ['❎ Salah', '😵 Kurang Tepat', '😪 Belum Benar'][lon]
         let jawaban = caklontong[m.sender.split('@')[0]]
         let deskripsi = caklontong_desc[m.sender.split('@')[0]]
         if (m?.text.toLowerCase() === jawaban) {
            await conn.adReply(m.chat, `Jawaban Benar 🎉 \n*${deskripsi}* \nKamu mendapatkan:\n+ ${rewards.limit} limit 🎟\n+ ${rewards.uang} uang 💰`, cover, m)
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            delete caklontong[m.sender.split('@')[0]]
            delete caklontong_desc[m.sender.split('@')[0]]
         } else {
            return m.reply(tong)
         }
      } else if (('family100' + m.chat in family100) && m?.text && !m?.text.includes('.family100') && !m?.text.includes('.family') && !m.isBot) {
         const rewards = {
            limit: 10,
            uang: 30
         }
         const room = family100['family100' + m.chat]
         const teks = m?.text.toLowerCase().replace(/[^\w\s\-]+/, '')
         const isSurender = /^((me)?nyerah|surr?ender)$/i.test(m?.text)
         if (!isSurender) {
            const index = room.jawaban.findIndex(v => v.toLowerCase().replace(/[^\w\s\-]+/, '') === teks)
            if (room.terjawab[index]) return !0
            room.terjawab[index] = m.sender
         }
         const isWin = room.terjawab.length === room.terjawab.filter(v => v).length
         const caption = `Jawablah Pertanyaan Berikut :\n\n*${room.soal}*\n\nTerdapat ${room.jawaban.length} Jawaban ${room.jawaban.find(v => v.includes(' ')) ? `(beberapa Jawaban Terdapat Spasi)` : ''} ${isWin ? `\n*Selamat 🎉 Semua Jawaban Terjawab*\n*Setiap Jawaban Benar Bernilai*\n*+ ${rewards.limit} limit* 🎟\n*+ ${rewards.uang} Uang* 💰\n` : isSurender ? 'Menyerah!' : ''}\n${Array.from(room.jawaban, (jawaban, index) => {
            return isSurender || room.terjawab[index] ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@' + room.terjawab[index].split('@')[0] : ''}`.trim() : false
         }).filter(v => v).join('\n')}
         ${isSurender ? '' : ` `}`.trim()
         conn.reply(m.chat, caption, m, {
            mentions: conn.parseMentionPN(caption)
         }).then(mes => {
            return family100['family100' + m.chat].pesan = mes
         }).catch(_ => _)
         const users = conn.parseMentionPN(caption)
         console.log(users)
         const givingAway = async () => {
            for await (let i of users) {
               await sleep(2000)
               db.users[i].limit += rewards.limit
               db.users[i].uang += rewards.uang
            }
         }
         if (isWin) {
            await givingAway()
            delete family100['family100' + m.chat]
         } else if (isSurender) {
            delete family100['family100' + m.chat]
         }
      } else if (kuismath.hasOwnProperty(m.sender.split('@')[0]) && m?.text && !m?.text.includes('.kuishmath') && !m?.text.includes('.math') && !m?.text.includes('.matematika') && !m.isBot) {
         const rewards = {
            limit: 10,
            uang: 30
         }
         const jawaban = kuismath[m.sender.split('@')[0]]
         if (m?.text.toLowerCase() == jawaban) {
            delete kuismath[m.sender.split('@')[0]]
            conn.adReply(m.chat, `*Kuis Matematika*\n\nJawaban Benar\nHadiah :\n *+${rewards.limit} Limit*\n *+${rewards.uang} Uang*\n\nIngin bermain lagi? \nketik .math mode\nPilih Mode:\n- ${Object.keys(modes).join(' \n- ')}\n\nContoh penggunaan:\n\n.math easy`, cover, m).then(() => {
               db.users[m.sender].limit += rewards.limit
               db.users[m.sender].uang += rewards.uang
            })
         } else {
            return m.reply('Salah!')
         }
      } else if (siapakahaku.hasOwnProperty(m.sender.split('@')[0]) && m?.text && !m?.text.includes('.siapakahaku') && !m?.text.includes('.siapaaku') && !m.isBot) {
         const rewards = {
            limit: 20,
            uang: 40
         }
         const jawaban = siapakahaku[m.sender.split('@')[0]]
         if (m?.text.toLowerCase() === jawaban) {
            delete siapakahaku[m.sender.split('@')[0]]
            conn.adReply(m.chat, `Benar 🎊 \nkamu mendapatkan:\n+ ${rewards.limit} limit 🎟\n+ ${rewards.uang} uang 💵`, cover, m)
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
         } else {
            return m.reply('❎ Salah')
         }
      } else if (susunkata.hasOwnProperty(m.sender.split('@')[0]) && m?.text && !m?.text.includes('.susunkata') && !m.isBot) {
         const rewards = {
            limit: 15,
            uang: 30
         }
         const miss = Math.floor(Math.random() * 3)
         const wrong = ['❎ Salah', '🤯 Kurang Tepat', '🥵 Belum Benar'][miss]
         const jawaban = susunkata[m.sender.split('@')[0]]
         if (m?.text.toLowerCase() === jawaban) {
            delete susunkata[m.sender.split('@')[0]]
            conn.adReply(m.chat, `Benar 🎊 \nkamu mendapatkan:\n+ ${rewards.limit} limit 🎟\n+ ${rewards.uang} uang 💵`, cover, m)
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
         } else {
            return m.reply(wrong)
         }
      } else if (tebakbendera.hasOwnProperty(m.sender.split('@')[0]) && m?.text && !m?.text.includes('.tebakbendera') && !m.isBot) {
         const rewards = {
            limit: 25,
            uang: 50
         }
         const jawaban = tebakbendera[m.sender.split('@')[0]]
         if (m?.text.toLowerCase() == jawaban) {
            delete tebakbendera[m.sender.split('@')[0]]
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            conn.adReply(m.chat, `🎮 Tebak Bendera \n\nJawaban Benar 🎉\nHadiah :\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`, cover, m)
         } else {
            return m.reply('Salah')
         }
      } else if (tebakgambar.hasOwnProperty(m.sender.split('@')[0]) && m?.text && !m.isBot) {
         const rewards = {
            limit: 10,
            uang: 20
         }
         const mistaken = Math.floor(Math.random() * 3)
         const message = ['💩 Salah', '🐽 Kurang Tepat', '🍌 Belum Benar'][mistaken]
         const jawaban = tebakgambar[m.sender.split('@')[0]]
         if (m?.text.toLowerCase() === jawaban) {
            conn.adReply(m.chat, `Benar 🌈\nkamu mendapatkan:\n+${rewards.limit} Limit\n+${rewards.uang} Uang`, cover, m)
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            delete tebakgambar[m.sender.split('@')[0]]
         } else {
            return m.reply(message)
         }
      } else if (tebakgame.hasOwnProperty(m.sender.split('@')[0]) && m?.text && !m?.text.includes('.tebakgame') && !m.isBot) {
         const rewards = {
            limit: 25,
            uang: 50
         }
         const jawaban = tebakgame[m.sender.split('@')[0]]
         if (m?.text.toLowerCase() == jawaban) {
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            delete tebakgame[m.sender.split('@')[0]]
            conn.adReply(m.chat, `🎮 Tebak Game \n\nJawaban Benar 🎉\nHadiah :\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`, cover, m)
         } else {
            return m.reply('Salah ❌')
         }
      } else if (tebakkalimat.hasOwnProperty(m.sender.split('@')[0]) && m?.text && !m?.text.includes('.tebakkalimat') && !m.isBot) {
         const rewards = {
            limit: 20,
            uang: 50
         }
         const kal = Math.floor(Math.random() * 3)
         const imat = ['Salah', 'Kurang Tepat ', 'Belum Benar '][kal]
         const jawaban = tebakkalimat[m.sender.split('@')[0]].trim()
         if (m?.text.toLowerCase() === jawaban) {
            delete tebakkalimat[m.sender.split('@')[0]]
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            conn.adReply(m.chat, `Jawaban Benar 🎉\nHadiah :\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`, cover, m)
         } else {
            return m.reply(imat)
         }
      } else if (tebakkata.hasOwnProperty(m.sender.split('@')[0]) && m?.text && !m?.text.includes('.tebakkata') && !m?.text.includes('.teka') && !m.isBot) {
         const rewards = {
            limit: 20,
            uang: 40
         }
         const kat = Math.floor(Math.random() * 3)
         const ta = ['Salah', 'Kurang Tepat', 'Belum Benar'][kat]
         const jawaban = tebakkata[m.sender.split('@')[0]]
         if (m?.text.toLowerCase() == jawaban) {
            delete tebakkata[m.sender.split('@')[0]]
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            conn.adReply(m.chat, `🎮 Tebak Kata 🎮\n\nJawaban Benar 🎉\nHadiah :\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`, cover, m)
         } else {
            return m.reply(ta)
         }
      } else if (tebaktebakan.hasOwnProperty(m.sender.split('@')[0]) && m?.text && !m?.text.includes('.tebaktebakan') && !m?.text.includes('.tebakan') && !m.isBot) {
         const rewards = {
            limit: 10,
            uang: 35
         }
         const jawaban = tebaktebakan[m.sender.split('@')[0]]
         if (m?.text.toLowerCase() == jawaban) {
            delete tebaktebakan[m.sender.split('@')[0]]
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            conn.adReply(m.chat, `Tebak Tebakan 🎮\n\nJawaban Benar 🎉\nHadiah :\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`, cover, m)
         } else {
            return m.reply('Salah ❌')
         }
      } else if (tekateki.hasOwnProperty(m.sender.split('@')[0]) && m?.text && !m?.text.includes('.tekateki') && !m.isBot) {
         const rewards = {
            limit: 15,
            uang: 30
         }
         const jawaban = tekateki[m.sender.split('@')[0]]
         if (m?.text.toLowerCase() == jawaban) {
            delete tekateki[m.sender.split('@')[0]]
            db.users[m.sender].limit += rewards.limit
            db.users[m.sender].uang += rewards.uang
            conn.adReply(m.chat, `Teka Teki 🎮\n\nJawaban Benar 🎉\nHadiah :\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰`, cover, m)
         } else {
            return m.reply('Salah ❎')
         }
      } else if (Object.values(tictactoe).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')) {
         const rewards = {
            limit: 15,
            uang: 30
         }
         let room = Object.values(tictactoe).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
         let ok
         let isWin = !1
         let isTie = !1
         let isSurrender = !1
         if (!/^([1-9]|(me)?nyerah|surr?ender|off|skip)$/i.test(m.text)) return
         isSurrender = !/^[1-9]$/.test(m.text)
         if (m.sender !== room.game.currentTurn) {
            if (!isSurrender) return !0
         }
         if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
            m.reply({
               '-3': 'Game telah berakhir',
               '-2': 'Invalid',
               '-1': 'Posisi Invalid / Salah',
               0: 'Posisi Invalid / Salah',
            } [ok])
            return !0
         }
         if (m.sender === room.game.winner) isWin = true
         else if (room.game.board === 511) isTie = true
         const arr = room.game.render().map(v => {
            return {
               X: '❌',
               O: '⭕',
               1: '1️⃣',
               2: '2️⃣',
               3: '3️⃣',
               4: '4️⃣',
               5: '5️⃣',
               6: '6️⃣',
               7: '7️⃣',
               8: '8️⃣',
               9: '9️⃣'
            } [v]
         })
         if (isSurrender) {
            room.game._currentTurn = m.sender === room.game.playerX
            isWin = true
         }
         const winner = isSurrender ? room.game.currentTurn : room.game.winner
         const str = `Room ID: ${room.id}\n${arr.slice(0, 3).join('')}\n${arr.slice(3, 6).join('')}\n${arr.slice(6).join('')}\n${isWin ? `\n\n@${winner.split('@')[0]} Menang!\nGame berakhir\n@${winner.split('@')[0]} Mendapat Hadiah :\n+${rewards.limit} limit 🎟\n+${rewards.uang} uang 💰\n` : isTie ? `Game berakhir gak ada yang menang / seri` : `Giliran ${['❌', '⭕'][1 * room.game._currentTurn]} (@${room.game.currentTurn.split('@')[0]})`}\n❌: @${room.game.playerX.split('@')[0]}\n⭕: @${room.game.playerO.split('@')[0]}\nKetik *nyerah* untuk menyerah dan mengakui kekalahan`
         if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
            room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
         if (room.x !== room.o) await conn.sendText(room.x, str, m, {
            mentions: conn.parseMentionPN(str)
         })
         await conn.reply(room.o, str, m, {
            mentions: conn.parseMentionPN(str)
         })
         if (isTie || isWin) {
            if (isWin) {
               db.users[winner].limit += rewards.limit
               db.users[winner].uang += rewards.uang
            }
            delete tictactoe[room.id]
         }
      }
   }
}