function getSelectors(path) {
    return path.reverse().filter(e => {
        return e !== document && e !== window;
    }).map(e => {
        let selector = "";
        if (e.id) {
            return `${e.nodeName.toLowerCase()}#${e.id}`;
        } else if (e.className && typeof e.className === 'string') {
            return `${e.nodeName.toLowerCase()}.${e.className}`
        } else {
            selector = e.nodeName.toLowerCase();
        }
        return selector;
    }).join(' ');
}
export default function(pathOrTarget) {
    if (Array.isArray(pathOrTarget)) {
        return getSelectors(pathOrTarget);
    } else {
        let path = []
        while (pathOrTarget) {
            path.push(pathOrTarget)
            pathOrTarget = pathOrTarget.parentNode;
        }
        return getSelectors(path)
    }
}