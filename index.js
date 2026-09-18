console.log('🕒 Starting Maleficent . . .');
const path = require('path');
const { fork } = require('child_process');
const start = () => {
   const p = fork(path.join(__dirname, 'main.js'), process.argv.slice(2), {
         stdio: ['inherit', 'inherit', 'inherit', 'ipc']
      })
      .on('exit', start)
      .on('message', data => {
         if (data === 'reset') {
            console.log('🕒 Restarting Maleficent . . .');
            p.kill()
         } else if (data === 'uptime') {
            p.send(process.uptime());
         }
    })
};
start()