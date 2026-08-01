const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  const cmd = `mv /home/meharbaan/app /home/meharbaan/app_old_${Date.now()} && mv /home/meharbaan/public_html /home/meharbaan/app && mkdir /home/meharbaan/public_html && chown -R meharbaan:meharbaan /home/meharbaan/app && pm2 restart meharbaan`;
  
  console.log('Executing:', cmd);
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
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
