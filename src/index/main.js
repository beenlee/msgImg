/**
 * @file main.js
 * @author: lidianbin(lidianbin@baidu.com)
 * @Date:   2015-12-03 13:20:06
 * @Last Modified by:   lidianbin
 * @Last Modified time: 2015-12-21 22:51:37
 */

'use strict';
define(function (require) {
    // var postMsgTpl = require('text!./postMsg.tpl');
    // var photoPageTpl = require('text!./photoPage.tpl');
    // var firstTagTpl = require('text!./firstTag.tpl');
    // var secondTagTpl = require('text!./secondTag.tpl');

    var postMsgTpl = $('#tpl-post-msg').html();
    var photoPageTpl = $('#tpl-photo-page').html();
    var firstTagTpl = $('#tpl-first-tag').html();
    var secondTagTpl = $('#tpl-second-tag').html();

    // console.log(postMsgTpl);

    var fastClick = require('fastclick');
    var Vue = require('vue');
    // var halfWord = 'abcdefghijkl';
    // var halfWord = 'DDJSJAKQIALA';
    // var halfWord = '我的说话菲德尔';

    // Vue.config.debug = true;

    var firstTag = Vue.extend({
        template: firstTagTpl,
        // el: '.first-tag-page',
        data: function () {
            return {
                tagsFirstList: null,
                show: false
            };
        },
        events: {
            enter: function (pageName) {
                if (pageName === 'firstTag') {
                    console.log(pageName);
                    this.show = true;
                    if (!this.tagsFirstList) {
                        this.firstPageInit();
                    }
                }
                else {
                    this.show = false;
                }
            }
        },
        methods: {
            
            chooseFirstTag: function (firstTag, event) {
                // console.log(this);
                // 方法内 `this` 指向 vm
                // console.log(firstTag);
                // `event` 是原生 DOM 事件
                // alert(event.target.tagName);
                // tagsPage.getScondePageInfo(firstTag);
                // tagsPage.hide(tagsPage.firstPageElm);
                // tagsPage.show(tagsPage.secondPageElm);
                this.$dispatch('enterPage', 'secondTag', firstTag);
            },

            firstPageInit: function (callback) {
                this.$dispatch('loading');
                var url = '/hack/parentLabel/all';
                $.getJSON(url).then(function (data) {
                    // this.$dispatch('loaded');
                    this.tagsFirstList = data.data;
                    typeof callback === 'function' && callback();
                }.bind(this)).always(function (e) {
                    this.$dispatch('loaded');
                }.bind(this));
            }
        }
    });

    var secondTag = Vue.extend({
        template: secondTagTpl,
        data: function () {
            return {
                show: false,
                nav: {
                    firstLabel: null
                },
                tagsSecondList: null
            };
        },
        events: {
            enter: function (pageName, firstTag) {
                if (pageName === 'secondTag') {
                    console.log(pageName);
                    this.show = true;
                    if (firstTag) {
                        this.getSecondPageInfo(firstTag);
                    }
                }
                else {
                    this.show = false;
                }
            }
        },
        methods: {
            getSecondPageInfo: function (firstTag, callback) {
                var url  = '/hack/childrenLabel/parent/' + firstTag.id;
                // test
                // url = '/hack/childrenLabel/parent';
                this.nav = firstTag;
                this.tagsSecondList = [];
                this.$dispatch('loading');
                $.getJSON(url, {id: firstTag.id}).then(function (data) {
                    var secondTag = data.data;
                    this.tagsSecondList = secondTag;
                    typeof callback === 'function' && callback();
                }.bind(this)).always(function (e) {
                    this.$dispatch('loaded');
                }.bind(this));
            },

            backFirstList: function () {
                this.$dispatch('backPage', 1);
            },

            chooseSecondTag: function (secondTag, event) {
                // console.log(this.nav);
                // 方法内 `this` 指向 vm
                // console.log(secondTag);
                // `event` 是原生 DOM 事件
                // alert(event.target.tagName);

                this.$dispatch(
                    'enterPage',
                    'photoPage',
                    {firstTag: this.nav, secondTag: secondTag}
                );
            }
        }
    });

    var postMsg = Vue.extend({
        template: postMsgTpl,
        data: function () {
            return {
                show: false,
                img: null,
                canvasWidth: 360,
                canvasHeight: 0,
                textLine: 1,
                msg: '',
                cvsUrl: ''
            };
        },
        events: {
            // show: 'show',
            // showOrHide: 'showOrHide',
            imgOnly: 'imgOnly',
            enter: function (pageName, photo) {
                if (pageName === 'postMsg') {
                    console.log(pageName);
                    this.show = true;
                    if (photo) {
                        console.log(photo);
                        this.img = photo.url;
                        // this.show = true;
                    }
                    // else {
                    //     this.img = null;
                    //     this.msg = '';
                    //     this.cvsUrl = '';
                    // }
                }
                else {
                    this.img = null;
                    this.msg = '';
                    this.cvsUrl = '';
                    this.show = false;
                }
            }
        },

        computed: {
            enable: function () {
                if (this.msg === '') {
                    return true;
                }
                else {
                    return false;
                }
            }
        },

        methods: {
            // show: function (item) {
            //     if (item) {
            //         this.img = item.url;
            //     }
            //     $('.main').hide();
            //     this.show = true;

            // },
            // showOrHide: function (item) {
            //     if (this.show === true) {
            //         this.show = false;
            //         this.msg = '';
            //         this.img = null;
            //         this.canvasHeight = 0;
            //         this.textLine = 1;
            //         this.$nextTick(function () {
            //             $('.main').show();
            //         });
            //     }
            //     else {
            //         this.show = true;
            //         this.$nextTick(function () {
            //             $('.main').hide();
            //         });

            //     }
            // },
            submit: function () {
                if (this.msg === '') {
                    return false;
                }

                if (this.img) {
                    this.renderImg();
                }
                else {
                    this.$emit('imgOnly');
                }

                // console.log(this.msg);
            },

            imgOnly: function () {
                var url = '/hack/picture/get/picture/0';
                this.$dispatch('loading');
                $.post(url, {q: this.msg}, 'json').then(function (data) {
                    console.log(data);
                    if (data.status === 0) {
                        this.img = data.data.url;
                        // postPage.postPageVue = data.data.currentPage;
                        // this.photos.total = data.data.total;
                        // if (data.data.pictures && data.data.pictures.length > 0) {
                        //     $.each(data.data.pictures, function (index, item) {
                        //         // item.showMenu = false;
                        //         this.photos.list.push(item);
                        //     }.bind(this));
                        // }
                        // if (data.data.currentPage * this.photos.pageSize >= this.photos.total) {
                        //     this.loadStatus = 2;
                        // }
                        // else {
                        //     this.loadStatus = 0;
                        // }
                    }
                    else {
                        console.log('服务器异常：', data.msg);
                        this.loadStatus = 0;
                    }
                    // this.refreshScroll();
                }.bind(this)).always(function (e) {
                    this.$dispatch('loaded');
                }.bind(this));
            },


            renderImg: function () {
                this.cvsUrl = '';
                var w = 320;
                var h = 320;
                var gap = 20;
                var fontSize = 20;
                var lineHeight = 30;

                var countOneLine = Math.floor(w / fontSize);
                var textList = this.msg.split('');
                var len = textList.length;
                this.textLine = Math.ceil(len / countOneLine);

                // 如果有图片
                if (this.img) {
                    var img = new Image();
                    this.$dispatch('loading');
                    img.src = this.img;
                    // img.setAttribute('crossOrigin', 'anonymous');
                    img.onload = function (e) {
                        this.$dispatch('loaded');
                        console.log(img.width + '-' + img.height);
                        // console.log(e);
                        // w = 320;
                        h = w * (img.height / img.width);
                        var canvasHeight = h + gap * 2 + gap + (this.textLine * lineHeight);
                        this.canvasHeight = ((this.textLine === 0) ? canvasHeight + lineHeight * 2 : canvasHeight);
                        this.$nextTick(function () {
                            this.clearCanvas();
                            this.getCtx().drawImage(img, gap, gap, w, h);
                            if (this.textLine === 0) {
                                this.getCtx().strokeRect(gap, h + gap * 2, w, lineHeight * 2);
                            }
                            this.renderText(textList, countOneLine, h, gap, fontSize, lineHeight);
                            this.updataImg();
                            // var imgData = this.getCtx().getImageData(0, 0, canvas.width, canvas.height);
                        });

                    }.bind(this);
                }

                // 如果没有图片 渲染一个魔法配图的图片
                else {
                    this.$nextTick(function () {
                        this.clearCanvas();
                        this.renderText(textList, countOneLine, h, gap, fontSize, lineHeight);
                        this.updataImg();
                    });
                }
                
                // console.log(val);
            },

            renderText: function (textList, countOneLine, h, gap, fontSize, lineHeight) {
                // 如果有文字
                var x = gap;
                var y = 2 * gap + h + gap;
                var ctx = this.getCtx();
                if (this.msg) {
                    // var maxWidth = w;
                    ctx.font = fontSize + 'px Microsoft YaHei';
                    ctx.fillStyle = '#333333';
                    $.each(textList, function (index, item) {
                        var lineNum = Math.floor(index / countOneLine);
                        var count = index % countOneLine;
                        ctx.fillText(
                            item,
                            x + (gap * count),
                            y + (lineHeight * lineNum),
                            20
                        );
                    });
                }
                else {
                    ctx.font = '16px Microsoft YaHei';
                    ctx.fillStyle = '#cccccc';
                    ctx.fillText(
                        '文字显示区域',
                        x,
                        y,
                        320
                    );
                }
            },

            updataImg: function () {
                var cvs = this.getCanvas();
                var url = cvs.toDataURL('image/png');
                this.$nextTick(function () {
                    this.cvsUrl = url;
                });
            },

            getCtx: function () {
                if (!this.ctx) {
                    var c = document.getElementById('img-canvas');
                    this.ctx = c.getContext('2d');
                }
                return this.ctx;
            },

            getCanvas: function () {
                return this.canvas || (this.canvas = document.getElementById('img-canvas'));
            },

            clearCanvas: function () {
                // console.log(this.getCtx().width + '==' + this.getCtx().height);
                var ctx = this.getCtx();
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(
                    0,
                    0,
                    this.canvasWidth,
                    this.canvasHeight
                );
            }
        },

        watch: {
            img: function (val, oldVal) {
                this.$nextTick(function () {
                    this.renderImg();
                });
                // postPage.clearCanvas();
                // if (val) {
                //     var img = new Image();
                //     img.src = val;
                //     img.onload = function (e) {
                //         console.log(img.width + '-' + img.height);
                //         // console.log(e);
                //         var w = 320;
                //         var h = 320 * img.height / img.width;
                //         this.canvasHeight = h + 100;
                //         this.$nextTick(function () {
                //             postPage.getCtx().drawImage(img, 20, 20, w, h);
                //         });
                //     }
                // }
                // console.log(val);
            }
        }
    });

    var photoPage = Vue.extend({
        template: photoPageTpl,
        data: function () {
            return {
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
                loadStatus: 0,
                show: false,
                backTopShow: false
            };
        },
        ready: function () {
            var self = this;
            $(window).scroll(function (e) {
                // var scrollTop = $(this).scrollTop
                // console.log(e.target.scrollTop + e.target.clientHeight, '/', e.target.scrollHeight);
                if ($(this).scrollTop() + $(this).height() >= $(document).height()) {
                    self.loadMore();
                }
                if ($(this).scrollTop() > $(this).height()) {
                    self.backTopShow = true;
                }
                else {
                    self.backTopShow = false;
                }

            });
        },
        events: {
            loadMore: 'loadMore',
            enter: function (pageName, data) {
                if (pageName === 'photoPage') {
                    console.log(pageName);
                    this.show = true;
                    if (data) {
                        // this.getScondePageInfo(firstTag);
                        this.reset(data.firstTag, data.secondTag);
                        this.$emit('loadMore');
                    }
                }
                else {
                    this.show = false;
                }
            }
        },
        methods: {
            reset: function (firstTag, secondTag) {
                this.nav.first = firstTag;
                this.nav.second = secondTag;
                this.photos.pageSize = 10;
                this.photos.currentPage = 0;
                this.photos.total = 0;
                this.photos.list = [];
                this.loadStatus = 0;
            },
            choosePhoto: function (photo, event) {
                // console.log(this);
                // 方法内 `this` 指向 vm
                // console.log(photo);
                this.$dispatch('enterPage', 'postMsg', photo);
                // this.$emit('show', photo);
                // `event` 是原生 DOM 事件
            },

            // showMenu: function (photo, event) {
            //     // console.log(photo);
            //     photo.showMenu = !photo.showMenu;
            // },

            backFirstList: function () {
                this.$dispatch('backPage', 2);
                // photoPage.hide();
                // tagsPage.show(tagsPage.firstPageElm);
            },

            backSecondList: function () {
                this.$dispatch('backPage', 1);
                // photoPage.hide();
                // tagsPage.show(tagsPage.secondPageElm);
            },

            backTop: function () {
                // $(window).scrollTop(0);
                // window.scrollTo(0, 0);
                // $(window).animate({scrollTop:0});
                $('body,html').animate({scrollTop: 0}, 500);
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
                // url = '/hack/picture/pagination';

                $.getJSON(url, function (data) {
                    if (data.status === 0) {
                        this.photos.currentPage = data.data.currentPage;
                        this.photos.total = data.data.total;
                        if (data.data.pictures && data.data.pictures.length > 0) {
                            $.each(data.data.pictures, function (index, item) {
                                // item.showMenu = false;
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

    Vue.component('post-msg', postMsg);
    Vue.component('first-tag', firstTag);
    Vue.component('second-tag', secondTag);
    Vue.component('photo-page', photoPage);

    var bodyPageVue = new Vue({
        el: '.body',
        data: {
            pageStack: [],
            backBtnShow: false,
            loadingShow: true
        },
        // 在创建实例时 `events` 选项简单地调用 `$on`
        events: {
            init: function () {
                this.$emit('enterPage', 'firstTag');
            },

            enterPage: function (pageName, args) {
                this.pageStack.unshift(pageName);
                this.$broadcast('enter', pageName, args);
            },

            backPage: 'backPage',

            loading: function () {
                console.log('loading');
                this.loadingShow = true;
            },

            loaded: function () {
                console.log('loaded');
                this.loadingShow = false;
            }

        },
        watch: {
            pageStack: function (val, oldVal) {
                console.log(val);
                if (val.length <= 1) {
                    this.backBtnShow = false;
                }
                else {
                    this.backBtnShow = true;
                }
            }
        },
        methods: {
            
            togglePost: function () {
                console.log('togglePost');
                if (this.pageStack[0] === 'postMsg') {
                    this.backPage();
                }
                else {
                    this.$emit('enterPage', 'postMsg');
                }
                // postPage.postPageVue.$emit('showOrHide');
            },

            backPage: function (num) {
                if (num && num > 1) {
                    while (num--) {
                        this.pageStack.shift();
                    }
                }
                else {
                    this.pageStack.shift();
                }
                // console.log('sdwdwdw');
                console.log(this.pageStack[0]);
                if (this.pageStack[0]) {
                    this.$broadcast('enter', this.pageStack[0]);
                }
            }
        }
    });

    var page = {
        init: function () {
                        
            fastClick.attach(document.body);
            // menu.init();
            // tagsPage.init();
            // events.init();
            // postPage.init();
            bodyPageVue.$emit('init');
        }
    };

    return page;
});
