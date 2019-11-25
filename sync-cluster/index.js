const Master = require('./lib/master');

module.exports = function(options, callback) {
    new Master(options).ready(function() {
        callback();
    });
}