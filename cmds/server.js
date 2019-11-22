const minimist = require('minimist');
const debug = require('debug')('sync-rc:server');
const path = require('path');
const spawn = require('child_process').spawn;
const homedir = require('node-homedir');
const getRotatelog = require('../lib/getRotatelog');

module.exports = function(program) {
    program
    .command('server')
    .description('link to resource server')
    .option('-H, --host', 'The host of server')
    .option('-P, --port', 'The port of server')
    .action(async ()=>{
        const argv = minimist(process.argv.slice(3));
        argv.host = argv.H;
        argv.post = argv.P;
        const command = 'node';
        const serverBin = path.join(__dirname, '../lib/startCluster');
        const HOME = homedir();
        const logDir = path.join(HOME, 'sync-rc/logs');
        argv.stdout = path.join(logDir,'master_stdout.log');
        argv.stderr = path.join(logDir,'master_stderr.log');
        const clusterArgs = JSON.stringify(argv)
        const execArgs = ['--inspect-brk=5050', serverBin, clusterArgs]
        const options = {
            stdio: 'inherit',
            detached: false,
        };
        debug('host：%s', argv.host)
        debug('post：%s', argv.post)
        debug(`Save log file to ${logDir}`);
        const [ stdout, stderr ] = await Promise.all([
          getRotatelog(argv.stdout),
          getRotatelog(argv.stderr)
        ]);
        options.stdio = [ 'ignore', stdout, stderr, 'ipc' ];
        options.detached = true;
        const child = spawn(command, execArgs, options)
        debug('pid：%s', child.pid)
        
        child.on('message', msg => {
          debug('message：%o', msg);
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