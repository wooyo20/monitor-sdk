let host = 'cn-shanghai.log.aliyuncs.com';
let project = 'wo-monitor';
let logStore = 'wo-monitor-store';
let userAgent = require('user-agent')

function getExtraData() {
    return {
        title: document.title,
        url: location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
    }
}
class SendTracker {
    constructor() {
        this.url = `http://${project}.${host}/logstores/${logStore}/track`;
        this.xhr = new XMLHttpRequest;
    }
    send(data = {}) {
        let extraData = getExtraData();
        let log = {...data, ...extraData }
        this.xhr.open('POST', this.url, true);
        for (let key in log) {
            if (typeof log[key] === 'number') {
                log[key] = `${log[key]}`;
            }
        }
        console.log(log)
        let body = JSON.stringify({
            __logs__: [log]
        });
        this.xhr.setRequestHeader('Content-Type', 'application/json');
        this.xhr.setRequestHeader('x-log-apiversion', '0.6.0');
        this.xhr.setRequestHeader('x-log-bodyrawsize', body.length);
        this.xhr.onload = function() {
            // console.log(this.xhr.response);
        };
        this.xhr.onerror = function(error) {
            console.log(error);
        }
        this.xhr.send(body);
    }
}
export default new SendTracker();