const minimist = require('minimist')
const debug = require('debug')('sync-rc:server');
const path = require('path');
const spawn = require('child_process').spawn;

module.exports = function(program) {
    program
    .command('server')
    .description('link to resource server')
    .option('-H, --host', 'The host of server')
    .option('-P, --port', 'The port of server')
    .action(()=>{
        const params = minimist(process.argv.slice(3));
        const host = params.H;
        const post = params.P;
        const command = 'node';
        const serverBin = path.join(__dirname, '../lib/startCluster');
        const master_stdout = path.join(process.cwd(),'/log/master_stdout.log');
        const master_stderr = path.join(process.cwd(),'/log/master_stderr.log');
        const clusterArgs = JSON.stringify({
            host,
            post
        })
        const execArgs = ['--inspect-brk=5050', serverBin, clusterArgs]
        const options = {
            stdio: 'inherit',
            detached: false,
        };
        debug('host：%s', host)
        debug('post：%s', post)
        options.detached = true;
        const child = spawn(command, execArgs, options)
        console.log(child.pid);
        
        child.on('message', msg => {
          console.log(msg);
          /* istanbul ignore else */
          if (msg && msg.action === 'ready') {
            child.unref();
            child.disconnect();
            process.exit(0);
          }
        });
    })
    return program
}