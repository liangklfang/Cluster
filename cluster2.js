Class: Worker
 worker对象包含所有的公共信息和方法。在父进程中可以使用cluster.workers来获取，在worker中可以使用cluster.worker来获取。
'disconnect'事件：
	//和cluster.on('disconnect')类似，但是这里是为特定的worker指定事件
	cluster.fork().on('disconnect', () => {
	  // Worker has disconnected
	});
'error'事件：
 //和child_process.fork()提供的事件一样，在worker中我们可以使用process.on('error')来完成的
 'exit'事件：
 //和cluster.on('exit')类似，但是这里是为一个特定的worker来指定的
	 const worker = cluster.fork();
	 worker.on('exit', (code, signal) => {
	  if( signal ) {
	    console.log(`worker was killed by signal: ${signal}`);
	  } else if( code !== 0 ) {
	    console.log(`worker exited with error code: ${code}`);
	  } else {
	    console.log('worker success!');
	  }
	});

'listening'事件：
 //不会再worker上触发
 //和cluster.on('listening')事件一样，但是这里是为特定的worker指定的
	 cluster.fork().on('listening', (address) => {
	  // Worker is listening
	});
'message'事件：
 //和cluster.on('message')一样，但是是为指定的worker指定的。这个事件和child_process.fork()提供的一样，在worker中更可以使用process.on('message')。
	const cluster = require('cluster');
	const http = require('http');
	if (cluster.isMaster) {
	  // Keep track of http requests
	  var numReqs = 0;
	  setInterval(() => {
	    console.log('numReqs =', numReqs);
	  }, 1000);
	  // Count requests
	  function messageHandler(msg) {
	    if (msg.cmd && msg.cmd == 'notifyRequest') {
	      numReqs += 1;
	    }
	  }
	  // Start workers and listen for messages containing notifyRequest
	  const numCPUs = require('os').cpus().length;
	  for (var i = 0; i < numCPUs; i++) {
	    cluster.fork();
	  }
	  Object.keys(cluster.workers).forEach((id) => {
	    cluster.workers[id].on('message', messageHandler);
	  });

	} else {
	  // Worker processes have a http server.
	  http.Server((req, res) => {
	    res.writeHead(200);
	    res.end('hello world\n');
	    // notify master about the request
	    process.send({ cmd: 'notifyRequest' });
	  }).listen(8000);
	}
'online'事件
   //和cluster.on('online')一样，但是这里是针对指定的worker。这个事件不会在worker上面触发
	cluster.fork().on('online', () => {
	  // Worker is online
	});
worker.disconnect()方法：
 //在worker中，这个函数会关闭所有的servers，等待这些servers的'close'事件，然后关闭所有的IPC通道。在主线程中，会给worker发送一个内部消息从而导致worker自动调用.disconnect方法
 //指定suicide：当server被关闭了，那么不会接受新的连接了，但是连接还是会被监听的worker接受。依然存在的连接还是可以和平常一样关闭。当没有连接存在了，如server.close，这时候和worker的IPC通道就会自然关闭
 //以上的点只适用于服务器的连接，客户端的连接不会被worker自动关闭，而且disconnect不会等待客户端的连接退出。
 //在worker中，process.disconnect存在，但是他不是这个函数，而是disconnect
	if (cluster.isMaster) {
	  var worker = cluster.fork();
	  var timeout;
	  //监听listening方法，这个方法是子线程传递过来的
	  worker.on('listening', (address) => {
	    worker.send('shutdown');
	    //worker自动关闭
	    worker.disconnect();
	    //一定事件后杀死进程
	    timeout = setTimeout(() => {
	      worker.kill();
	    }, 2000);
	  });
      //监听disconnect事件，在一定的
	  worker.on('disconnect', () => {
	    clearTimeout(timeout);
	  });

	} else if (cluster.isWorker) {
	  const net = require('net');
	  var server = net.createServer((socket) => {
	    // connections never end
	  });
	  server.listen(8000);
	  process.on('message', (msg) => {
	    if(msg === 'shutdown') {
	      // initiate graceful close of any connections to server
	    }
	  });
	}


