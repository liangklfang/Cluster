/*
  测试父子进程通信
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
	*/

/*这里在消息传输结束以后我们调用worker.kill来结束worker进程
 var cluster = require('cluster');
  if (cluster.isMaster) {
	  var worker = cluster.fork();
	  worker.send('hi,覃亮');
	  worker.on('message',function(msg){
	  	 console.log(msg);
	  	 worker.kill();
	  	 //消息传输结束后，我们杀死进程
	  })
	} else if (cluster.isWorker) {
	  process.on('message', function(msg){
       console.log(msg);
	    process.send(msg);
	  });
	}
	  //任何一个worker死亡的时候都会在cluster上触发exit事件
	cluster.on('exit', function(worker, code, signal){
	  if (worker.suicide === true) {
	    console.log('Oh, it was just suicide\' – no need to worry')
	  }
	});*/
	
	/*父子进程IPC通道断开的时候调用disconnect事件，当worker死亡的时候触发exit事件。disconnect在exit之前调用
 var cluster = require('cluster');
  if (cluster.isMaster) {
	  var worker = cluster.fork();
	  worker.send('hi,覃亮');
	  worker.on('message',function(msg){
	  	 console.log(msg);
	  	 worker.kill();
	  	 //消息传输结束后，我们杀死进程
	  })
	} else if (cluster.isWorker) {
	  process.on('message', function(msg){
       console.log(msg);
	    process.send(msg);
	  });
	}
	  //任何一个worker死亡的时候都会在cluster上触发exit事件
	cluster.on('exit', function(worker, code, signal){
	  if (worker.suicide === true) {
	    console.log('Oh, it was just suicide\' – no need to worry')
	  }
	});
	//当和worker之间的IPC通道被关闭的时候触发
	cluster.on('disconnect', (worker) => {
	  console.log(`The worker #${worker.id} has disconnected`);
	});*/
var cluster = require('cluster');
   if (cluster.isMaster) {
   	//如果一个新的worker被创建，这时候在cluste模块上就会触发fork事件
	  var worker = cluster.fork();
	} else if (cluster.isWorker) 
	 {}
	var timeouts = [];
	function errorMsg() {
	  console.error('Something must be wrong with the connection ...');
	}
	cluster.on('fork', (worker) => {
	 //timeouts里面存放的是setTimeout的返回值id，通过这个id可以找到我们的定时器对象
	  timeouts[worker.id] = setTimeout(errorMsg, 2000);
	});
	cluster.on('listening', (worker, address) => {
	  clearTimeout(timeouts[worker.id]);
	});
	cluster.on('exit', (worker, code, signal) => {
	  clearTimeout(timeouts[worker.id]);
	  errorMsg();
	});
 