const EventEmitter = require('events');
const ready = require('get-ready');
const Messager = require('./messager.js');
const Manager = require('./manager.js');
const cfork = require('cfork');
const path = require('path');
const cluster = require('cluster');

class Master extends EventEmitter{
    constructor(options) {
        super();
        this.options = JSON.parse(options);
        this.messager = new Messager(this);
        this.workerManager = new Manager();
        this.isAllAppWorkerStarted = false;
        this.startedWorkerCount = 0;
        ready.mixin(this);
        console.log(this.options);
        this.ready(function() {
            console.log('master ready!');
        })
        this.forkAppWorker();
    }
    forkAppWorker() {
        cfork({
            exec: this.getAppWorkerPath(),
            count: this.options.worker,
            args: [JSON.stringify(this.options)],
            refork: true,
            windowsHide: process.platform === 'win32',
            silent: false,
        })
        cluster.on('disconnect', (worker) => {
            console.log(`工作进程 #${worker.id} 已断开连接`);
        })
        cluster.on('fork', (worker) => {
            worker.disableRefork = true;
            this.workerManager.setWorker(worker);
            worker.on('message', (message) => {
                console.log(`master收到消息：${message}`);
            })
        })
        cluster.on('listening', (worker , address) => {
            this.startedWorkerCount ++;
            if (this.isAllAppWorkerStarted || this.startedWorkerCount < this.options.workers) {
                return ;
            }
            this.isAllAppWorkerStarted = true;
            this.ready(true);
        })
        cluster.on('exit', (worker, code, signal) => {
            // remove all listeners to avoid memory leak
            worker.removeAllListeners();
            this.workerManager.deleteWorker(worker.process.pid);
            // send message to agent with alive workers
        })
    }
    getAppWorkerPath() {
        return path.join(__dirname, 'app_worker.js');
    }
}

module.exports = Master