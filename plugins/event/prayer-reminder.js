let running = false
exports.default = {
   start: async (m, {
      conn
   }) => {
      const prayerTimes = {
         '04:37': 'Subuh',
         '12:04': 'Zuhur',
         '15:13': 'Ashar',
         '18:12': 'Maghrib',
         '19:23': 'Isya'
      };
      if (prayerTimes[waktu.time] && !running) {
         const caption = `Hai Ka @${m.sender.split("@")[0]} waktu ${prayerTimes[waktu.time]} telah tiba silahkan ambil air wudhu dan segera laksanakan sholat`;
         await conn.reply(m.chat, caption, m, {
            mentions: [m.sender]
         })
         running = true
         await sleep(60000).then(() => running = false, console.log(running));
      }
   }
}