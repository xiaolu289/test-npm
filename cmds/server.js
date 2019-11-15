const minimist = require('minimist')
const net = require('net');
const path = require('path');

module.exports = function(program) {
    program
    .command('server')
    .description('link to resource server')
    .option('-H, --host', 'The host of server')
    .option('-P, --port', 'The port of server')
    .action(()=>{
        var params = minimist(process.argv.slice(3));
        var host = params.H;
        var post = params.P;
        console.log('host：', host);
        console.log('post：', post);

        const server = net.createServer((c) => {
            // 'connection' 监听器。
            console.log('客户端已连接');
            c.on('end', () => {
                console.log('客户端已断开连接');
            });
            c.write('你好\r\n');
            c.pipe(c);
        });
        server.on('error', (err) => {
            throw err;
        });
        server.listen(post, () => {
            console.log('服务器已启动');
        });
    })
    return program
}