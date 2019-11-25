const Master = require('./lib/master');

module.exports = function(options, callback) {
    new Master(options).on('ready', function() {
        callback();
    }).start();
}