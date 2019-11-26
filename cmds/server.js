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
    .option('-d, --dir', 'The dir will sync to the client')
    .option('-D, --debug', 'add --inspect-brk=5050 when spawn the process')
    .option('-w, --worker', 'worker count')
    .action(async ()=>{
        const argv = minimist(process.argv.slice(3));
        argv.host = argv.host || argv.H;
        argv.post = argv.port || argv.P;
        argv.dir = argv.dir || argv.d;
        argv.debug = argv.debug || argv.D;
        argv.worker = argv.worker || argv.w || require('os').cpus().length;
        const command = 'node';
        const serverBin = path.join(__dirname, '../lib/startCluster');
        const HOME = homedir();
        const logDir = path.join(HOME, 'sync-rc/logs');
        argv.stdout = path.join(logDir,'master_stdout.log');
        argv.stderr = path.join(logDir,'master_stderr.log');
        const clusterArgs = JSON.stringify(argv)
        const execArgs = [serverBin, clusterArgs]
        if (argv.debug) {
          execArgs.unshift('--inspect-brk=5050');
        }
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
        debug("spawn('%s', '%s', '%s')", command ,execArgs.join(' ') , JSON.stringify(options))
        const child = spawn(command, execArgs, options)
        
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