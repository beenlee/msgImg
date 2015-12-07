/**
 * @file autoreponse-config.js
 * @Author: lidianbin(lidianbin@baidu.com)
 * @Date:   2015-12-05 23:13:19
 * @Last Modified by:   lidianbin
 * @Last Modified time: 2015-12-05 23:35:12
 */

module.exports = {
    // The response directory to mock, by default is `mock`
    responseDir: './mock',

    /**
     * configure the `get` request, determine the request path and the file to be mocked.
     * You can also configure the `post` request and `query` params to mock.
     * More information, please refer to examples.
     *
     * @type {boolean|Array}
     */
    get: [
        {
            match: function (reqPathName) {
                console.log(1111);
                return !/\.\w+(\?.*)?$/.test(reqPathName);
            }
        }
    ],
    processor: {
        smarty: {
            initerFile: './initer.php'
        }
    }
};
