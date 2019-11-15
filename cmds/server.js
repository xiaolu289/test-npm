const cleanArgs = require('../lib/cleanArgs')
const slash = require('slash')
const minimist = require('minimist')
const path = require('path');

module.exports = function(program) {
    program
    .command('server')
    .description('link to resource server')
    .option('-H, --host', 'The host of server')
    .option('-P, --port', 'The port of server')
    .action(()=>{
        var params = minimist(process.argv.slice(3));
        console.log('params：', params);
        console.log('cwd：', process.cwd());
        console.log('__dirname：',__dirname);
        console.log('./:',path.resolve('./'));
    })
    return program
}