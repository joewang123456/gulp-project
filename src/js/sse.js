;
'use strict';;
(function () {
    var es = new EventSource('/chat', {
        withCredentials: true
    });
    //默认事件
    es.addEventListener('open', function (event) {
        console.log('链接已经打开...');
    }, false);
    es.addEventListener('message', function (event) {
        console.log('message接受的数据：' + event.data);
    }, false);
    es.addEventListener('error', function (event) {
        console.log('出错啦...');
        es.close();
    }, false);
    es.addEventListener('close', function (event) {
        console.log('更新成功啦...');
        //关闭连接
        es.close();
    }, false);

    //自定义事件
    es.addEventListener('update', function (event) {
        const {
            score,
            count
        } = JSON.parse(event.data);
        console.log('第' + count + '更新的的分数：' + score + '分');
    }, false);

})();