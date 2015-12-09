/**
 * @file main.js
 * @author: lidianbin(lidianbin@baidu.com)
 * @Date:   2015-12-03 13:20:06
 * @Last Modified by:   lidianbin
 * @Last Modified time: 2015-12-09 22:09:41
 */

'use strict';
define(function (require) {
    var fastClick = require('fastclick');
    var Vue = require('vue');

    var tagsPage;
    var photoPage;

    var events = {
        init: function () {

            // this.initScroll();
            $(window).scroll(function (e) {
                // var scrollTop = $(this).scrollTop
                // console.log(e.target.scrollTop + e.target.clientHeight, '/', e.target.scrollHeight);
                if ($(this).scrollTop() + $(this).height() >= $(document).height()) {
                    photoPage.photoPageVue.$emit('loadMore');
                }
                if ($(this).scrollTop() > $(this).height()) {
                    $('.back-top').show();
                }
                else {
                    $('.back-top').hide();
                }

            });
        }
    };


    var photoPage = {
        photoPageVue: null,
        init: function (firstTag, secondTag) {
            this.photoPageVue = new Vue({
                el: '.photo-page',
                data: {
                    nav: {
                        first: firstTag,
                        second: secondTag
                    },
                    photos: {
                        pageSize: 10,
                        currentPage: 0,
                        total: 0,
                        list: []
                    },
                    loadStatus: 0
                },
                events: {
                    loadMore: 'loadMore'
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
                    },

                    backTop: function () {
                        $(window).scrollTop(0);
                    },

                    loadMore: function () {
                        console.log('do loadMore img');
                        if (this.loadStatus !== 0) {
                            // consloe.log('status:', this.loadStatus);
                            // this.loadStatus = 0;
                            return false;
                        }
                        this.loadStatus = 1;
                        var page = this.photos.currentPage + 1;
                        var pageSize = this.photos.pageSize;
                        var tagId = this.nav.second.id;
                        var url = '/hack/picture/pagination/' + tagId + '/' + page + '/' + pageSize;

                        // test
                        url = '/hack/picture/pagination';

                        $.getJSON(url, function (data) {
                            if (data.status === 0) {
                                this.photos.currentPage = data.data.currentPage;
                                this.photos.total = data.data.total;
                                if (data.data.pictures && data.data.pictures.length > 0) {
                                    $.each(data.data.pictures, function (index, item) {
                                        this.photos.list.push(item);
                                    }.bind(this));
                                }
                                if (data.data.currentPage * this.photos.pageSize >= this.photos.total) {
                                    this.loadStatus = 2;
                                }
                                else {
                                    this.loadStatus = 0;
                                }
                            }
                            else {
                                console.log('服务器异常：', data.msg);
                                this.loadStatus = 0;
                            }
                            // this.refreshScroll();
                        }.bind(this));
                    }
                }
            });
            // this.initScroll();
        },

        // initScroll: function () {
        //     console.log('initScroll');
        //     var loadIScroll = new IScroll('.iScroll-wrapper', {
        //         // scrollbarClass: 'myScrollbar', /* 重要样式 */
        //         // useTransition: false,
        //         click: false,
        //         momentum: true
        //     });

        //     loadIScroll.on('scrollStart', function (e) {
        //         alert('scrollStart');
        //         console.log('start', this.y, '-', this.directionY);
        //         // if (this.y >= -offset || this.directionY === -1) {
        //         //     isPull = true;
        //         // }

        //     });
        //     loadIScroll.on('scrollEnd', function () {
        //         alert('scrollEnd');
        //         console.log('结束了：' + this.directionY, this.y, this.distY);
        //         // if (isPull && this.y == 0 && this.distY >= tabHeight) {
        //         //     console.log('下拉刷新');
        //         //     sendPageData.page.currentPage = 1;
        //         //     // that.pullDown(sendPageData);
        //         // }else if (this.y <= -scrollHeight) {
        //         //     console.log('上拉加载');
        //         //     // that.upDown();
        //         // }
        //         // isPull = false;
        //     });

        //     document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        // },

        show: function (firstTag, secondTag, callback) {
            if (!this.photoPageVue) {
                this.init(firstTag, secondTag);
            }
            else {
                this.reset(firstTag, secondTag);
            }
            this.photoPageVue.$emit('loadMore');
            typeof callback === 'function' && callback();
            $('.photo-page').show();
        },

        reset: function (firstTag, secondTag) {
            this.photoPageVue.nav.first = firstTag;
            this.photoPageVue.nav.second = secondTag;
            this.photoPageVue.photos.pageSize = 10;
            this.photoPageVue.photos.currentPage = 0;
            this.photoPageVue.photos.total = 0;
            this.photoPageVue.photos.list = [];
            this.photoPageVue.loadStatus = 0;
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
            var url = '/hack/parentLabel/all';
            $.getJSON(url, function (data) {
                this.firstPageVue = new Vue({
                    el: '.first-tag-page',
                    data: {
                        tagsFirstList: data.data
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
            var url  = '/hack/childrenLabel/parent/' + firstTag.id;
            // test
            url = '/hack/childrenLabel/parent';
            $.getJSON(url, {id: firstTag.id}, function (data) {
                var secondTag = data.data;
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
            events.init();
        }
    };

    return page;
});
