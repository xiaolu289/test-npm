const path = require('path')
const child_process = require('child_process')

module.exports = function() {
    console.log('testing-cwd：', process.cwd());
    console.log('testing-__dirname：',__dirname);
    console.log('testing-./:',path.resolve('./'));
    child_process.fork(path.join(__dirname, 'forktest.js'));
}