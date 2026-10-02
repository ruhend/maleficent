/*extendedTextMessage: e {
      endCardTiles: [],
      text: 'd',
      textArgb: 4294967295,
      backgroundArgb: 4283943423,
      font: 0,
      previewType: 0,
      contextInfo: [e],
      inviteLinkGroupTypeV2: 0
    },
    */
exports.default = {
   start: async (m, {
      conn
   }) => {
      if (m?.type === 'groupStatusMentionMessage') {
         if (m.isOwner) return console.log('Owner sending status mentions');
         if (m.isAdmin) return console.log('Admin sending status mentions');
         conn.reply(m.chat, `*Terdeteksi Pansos Caper Tag Status Ke Group Atau Ngemis Penonton*\n*Silahkan Klik Laporkan dan Blokir Orang Ini*\n*@${m.sender.split("@")[0]}*\n*Agar Status Gak Guna atau Status Sampah Dia Itu Tidak Muncul Di Menu Status Pembaruan Kalian!*`, m, {
            mentions: [m.sender]
         });
         if (m.isBotAdmin) {
            m.delete()
            await sleep(3000)
            conn.group.removeParticipants(m.chat, [m.sender])
         }
         conn.privacy.blockUser(m.sender)
         m.reply(m.sender.split('@')[0] + ' Blocked Cause Sending Status Mention To The Group!')
      }
   }
}