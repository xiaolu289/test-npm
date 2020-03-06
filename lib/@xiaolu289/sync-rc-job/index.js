// sync-cluster 将会把socket传进来进行job逻辑处理
module.exports = function (socket) {
  // 'connection' 监听器。
  console.log('客户端已连接');
  socket.on('end', () => {
    console.log('客户端已断开连接');
  });
  socket.end('hello world!');
}