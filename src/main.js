/**
 * @file main.js
 * @Author: lidianbin(lidianbin@baidu.com)
 * @Date:   2015-12-03 13:15:40
 * @Last Modified by:   lidianbin
 * @Last Modified time: 2015-12-12 23:47:27
 */

'use strict';

require.config({
    'baseUrl': '../src',
    'paths': {},
    'packages': [
        {
            'name': 'vue',
            'location': '../dep/vue',
            'main': 'vue'
        },
        {
            'name': 'fastclick',
            'location': '../dep/fastclick/1.0.6/src',
            'main': 'fastclick'
        },
        {
            'name': 'bootstrap-3.3.5',
            'location': '../dep/bootstrap-3.3.5/dist',
            'main': 'js/bootstrap'
        },
        {
            'name': 'jquery',
            'location': '../dep/jquery/1.11.1/src',
            'main': 'jquery'
        }
    ]
});
require(['index/main'], function (main) {
    main.init();
});

