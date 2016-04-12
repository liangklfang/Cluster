var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
//我们可以看到cluster内部是这样的形式的,其本质上时一个EventEmitter实例
/*EventEmitter实例
EventEmitter {
  domain: null,
  _events: {},
  _eventsCount: 0,
  _maxListeners: undefined,
  Worker://有一个worker对象
   { [Function: Worker]
     super_:
      { [Function: EventEmitter]
        EventEmitter: [Circular],
        usingDomains: false,
        defaultMaxListeners: 10,
        init: [Function],
        listenerCount: [Function]
     }
  },
  isWorker: false,//isWorker函数
  isMaster: true,//isMaster函数
  workers: {},//workers属性
  settings: {},//settings对象
  schedulingPolicy: 1,//schedulingPolicy属性
  SCHED_NONE: 1,
  SCHED_RR: 2,
  setupMaster: [Function],//setupMaster方法
  fork: [Function],//fork函数
  disconnect: [Function] 
  //disconnect函数
}
*/
if (cluster.isMaster) {
    console.log('[master] ' + "master started, pid:" + process.pid);
     //监听fork事件
    cluster.on('fork', function (worker) {
        console.log('[master] ' + 'fork: worker' + worker.id);
    });
    //监听online事件
    cluster.on('online', function (worker) {
        console.log('[master] ' + 'online: worker' + worker.id);
    });
   //监听listening事件
    cluster.on('listening', function (worker, address) {
        console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', address:' + address.address + ":" + address.port);
    });
   //监听disconnect事件
    cluster.on('disconnect', function (worker) {
        console.log('[master] ' + 'disconnect: worker' + worker.id);
    });
    //监听exit事件
    cluster.on('exit', function (worker, code, signal) {
        console.log('[master] ' + 'exit worker' + worker.id + ' died, try to fork a new worker.');
        cluster.fork();
    });
    //根据CPU的个数来产生多个进程
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    //这时候cluster.workers保存的是所有的活动态的worker对象，通过为他们注册message事件来监听来自子进程的消息。
    //首先获取子进程，然后为他们绑定事件，这和postMessage完全是一样的形式的!
    Object.keys(cluster.workers).forEach(function (id) {
        cluster.workers[id].on('message', function (msg) {
            console.log('[master] ' + 'received msg:' + msg + 'from worker' + id);
        });
    });
    function eachWorker(callback) {
        for (var id in cluster.workers) {
            callback(cluster.workers[id]);
        }
    }
    var i = 0;
    //遍历所有的cluster.workers数组，然后对每一个进程执行回调，为每一个worker调用send方法给子进程传递函数,也就是说：
    //worker.send是主进程来发送消息给子进程，而worker.message是接受来自子进程的消息
    setTimeout(function () {
        eachWorker(function (worker) {
            i++;
            worker.send('[master] ' + 'send msg ' + i + ' to worker' + worker.id);
        });
    }, 3000);
} else if (cluster.isWorker) {
    console.log('[worker] ' + "worker" + cluster.worker.id + " started, pid:" + process.pid);
    //子进程注册message事件来接受主进程的消息，然后调用send方法发送消息给主进行
    process.on('message', function (msg) {
        console.log('[worker] worker' + cluster.worker.id + ' received msg:' + msg);
        process.send('[worker] send msg ' + cluster.worker.id + ' to master.');
    });
    //
    http.createServer(function (req, res) {
        var response = 'worker received request, id:' + cluster.worker.id + ',pid:' + process.pid;
        console.log(response);
        res.writeHead(200, { "content-type": "text/html" });
        res.end(response);
    }).listen(5000);

}