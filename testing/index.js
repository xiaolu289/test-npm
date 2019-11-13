const path = require('path');

module.exports = function() {
    console.log('testing-cwd：', process.cwd());
    console.log('testing-__dirname：',__dirname);
    console.log('testing-./:',path.resolve('./'));
}