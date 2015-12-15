/**
 * @file main.js
 * @author: lidianbin(lidianbin@baidu.com)
 * @Date:   2015-12-03 13:20:06
 * @Last Modified by:   lidianbin
 * @Last Modified time: 2015-12-13 00:09:37
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

    var postPage = {
        imgObj: null,
        postPageVue: null,
        myCanvasCxt: null,
        init: function () {

            this.postPageVue = new Vue({
                el: '.post-msg',
                data: {
                    show: false,
                    img: null,
                    canvasWidth: 360,
                    canvasHeight: 0,
                    textLine: 1,
                    msg: '',
                    cvsUrl: ''
                },
                events: {
                    show: 'show',
                    showOrHide: 'showOrHide',
                    imgOnly: 'imgOnly'
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
                    show: function (item) {
                        if (item) {
                            this.img = item.url;
                        }
                        $('.main').hide();
                        this.show = true;

                    },
                    showOrHide: function (item) {
                        if (this.show === true) {
                            this.show = false;
                            this.msg = '';
                            this.img = null;
                            this.canvasHeight = 0;
                            this.textLine = 1;
                            this.$nextTick(function () {
                                $('.main').show();
                            });
                        }
                        else {
                            this.show = true;
                            this.$nextTick(function () {
                                $('.main').hide();
                            });

                        }
                    },
                    submit: function () {
                        if (this.msg === '') {
                            return false;
                        }

                        if (this.img) {
                            postPage.renderImg();
                        }
                        else {
                            this.$emit('imgOnly');
                        }

                        // console.log(this.msg);
                    },

                    imgOnly: function () {
                        var url = '/hack/picture/get/picture/0';
                        $.post(url, {q: postPage.postPageVue.msg}, function (data) {
                            console.log(data);
                            if (data.status === 0) {
                                postPage.postPageVue.img = data.data.url;
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
                        }.bind(this), 'json');
                    }

                }
            });

            this.postPageVue.$watch('img', function (val, oldVal) {
                
                postPage.renderImg();
                // postPage.clearCanvas();
                // if (val) {
                //     var img = new Image();
                //     img.src = val;
                //     img.onload = function (e) {
                //         console.log(img.width + '-' + img.height);
                //         // console.log(e);
                //         var w = 320;
                //         var h = 320 * img.height / img.width;
                //         postPage.postPageVue.canvasHeight = h + 100;
                //         postPage.postPageVue.$nextTick(function () {
                //             postPage.getCtx().drawImage(img, 20, 20, w, h);
                //         });
                //     }
                // }
                // console.log(val);
            });

            // this.postPageVue.$watch('msg', function (val, oldVal) {
            //     postPage.renderImg();
            // });

            this.renderImg = function () {
                var countOneLine = 16;
                var textList = postPage.postPageVue.msg.split('');
                var len = textList.length;
                postPage.postPageVue.textLine = Math.ceil(len / countOneLine);
                
                var w = 320;
                var h = 320;
                // 如果有图片
                if (postPage.postPageVue.img) {
                    var img = new Image();
                    img.src = postPage.postPageVue.img;
                    // img.setAttribute('crossOrigin', 'anonymous');
                    img.onload = function (e) {
                        console.log(img.width + '-' + img.height);
                        // console.log(e);
                        w = 320;
                        h = 320 + 20 * img.height / img.width;
                        postPage.postPageVue.canvasHeight = h + 40 + 30 + postPage.postPageVue.textLine * 30;
                        postPage.postPageVue.$nextTick(function () {
                            postPage.clearCanvas();
                            postPage.getCtx().drawImage(img, 20, 20, w, h);
                            postPage.renderText(textList, countOneLine, h);
                            postPage.updataImg();
                            // var imgData = postPage.getCtx().getImageData(0, 0, canvas.width, canvas.height);
                        });

                    }
                }

                // 如果没有图片 渲染一个魔法配图的图片
                else {
                    postPage.postPageVue.$nextTick(function () {
                        postPage.clearCanvas();
                        postPage.renderText(textList, countOneLine, h);
                        postPage.updataImg();
                    });
                }
                
                // console.log(val);
            };

            this.renderText = function (textList, countOneLine, h) {
                // 如果有文字
                if (postPage.postPageVue.msg) {
                    var x = 20;
                    var y = 40 + h + 30;
                    // var maxWidth = w;
                    var ctx = postPage.getCtx();
                    ctx.font="20px Georgia";
                    ctx.fillStyle = '#333333';
                    $.each(textList, function (index, item) {
                        var lineNum = Math.floor(index / countOneLine);
                        var count = index % countOneLine;
                        ctx.fillText(
                            item,
                            x + 20 * count,
                            y + 30 * lineNum,
                            20
                        );
                    });
                }
            };

            this.updataImg = function () {
                var cvs = postPage.getCanvas();
                var url = cvs.toDataURL('image/png');
                postPage.postPageVue.cvsUrl = url;
            };

            this.getCtx = function () {
                if (!this.ctx) {
                    var c = document.getElementById('img-canvas');
                    this.ctx = c.getContext('2d');
                }
                return this.ctx;
            };

            this.getCanvas = function () {
                return this.canvas || (this.canvas = document.getElementById('img-canvas'));
            };

            this.clearCanvas = function () {
                // console.log(this.getCtx().width + '==' + this.getCtx().height);
                var ctx = this.getCtx();
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(
                    0,
                    0,
                    postPage.postPageVue.canvasWidth,
                    postPage.postPageVue.canvasHeight
                );
            }; 
            // this.postPageVue.$watch('msg', function (val) {
            //     console.log(val);
            // });
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
                        postPage.postPageVue.$emit('show', photo);                        // `event` 是原生 DOM 事件
                    },

                    // showMenu: function (photo, event) {
                    //     // console.log(photo);
                    //     photo.showMenu = !photo.showMenu;
                    // },

                    backFirstList: function () {
                        photoPage.hide();
                        tagsPage.show(tagsPage.firstPageElm);
                    },

                    backSecondList: function () {
                        photoPage.hide();
                        tagsPage.show(tagsPage.secondPageElm);
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
            // this.initScroll();
        },

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
                            tagsPage.getScondePageInfo(firstTag);
                            tagsPage.hide(tagsPage.firstPageElm);
                            tagsPage.show(tagsPage.secondPageElm);
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
            typeof callback === 'function' && callback();
        },

        getScondePageInfo: function (firstTag, callback) {
            var url  = '/hack/childrenLabel/parent/' + firstTag.id;
            // test
            // url = '/hack/childrenLabel/parent';
            if (!this.secondPageVue) {
                this.secondPageInit(firstTag, []);
            }
            this.secondPageVue.nav = firstTag;
            this.secondPageVue.tagsSecondList = [];
            $.getJSON(url, {id: firstTag.id}, function (data) {
                var secondTag = data.data;
                this.secondPageVue.tagsSecondList = secondTag;
                typeof callback === 'function' && callback();
            }.bind(this));
        },

        show: function (elm) {
            $(elm).show();
        },

        hide: function (elm) {
            $(elm).hide();
        }
    };
    var menu = {
        menuVue: null,
        init: function () {
            this.menuVue = new Vue({
                el: '.header',
                methods: {
                    togglePost: function () {
                        postPage.postPageVue.$emit('showOrHide');
                    }
                }
            });
        }    
    };

    var page = {
        init: function () {
                        
            fastClick.attach(document.body);
            menu.init();
            tagsPage.init();
            events.init();
            postPage.init();
        }
    };

    return page;
});
