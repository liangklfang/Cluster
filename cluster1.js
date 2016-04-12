const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
//console.log(cluster.isMaster);
//获取CPU的数量,因为我的计算机是双核的，所以这里的console.log会被执行三次，其中一次是主线程执行的，其余两次是子线程执行的。我们知道Node.js是单线程的，为了使用多核CPU，于是我们使用了一组Node.js进程。
if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
    //worker进程是使用child_process.fork完成的，因此可以使用父子进程之间的IPC进程通信。这个cluster模块使用两种方法来分配到来的连接：
    //第一种方式(在除了Windows上面的其他所有的平台)是通过一个循环的办法来完成的，父进程监听一个端口，接受新的连接，然后把他们分配给子进程并且使用了一些内置的判断来避免工作进程的overload。
    //第二种方法：父进程产生监听的socket，然后把它分配给指定的worker。然后worker直接接受来临的连接。第二种方法理论上是性能最好的方法，实践上，分发的方式由于操作系统调用异常的是不平衡的。
    //因为server.listen()为主线程分发了大多数的载荷，Node.js的主线程和cluster worker有三种不同：
    //(1)server.listen({fd: 7})，因为消息被传递给master,父进程的文件描述符7就会被监听上，监听函数被传递给worker而不是监听workder的文件描述符7代表什么
    //(2)server.listen(handle)显示的监听一个handle会导致worder使用这个handle,而不是和父进程之间通信。如果这个worker已经有了handle那么你必须知道你在做什么
    //(3)server.listen(0)这时候服务器会监听一个随机的端口号。但是每一个worker每次都会接收到相同的端口号，本质上端口号只是在第一次的时候是随机的，以后都是可以预期的。如果你想要监听一个唯一的端口号，那么可以基于cluster worker id产生一个端口号。
    //在Node.js中或者程序中没有路由逻辑，因此在worker之间也没有共享的状态。因此你的程序不要过多的依赖于内存中的数据对象，如session或者login。因为worker都是独立的进程，他们可以依据你的需要被杀死或者重新产生，而不会影响其他的worker。只要有worker还是存活的，那么server就会不停的接受连接。如果没有worker
    //存活，那么存在的连接就会被丢掉，以后新的连接就会被拒绝。Node.js不会自动为你管理worker，然而你有责任为你的应用去管理worker池
  }
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
}