process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
global.setting = require('./config.json')
global.mess = require('./lib/message.js')
global.sock = require('mf-system')
const { 
   connections
} = require('./lib/settings.js')
Object.assign(global, {
   Format: sock.Format,
   default_db: { users: {}, chats: {}, settings: {}, stores: {}, menfess: {}, contacts: {} },      
   moment: require("moment-timezone")
}); 
moment.tz.setDefault("Asia/Jakarta").locale("id");
const PORT = process?.env?.PORT || process?.env?.SERVER_PORT || 8080
const server = require('http').createServer((req, res) => {
   res.setHeader("Content-Type", "application/json");
   res.end(JSON.stringify(setting, null, 2))
});
server.listen(PORT), console.log('server listen on port:', PORT);
require('./lib/src/cloud/mongo-db.js');
require('./lib/src/cloud/github-db.js');
require('./lib/src/cloud/gitlab-db.js');
require('./lib/src/cloud/supabase-db.js');
const startWhatsApp = async () => {
   const conn = await sock.Signal();
   connections(conn);
   conn.ev.on('connection.update', (update) => {
      const { connection } = update;
      if (connection === 'open') {
         console.log(`🟢 Online`);
      } else if (connection === 'connecting') {
         console.log(`🟡 Reconnecting`);
      } else if (connection === 'close') {
         console.log(`🔴 Disconnected`)
         startWhatsApp()
      }
   })   
};
startWhatsApp()