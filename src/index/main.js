/**
 * @file main.js
 * @author: lidianbin(lidianbin@baidu.com)
 * @Date:   2015-12-03 13:20:06
 * @Last Modified by:   lidianbin
 * @Last Modified time: 2015-12-07 18:11:54
 */

'use strict';
define(function (require) {
    var fastClick = require('fastclick');
    var Vue = require('vue');

    var photoPage = {
        photoPageVue: null,
        init: function (firstTag, secondTag, photoData) {
            this.photoPageVue = new Vue({
                el: '.photo-page',
                data: {
                    nav: {
                        first: firstTag,
                        second: secondTag
                    },
                    photos: {
                        pageSize: photoData.pageSize,
                        currentPage: photoData.currentPage,
                        total: photoData.total,
                        list: photoData.pictures
                    }
                },
                methods: {
                    choosePhoto: function (photo, event) {
                        // console.log(this);
                        // 方法内 `this` 指向 vm
                        console.log(photo);
                        // `event` 是原生 DOM 事件
                    },

                    backFirstList: function () {
                        photoPage.hide();
                        tagsPage.show(tagsPage.firstPageElm);
                    },

                    backSecondList: function () {
                        photoPage.hide();
                        tagsPage.show(tagsPage.secondPageElm);
                    }
                }
            });
        },

        show: function (firstTag, secondTag, callback) {
            // var url = '/picture/pagination/' + secondTag.id + '/1/10';
            var url = '/picture/pagination/1/1/10';
            $.getJSON(url, function (data) {

                if (this.photoPageVue) {
                    this.photoPageVue.nav.first = firstTag;
                    this.photoPageVue.nav.second = secondTag;
                }
                else {
                    this.init(firstTag, secondTag, data.data);
                }
                typeof callback === 'function' && callback();
                $('.photo-page').show();
            }.bind(this));
        },

        hide: function () {
            $('.photo-page').hide();
        }
    };

    var tagsPage = {

        firstPageVue: null,
        firstPageElm: '.first-tag-page',

        secondPageVue: null,
        secondPageElm: '.second-tag-page',
        
       // firstTag: null,

        init: function () {
            this.firstPageInit(function () {
                this.show(this.firstPageElm);
            }.bind(this));
        },

        firstPageInit: function (callback) {
            var url = '/parentLabel/all';
            $.getJSON(url, function (data) {
                this.firstPageVue = new Vue({
                    el: '.first-tag-page',
                    data: {
                        tagsFirstList: data.data.tagList
                    },
                    methods: {
                        chooseFirstTag: function (firstTag, event) {
                            // console.log(this);
                            // 方法内 `this` 指向 vm
                            // console.log(firstTag);
                            // `event` 是原生 DOM 事件
                            // alert(event.target.tagName);

                            tagsPage.getScondePageInfo(firstTag, function () {
                                this.hide(this.firstPageElm);
                                this.show(this.secondPageElm);
                            }.bind(tagsPage));
                        }
                    }
                });
                callback();
            }.bind(this));
        },

        secondPageInit: function (firstTag, tagList, callback) {
            this.secondPageVue = new Vue({
                el: '.second-tag-page',
                data: {
                    nav: firstTag,
                    tagsSecondList: tagList
                },
                methods: {
                    backFirstList: function () {
                        tagsPage.hide(tagsPage.secondPageElm);
                        tagsPage.show(tagsPage.firstPageElm);
                    },
                    chooseSecondTag: function (secondTag, event) {
                        // console.log(this.nav);
                        // 方法内 `this` 指向 vm
                        // console.log(secondTag);
                        // `event` 是原生 DOM 事件
                        // alert(event.target.tagName);

                        // tagsPage.getScondePageInfo(firstTag, function () {
                        //     this.hide(this.firstPageElm);
                        //     this.show(this.secondPageElm);
                        // }.bind(tagsPage));
                        
                        photoPage.show(this.nav, secondTag, function () {
                            tagsPage.hide(tagsPage.secondPageElm);
                        });
                    }
                }
            });
            callback && callback();
        },

        getScondePageInfo: function (firstTag, callback) {
            var url = '/childrenLabel/parent/1';
            // var url  = '/childrenLabel/parent/' + firstTag.id;
            $.getJSON(url, {id: firstTag.id}, function (data) {
                var secondTag = data.data.tagList;
                if (this.secondPageVue) {
                    this.secondPageVue.nav = firstTag;
                    this.secondPageVue.tagsSecondList = secondTag;
                }
                else {
                    this.secondPageInit(firstTag, secondTag);
                }
                callback();
            }.bind(this));
        },

        show: function (elm) {
            $(elm).show();
        },

        hide: function (elm) {
            $(elm).hide();
        }
    };


    var page = {
        init: function () {
            fastClick.attach(document.body);
            tagsPage.init();
        }
    };

    return page;
});
