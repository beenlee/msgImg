/**
 * @file main.js
 * @Author: lidianbin(lidianbin@baidu.com)
 * @Date:   2015-12-03 13:15:40
 * @Last Modified by:   lidianbin
 * @Last Modified time: 2015-12-05 22:46:25
 */

'use strict';

require.config({
    'baseUrl': '../src/js',
    'paths': {},
    'packages': [
        {
            'name': 'vue',
            'location': '../../dep/vue',
            'main': 'vue'
        }
    ]
});
require(['index/main'], function (main) {
    main.init();
});