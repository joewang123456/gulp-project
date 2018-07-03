'use strict';
(function () {
    //创建worker
    // var worker = new Worker('/js/workers/worker1.js');
    // //设置worker.js文件中发送的消息
    // worker.onmessage = function (event) {
    //     console.log('接收数据...');
    //     console.log(event.data);
    // };
    // //向worker.js文件发送数据
    // worker.postMessage({
    //     b: 2
    // });

    //创建共享线程
    var workerShare = new SharedWorker('/js/workers/workerShare.js');
    workerShare.port.addEventListener('message', function (e) {
        document.getElementById('showMessage').innerText = typeof e.data === 'object' ? e.data.join(',') : e.data; 
    }, false);
    workerShare.port.start();
    // workerShare.port.postMessage('ping from user web page...');
    document.getElementById('worker').addEventListener("input", function (e) { //onchange改为change
        setTimeout(() => {
            workerShare.port.postMessage(e.target.value);
        });
    }, false);
})();