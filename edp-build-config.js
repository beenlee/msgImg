/**
 * @file edp-build-config.js
 * @author EFE
 */

/* globals LessCompiler, CssCompressor, JsCompressor, PathMapper, AddCopyright, ModuleCompiler, TplMerge */

exports.input = __dirname;

var path = require('path');
exports.output = path.resolve(__dirname, 'output');

// var moduleEntries = 'html,htm,phtml,tpl,vm,js';
// var pageEntries = 'html,htm,phtml,tpl,vm';

exports.getProcessors = function () {
    var lessProcessor = new LessCompiler();
    var cssProcessor = new CssCompressor();
    // var jsProcessor = new JsCompressor({
    //     files: [ 'src/*/*.js', '*.coffee' ]
    // });
    var jsProcessor = new JsCompressor();
    var pathMapperProcessor = new PathMapper();
    var addCopyright = new AddCopyright();
    var moduleProcessor = new ModuleCompiler({
        configFile: 'module.conf'
    });
    var tplMerger = new TplMerge({
        pluginIds: ['text']
    });
    var html2JsCompiler = new Html2JsCompiler({
        extnames: ['tpl']
    });

    // return {
    //     'default': [
    //         lessProcessor, moduleProcessor, pathMapperProcessor
    //     ],

    //     'release': [
    //         lessProcessor, cssProcessor, moduleProcessor,
    //         jsProcessor, pathMapperProcessor, addCopyright
    //     ]
    // };

    return [
            lessProcessor, cssProcessor, /*html2JsCompiler, tplMerger,*/ moduleProcessor,
            jsProcessor, pathMapperProcessor, addCopyright
        ];
};

exports.exclude = [
    'tool',
    'doc',
    'test',
    'module.conf',
    'dep/packages.manifest',
    'dep/*/*/test',
    'dep/*/*/doc',
    'dep/*/*/demo',
    'dep/*/*/tool',
    'dep/*/*/*.md',
    'dep/*/*/package.json',
    'dep/iscroll*',
    'dep/hammer',
    'dep/jquery-hammer',
    'edp-*',
    '.edpproj',
    '.svn',
    '.git',
    '.gitignore',
    '.idea',
    '.project',
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp',
    'mock',
    'node_modules',
    'autoreponse-config.js',
    'package.json'
];

/* eslint-disable guard-for-in */
exports.injectProcessor = function (processors) {
    for (var key in processors) {
        global[key] = processors[key];
    }
};
