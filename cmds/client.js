const cleanArgs = require('../lib/cleanArgs')
const slash = require('slash')
const minimist = require('minimist')
const path = require('path');

module.exports = function(program) {
    program
    .command('client <server-ip>')
    .description('link to resource server')
    .action((ip, cmd)=>{
        var options = cleanArgs(cmd);
        var params = minimist(process.argv.slice(3));
        console.log('params：', params);
        console.log('name：', ip);
        console.log('options：', options);
        console.log('cwd：', process.cwd());
        console.log('__dirname：',__dirname);
        console.log('./:',path.resolve('./'));
    })
    return program
}