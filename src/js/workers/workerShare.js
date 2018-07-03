//全局共享变量
var connect_number = 0;
var message = '';
onconnect = function (e) {
    connect_number = connect_number + 1;
    //get the first port here 
    var port = e.ports[0];
    port.postMessage('A new connection! The current connection number is ' +
        connect_number);
    port.onmessage = function (e) {
        message = e.data;
        port.postMessage(message);
    };
};