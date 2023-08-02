import tracker from "../utils/tracker";
import onload from "../utils/onload";
import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";
export function timing() {
    let FMP, LCP;
    new PerformanceObserver((entryList, observer) => {
        let perfEntries = entryList.getEntries();
        FMP = perfEntries[0];
        observer.disconnect();
    }).observe({ entryTypes: ['element'] });

    new PerformanceObserver((entryList, observer) => {
        let perfEntries = entryList.getEntries();
        LCP = perfEntries[0];
        console.log(LCP);
        observer.disconnect();
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    new PerformanceObserver((entryList, observer) => {
        let lastEvent = getLastEvent();
        let firstInput = entryList.getEntries()[0];
        if (firstInput) {
            // console.log(firstInput)
            let inputDelay = firstInput.processingStart - firstInput.startTime;
            let duration = firstInput.duration;
            if (inputDelay > 0 || duration > 0) {
                tracker.send({
                    kind: 'experience',
                    type: 'firstInputDelay',
                    inputDelay,
                    duration,
                    startTime: firstInput.startTime,
                    selector: lastEvent ? getSelector(lastEvent.path || lastEvent.target) : ''
                })
            }
        }
        observer.disconnect();
    }).observe({
        type: 'first-input',
        buffered: true
    });
    onload(function() {
        setTimeout(() => {
            const {
                fetchStart,
                connectStart,
                connectEnd,
                requestStart,
                responseStart,
                responseEnd,
                domLoading,
                domInteractive,
                domContentLoadedEventStart,
                domContentLoadedEventEnd,
                loadEventStart
            } = performance.timing;

            tracker.send({
                kind: 'experience',
                type: 'timing',
                connectTime: connectEnd - connectStart, //连接时间
                ttfbTime: responseStart - requestStart, //首字节到达时间
                responseTime: responseEnd - responseStart, //响应读取时间
                parseDOMTime: loadEventStart - domLoading, //DOM解析时间
                domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,
                timeToInteractive: domInteractive - fetchStart, //首次可交互时间
                loadTime: loadEventStart - fetchStart, //完整的加载时间
            })


            let FP = performance.getEntriesByName('first-paint')[0];
            let FCP = performance.getEntriesByName('first-contentful-paint')[0];

            tracker.send({
                kind: 'experience',
                type: 'paint',
                firstPaint: FP.startTime,
                firstContentPaint: FCP.startTime,
                firstMeaningfulPaint: FMP.startTime,
                largeContentfulPaint: LCP ? LCP.startTime : '',
            })
        }, 3000);

    });
}