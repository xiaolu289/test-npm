const EventEmitter = require('events');
const Messager = ('./messager');
const Manager = ('./manager')

class Master extends EventEmitter{
    constructor(options) {
        super();
        this.options = options;
        this.messager = new Messager(this);
        this.manager = new Manager();

        console.log(this.options);
    }
    ready() {
        this.emit('ready');
    }
    start() {
        this.ready();
    }
}

module.exports = Master