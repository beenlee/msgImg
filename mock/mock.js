/**
 * @file mock.js
 * @author mengke01
 * @date
 * @description
 * 用来做路径转发的配置模块
 */
console.log('sss');
// mock路径
var MOCK_PATH = {
    '/hack/parentLabel/all': '/mock/data/a.json',
    '/hack/childrenLabel/parent/**': '/mock/data/b.json',
    '/hack/picture/pagination/**': '/mock/data/c.json'
};

// mock 路径检测
function mockPath(request) {
    var flag = false;
    var pathname = request.pathname.replace(/\/+$/, '');
    var keys = Object.keys(MOCK_PATH);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] === pathname) {
            return true;
        }
    }
    if (/\/(topic|trends|article)\/ajax-detail/.test(pathname)) {
        return true;
    }
    if (/\/user\/cities/.test(pathname)) {
        return true;
    }
    return false;
}

// mock 处理函数
function mockHandler(context) {
    var originalPath = context.request.pathname;
    if (/\/user\/cities/.test(originalPath)) {
        originalPath = originalPath.substring(0, originalPath.lastIndexOf('\/'));
        // console.log(originalPath);
    }
    var path = MOCK_PATH[originalPath.replace(/\/+$/, '')];
    var location = path + context.request.search;
    context.status = 302;
    context.header['location'] = location;
}

module.exports = {
    mockPath: mockPath,
    mockHandler: mockHandler
};
