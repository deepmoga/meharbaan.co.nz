const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec('su - meharbaan -c "cd /home/meharbaan/public_html && git remote -v && git status"', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
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
