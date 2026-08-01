const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  const cmd = `su - meharbaan -c "cd /home/meharbaan/public_html && git fetch origin && git checkout main && git reset --hard origin/main && npm install && npm run build"`;
  console.log('Executing:', cmd);
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Build stream closed. Restarting PM2...');
      conn.exec('pm2 restart meharbaan', (err2, stream2) => {
         if(err2) throw err2;
         stream2.on('close', (c, s) => conn.end())
         .on('data', d => console.log('PM2 STDOUT: ' + d))
         .stderr.on('data', d => console.log('PM2 STDERR: ' + d));
      });
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).connect({
  host: '62.84.184.96',
  port: 22,
  username: 'root',
  password: process.env.MEHARBAAN_SSH_PASSWORD
});
