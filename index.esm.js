// 监控错误
// 全局监控
function ErrorTrackerReport() {
    function SourceErrorReport(e) {
        const target = e.target;
        const log = {
            errorType: 'sourceError',
            message: `${target.tagName}资源加载错误`,
            file: target.src || target.href
        };
        console.log('---资源错误---', log);
    }
    window.addEventListener('error', function (e) {
        const target = e.target;
        // 判断是否为资源错误[script  link  img]
        const isSource = target instanceof HTMLImageElement || target instanceof HTMLScriptElement || target instanceof HTMLLinkElement;
        if (isSource)
            return SourceErrorReport(e);
        const log = {
            errorType: 'jsError',
            message: e.message,
            error: e.error,
            file: e.filename,
            row: e.lineno,
            col: e.colno
        };
        console.log(log, '---报错信息');
    }, true);
    // Promise错误
    window.addEventListener('unhandledrejection', function (e) {
        const log = {
            errorType: 'promiseError',
            message: e.reason,
            error: e.reason
        };
        console.log(log, '---Prop错误');
    });
}
// 手动错误上报
function ErrorCatcher(message, error) {
    const log = {
        errorType: 'jsError',
        message: message,
        error: error
    };
    console.log('---js错误----', log);
}

/**
 * 获取元素的dom路径
 * @param {*} element
 * @returns
 */
function getPathTo(element) {
    if (element.id !== '')
        return '//*[@id="' + element.id + '"]';
    if (element === document.body)
        return element.tagName;
    let ix = 0;
    let siblings = element.parentElement.children;
    for (let i = 0; i < siblings.length; i++) {
        let sibling = siblings[i];
        if (sibling === element)
            return (getPathTo(element.parentElement) + '/' + element.tagName + '[' + (ix + 1) + ']');
        if ((sibling === null || sibling === void 0 ? void 0 : sibling.nodeType) === 1 && sibling.tagName === element.tagName)
            ix++;
    }
}

// 全局埋点
function DOMTrackerReport() {
    document.body.addEventListener('click', function (e) {
        const target = e.target;
        const isNo = target.getAttribute('data-no');
        const message = target.getAttribute('data-tracker');
        if (isNo !== null)
            return;
        const log = {
            type: 'click',
            message: message || getPathTo(target)
        };
        console.log(log);
    });
}
// 手动埋点
function actionCatcher(type, message) {
    const log = { type, message };
    console.log(log);
}

class Tracker {
    constructor(options) {
        this.data = Object.assign(this.defaultOptions(), options);
        this.installTracker();
    }
    // 默认配置加载  private 私有的【仅限该类使用】
    defaultOptions() {
        return {
            appId: '',
            uuId: '',
            requestUrl: '',
            ErrorTracker: false,
            DOMTracker: false,
            HashTracker: false,
            HistoryTracker: false
        };
    }
    //     加载监控
    installTracker() {
        if (this.data.ErrorTracker) {
            ErrorTrackerReport();
        }
        if (this.data.HashTracker) ;
        // 埋点
        if (this.data.DOMTracker) {
            DOMTrackerReport();
        }
        if (this.data.HistoryTracker) ;
    }
}

//  初始化配置  【加载配置、载入配置】
function init(options) {
    // 需要的配置: appid系统ID userId用户ID deary合并延迟时间
    new Tracker(options);
}

export { ErrorCatcher, actionCatcher, init };
