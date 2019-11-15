const cmds = require('../cmds');

module.exports = function(program) {
    Object.values(cmds).reduce((program, func) => func(program), program)
}