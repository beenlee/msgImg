/**
 * @file edp-webserver-config.js
 * @author EFE
 */

/* globals home, redirect, content, empty, autocss, file, less, stylus, proxyNoneExists */

var autoresponse = require('autoresponse');

exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;
var mock = require('./mock/mock');

exports.getLocations = function () {
    return [
        {
            location: /\/$/,
            handler: home('index.html')
        },
        {
            location: /^\/redirect-local/,
            handler: redirect('redirect-target', false)
        },
        {
            location: /^\/redirect-remote/,
            handler: redirect('http://www.baidu.com', false)
        },
        {
            location: /^\/redirect-target/,
            handler: content('redirectd!')
        },
        {
            location: '/empty',
            handler: empty()
        },
        {
            location: /\.css($|\?)/,
            handler: [
                autocss()
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /\.styl($|\?)/,
            handler: [
                file(),
                stylus()
            ]
        },
         // mock
        {
            location: mock.mockPath,
            handler: mock.mockHandler
        },
        autoresponse('edp', { watch: true, logLevel: 'info' }),
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

/* eslint-disable guard-for-in */
exports.injectResource = function (res) {
    for (var key in res) {
        global[key] = res[key];
    }
};
