//监听worker.js外postMeessage
onmessage = function (event) {
    var data = event.data;
    console.log('这是worker接受的数据：', data);
    setTimeout(() => {
        console.log('sadasdas');
        //向worker.js外发送消息
        postMessage({
            a: 1
        });
    }, 1000);
};