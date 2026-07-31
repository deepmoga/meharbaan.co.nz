const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  const cmds = [
    'cp /home/meharbaan/public_html/.env.local /home/meharbaan/.env.local.backup || true',
    'rm -rf /home/meharbaan/public_html',
    'su - meharbaan -c "git clone https://github.com/deepmoga/meharbaan.co.nz.git /home/meharbaan/public_html"',
    'cp /home/meharbaan/.env.local.backup /home/meharbaan/public_html/.env.local || true',
    'chown meharbaan:meharbaan /home/meharbaan/public_html/.env.local || true',
    'su - meharbaan -c "cd /home/meharbaan/public_html && npm install && npm run build"',
    'pm2 restart meharbaan'
  ];
  
  const cmd = cmds.join(' && ');
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
  password: 'gDdsK5j9EGN8yyHlg1I12r1AD'
});
