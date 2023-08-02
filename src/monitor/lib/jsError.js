import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";
import tracker from "../utils/tracker";
export function injectJsError() {
    // console.log('111')
    window.addEventListener('error', function(event) {
        // console.log(event);
        let lastEvent = getLastEvent();
        // console.log(lastEvent.composedPath());

        if (event.target && (event.target.src || event.target.href)) {
            tracker.send({
                kind: 'stability',
                type: 'error',
                errorType: 'resourseError',
                filename: event.target.src || event.target.href,
                tagName: event.target.tagName,
                selector: getSelector(event.target),
            });
        } else {
            tracker.send({
                kind: 'stability',
                type: 'error',
                errorType: 'jsError',
                url: '',
                message: event.message,
                filename: event.filename,
                position: `${event.lineno}:${event.colno}`,
                stack: getStack(event.error.stack),
                selector: lastEvent ? getSelector(lastEvent.composedPath()) : '',
            });
        }

    }, true);

    window.addEventListener('unhandledrejection', event => {
        // console.log(event);
        let lastEvent = getLastEvent();
        let message;
        let filename;
        let colno = 0;
        let lineno = 0;
        let stack = '';
        let reason = event.reason;
        if (typeof event.reason === 'string') {
            message = event.reason;
        } else if (typeof reason === 'object') {
            message = event.reason.message;
            if (reason.stack) {
                let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
                filename = matchResult[1];
                lineno = matchResult[2];
                colno = matchResult[3];
            }
            stack = getStack(reason.stack);
        }
        tracker.send({
            kind: 'stability',
            type: 'error',
            errorType: 'promiseError',
            url: '',
            message,
            filename: filename,
            position: `${lineno}:${colno}`,
            stack,
            selector: lastEvent ? getSelector(lastEvent.composedPath()) : '',
        });
    })
}

function getStack(stack) {
    return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, "")).join('^')
}