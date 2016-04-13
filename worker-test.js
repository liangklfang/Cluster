const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  //遍历所有的workers
  for (var id in cluster.workers) {
    console.log(cluster.workers[id]);
  }
  /*
这里面的每一个Worker都是这种类型，只能在master中访问
Worker {
  domain: null,
  _events: { message: [Function] },
  _eventsCount: 1,
  _maxListeners: undefined,
  suicide: undefined,//worker.suicide用于判断进程是自己退出还是意外退出的，然后master据此判断是否需要重新产生一个worker,调用kill/disconnect就是undefined
  state: 'none',
  id: 1,//进程唯一一个ID
  process://产生的worker有一个process属性，其值为一个ChildProcess实例
   ChildProcess {
     domain: null,
     _events:
      { internalMessage: [Object],
        error: [Function],
        message: [Function],
        exit: [Object],
        disconnect: [Object] },
     _eventsCount: 5,
     _maxListeners: undefined,
     _closesNeeded: 2,
     _closesGot: 0,
     connected: true,
     signalCode: null,
     exitCode: null,
     killed: false,
     spawnfile: 'C:\\Program Files\\nodejs\\node.exe',
     _handle: Process { owner: [Circular], onexit: [Function], pid: 3520 },
     spawnargs:
      [ 'C:\\Program Files\\nodejs\\node.exe',
        'C:\\Users\\Administrator\\Desktop\\N-blog\\fiboo\\cal' ],
     pid: 3520,
     stdin: null,
     stdout: null,
     stderr: null,
     stdio: [ null, null, null, null ],
     _channel:
      Pipe {
        _externalStream: {},
        fd: -1,
        writeQueueSize: 0,
        buffering: false,
        onread: [Function],
        sockets: [Object] },
     _handleQueue: null,
     send: [Function],
     _send: [Function],
     disconnect: [Function],
     _disconnect: [Function] 
 } }
  */
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);
  //这里的两个worker会共用一个端口号用于监听
}