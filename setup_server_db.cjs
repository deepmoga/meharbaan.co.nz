const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  const sqlFile = '/home/meharbaan/app/meharbaan_database.sql';
  const cmd = `
    mysql -u meharbaan -pX2nhE4NiKZr1cdeRO5iZSl6f1 mehrabaan_new < ${sqlFile} &&
    echo "DB_HOST=localhost" > /home/meharbaan/app/.env.local &&
    echo "DB_PORT=3306" >> /home/meharbaan/app/.env.local &&
    echo "DB_USER=meharbaan" >> /home/meharbaan/app/.env.local &&
    echo "DB_PASSWORD=X2nhE4NiKZr1cdeRO5iZSl6f1" >> /home/meharbaan/app/.env.local &&
    echo "DB_NAME=mehrabaan_new" >> /home/meharbaan/app/.env.local &&
    chown meharbaan:meharbaan /home/meharbaan/app/.env.local &&
    su - meharbaan -c "cd /home/meharbaan/app && npm run build" &&
    pm2 restart meharbaan
  `;
  
  console.log('Executing DB import and build on server...');
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
