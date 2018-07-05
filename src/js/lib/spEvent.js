/**
 * 定义订阅/发布事件模型
 */
;
(function () {
    function SPEvent() {
        this.eventMap = {};
    }

    //事件订阅
    SPEvent.prototype.subscrible = function (eventName, callback) {
        if (this.eventMap[eventName]) {
            this.eventMap[eventName].push(callback);
        } else {
            this.eventMap[eventName] = [callback];
        }
    }

    //事件发布
    SPEvent.prototype.publish = function (eventName, params, context) {
        let eventQueue = this.eventMap[eventName];
        if (!eventQueue) {
            return;
        } else {
            eventQueue.forEach((cb) => {
                typeof cb === 'function' && cb.call(context, params)
            });
        }
    }

    window.SPEvent = new SPEvent();
})();