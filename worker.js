//第一步我们看看Worker类里面是什么内容?记住cluster.workers只能在master中访问
Worker {
  domain: null,
  _events: { message: [Function] },
  _eventsCount: 1,
  _maxListeners: undefined,
  suicide: undefined,//worker.suicide用于判断进程是自己退出还是意外退出的，然后master据此判断是否需要重新产生一个worker,调用kill/disconnect就是undefined
  state: 'none',
  id: 1,//进程唯一一个ID
  process://我们知道ChildProcess和Process都是一样EventEmitter实例
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

worker.id
//每一个worker都有一个唯一的id。当这个worker是活动的，这个id就用来在cluster.workers中保存自己
worker.isConnected()
//如果这个worker通过IPC通道和主线程连通那么返回true,否则为false。一个worker当创建后就是和他的主线程有联系的，当disconnect事件触发后就会变成没有联系了
worker.isDead()
//如果worker进程被终止了就会返回true，有可能是退出或者主线程发送消息
worker.kill([signal='SIGTERM'])
//这个方法会杀死worker。在主线程中通过断开worker.process,断开后然后用信号杀死。在worker中，通过断开通道，然后正常退出。这个方法和worker.destroy()是一样的，是为了保持向后兼容。在worker中process.kill()存在，但是他不是这个函数而是kill
worker.process
//是一个ChildProcess,所有的worker都是通过 child_process.fork()创建的，返回的对象保存在process属性里面。在worker中全局的process被保存了。注意：worker当disconnect事件在process上发生的时候就会调用process.exit(0)
worker.send(message[, sendHandle][, callback])
//发送消息到worker或者master,handle可选。在主线程中会发送消息到特定的worker,和 ChildProcess.send()一样。在worker中会发送消息到master，和process.send一样
  var cluster = require('cluster');
  if (cluster.isMaster) {
	  var worker = cluster.fork();
	  worker.send('hi,覃亮');
	  worker.on('message',function(msg){
	  	 console.log(msg);
	  })
	} else if (cluster.isWorker) {
	  process.on('message', (msg) => {
       console.log(msg);
	    process.send(msg);
	  });
	}
worker.suicide
//调用kill方法或者disconnect方法，然后返回值就是undefined。worker.suicide用于判断进程是自己退出还是意外退出的，然后master据此判断是否需要重新产生一个worker
	cluster.on('exit', (worker, code, signal) => {
	  if (worker.suicide === true) {
	    console.log('Oh, it was just suicide\' – no need to worry').
	  }
	});
	// kill worker
	worker.kill();
disconnect事件：
//当worker的IPC通道被关闭的时候触发。当worker正常退出或者被杀死或者手动断开(如worker.disconnect)。在disconnect和exit事件之间有一个延迟，这些事件用于判断进程是否由于清理而阻塞或者说是否存在一个长时间存活的连接
	cluster.on('disconnect', (worker) => {
	  console.log(`The worker #${worker.id} has disconnected`);
	});
exit事件：
	//当任何一个worker死亡的时候都会在cluster模块上触发exit事件。这时候可以通过.fork()来重新开启一个worker进程
	cluster.on('exit', (worker, code, signal) => {
	  console.log('worker %d died (%s). restarting...',
	    worker.process.pid, signal || code);
	  cluster.fork();
	});
fork事件：
//如果一个新的worker被创建，这时候在cluste模块上就会触发fork事件，这个事件可以用于记录worker的活动然后根据需求设置一个自己的timeout
	var timeouts = [];
	function errorMsg() {
	  console.error('Something must be wrong with the connection ...');
	}
	cluster.on('fork', (worker) => {
	  timeouts[worker.id] = setTimeout(errorMsg, 2000);
	});
	cluster.on('listening', (worker, address) => {
	  clearTimeout(timeouts[worker.id]);
	});
	cluster.on('exit', (worker, code, signal) => {
	  clearTimeout(timeouts[worker.id]);
	  errorMsg();
	});

listening事件：
//当在一个worker上调用listen事件，在server上触发了listening事件，在cluster上触发了listening事件。第一个参数包含是worker对象，第二个address对象具有以下连接属性：address,port,addressType，非常适合于worker监听多个地址
//addressType可以是4(TCPV4),6(tcpv6)，'udp4','udp6'
	cluster.on('listening', (worker, address) => {
	  console.log(
	    `A worker is now connected to ${address.address}:${address.port}`);
	});

message事件：
 //当worker接收到消息的时候触发
 online事件：
 //当产生一个新的worker的时候，worker应该回应在线信息。当master接收到online信息的时候就会触发这个事件。fork和online的区别在于，fork是用于检测是否产生了一个worker，而online用于检测这个worker是否在运行
setup事件：
//当调用.setUpMaster方法调用的时候触发,参数是一个cluster.settings对象，建议使用。多次调用setupMaster方法的时候会在一个tick中完成。为了保证精确性建议用cluster.settings
cluster.disconnect([callback])
//为cluster.workers中每一个worker调用disconnect方法。如果内部句柄都被断开了，这时候主进程在没有其他事件的时候就可以安全退出了。注意：这个方法只能在master上面调用
cluster.fork([env])
 //其中env是用于保存到worker工作环境中的键值对。返回一个cluster.Worker对象，产生新的worker进程。注意：只能在master上面调用
cluster.isMaster
//判断是否是主进程，这是通过 process.env.NODE_UNIQUE_ID判断的，如果 process.env.NODE_UNIQUE_ID是undefined那么就是主线程。
cluster.isWorker
//如果进程不是master返回true
cluster.schedulingPolicy
//这种调用策略要么是基于时间循环的cluster.SCHED_RR，要么是 cluster.SCHED_NONE让操作系统自己完成。这是一种全局的设置，当你第一次产生一个worker或者调用cluster.setupMaster的时候就会生效。cluster.SCHED_RR在非windows操作系统上时默认的调用策略。在windows上如果libuv能够有效的分发IOCP句柄而不会导致大的性能损失的时候也会切换到SCHED_RR。而且cluster.schedulingPolicy也能通过NODE_CLUSTER_SCHED_POLICY环境变量来设置。有效的值如'rr'或者'none'.
cluster.settings
//其中的options中有silent表示是否把输出传递给父进程的stdio，默认为false;当调用了.setupMaster() (or .fork()) 这个setting对象就会包含settings，而其值为一系列的默认值。当设置以后options就不能变化了，因为setupMaster只能调用一次。注意：最好不要改变或者手动设置其值
cluster.setupMaster([settings])
//setupMaster用于改变'fork'默认行为。如果设置了就会在cluster.settings出现。要注意的是：任何设置只会影响以后的fork行为而不会影响已经在运行的worker;setupMaster无法设置传递给fork返回的env参数，也是唯一的参数；默认值被setupMaster修改后以后的默认值就是修改后的参数了
//注意：这个方法只能在master上面调用
	const cluster = require('cluster');
	cluster.setupMaster({
	  exec: 'worker.js',
	  args: ['--use', 'https'],
	  silent: true
	});
	cluster.fork(); // https worker
	cluster.setupMaster({
	  exec: 'worker.js',
	  args: ['--use', 'http']
	});
	cluster.fork(); // http worker
cluster.worker：
//返回当前工作worker的引用，在主进程中不可用
	const cluster = require('cluster');
	if (cluster.isMaster) {
	  console.log('I am master');
	  cluster.fork();
	  cluster.fork();
	} else if (cluster.isWorker) {
	  console.log(`I am worker #${cluster.worker.id}`);
	}

cluster.workers：
//用于存放所有活动态的worker的hash，而且是通过id来建立索引的，因此很容易对所有的worker进行循环，但是只在master中可用。一个worker如果已经断开连接或者已经退出就不会出现在cluster.workers中了。必须弄清楚：disconnect/exit两个事件的顺序无法提前保证。但是从cluster.workers移除是在上一次disconnect/exit都触发的时候
	// Go through all workers
	function eachWorker(callback) {
	  for (var id in cluster.workers) {
	    callback(cluster.workers[id]);
	  }
	}
	eachWorker((worker) => {
	  worker.send('big announcement to all workers');
	});
//如果你需要通过传输通道来获取一个worker那么使用worker的唯一的id是一个很好的方法：
	socket.on('data', (id) => {
	  var worker = cluster.workers[id];
	});




















