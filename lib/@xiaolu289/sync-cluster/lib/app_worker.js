const net = require('net');
const option = JSON.parse(process.argv[2]);

const server = net.createServer((socket) => {
  require('@xiaolu289/sync-rc-job')(socket);
});
server.on('error', (err) => {
  throw err;
});
server.listen(option.post, () => {
  console.log('服务器已启动');
});