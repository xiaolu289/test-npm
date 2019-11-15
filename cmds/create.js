const cleanArgs = require('../lib/cleanArgs')
const slash = require('slash')
const minimist = require('minimist')
const path = require('path');

module.exports = function(program) {
    program
    .command('create <app-name>')
    .description('create an app')
    .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
    .option('-d, --default', 'Skip prompts and use default preset')
    .action((name, cmd)=>{
        var options = cleanArgs(cmd);
        var params = minimist(process.argv.slice(3));
        console.log('params：', params);
        console.log('name：', name);
        console.log('options：', options);
        console.log('cwd：', process.cwd());
        console.log('__dirname：',__dirname);
        console.log('./:',path.resolve('./'));
    })
    return program
}