const EventEmitter = require('events');
const ready = require('get-ready');
const Messager = require('./messager.js');
const Manager = require('./manager.js');

class Master extends EventEmitter{
    constructor(options) {
        super();
        this.options = options;
        this.messager = new Messager(this);
        this.manager = new Manager();
        ready.mixin(this);
        console.log(this.options);
        this.ready(function() {
            console.log('master ready!');
        })
        this.start();
    }
    start() {
        this.ready(true);
    }
}

module.exports = Master