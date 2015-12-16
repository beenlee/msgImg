<div class="row photo-page" v-show="show" >
    <div class="col-xs-12 text-left text-color-primary nav-wrap">
        <div class="tag-nav " @click="backFirstList()">
            {{nav.first.firstLabel}}
        </div>
        <div class="tag-nav" @click="backSecondList()">
            {{nav.second.secondLabel}}
        </div>
    </div>

    <div class="list-wrap col-xs-12 text-center text-color-primary">
        <div class="iScroll-wrapper">
            <div class="scroller ">
                <!-- <div class="pull-down">
                    <span class="am-icon-arrow-down pull-label" style="display: none;">下拉刷新</span>
                    <span class="am-icon-spinner am-icon-spin pull-loading" ></span>
                </div> -->
                <div class="row">
                    <div class="col-xs-6 col-sm-3 first-list">
                        <ul class="photo-list list-inline row">
                            <li v-for="item in photos.list" v-bind:class="['col-xs-12', $index%4==0 ? 'first' : '', $index%4==1 ? 'second' : '', $index%4==2 ? 'third' : '', $index%4==3 ? 'forth' : '']" @click="choosePhoto(item, $event)"  >
                                <div class="thumbnail photo-item">
                                    <img v-bind:src="item.url" class="">
                                    </img>
                                    <!-- <div v-bind:class="['img-menu', item.showMenu ? '' : 'hide' ]"  >
                                        <div class="img-menu-mask"></div>
                                        <div class="img-menu-content">
                                            <button class="btn btn-primary">状态配图</button>
                                        </div>
                                    </div> -->
                                <div>
                            </li>
                        </ul>    
                    </div>
                    <div class="col-xs-6 col-sm-3 second-list">
                        <ul class="photo-list list-inline row">
                            <li v-for="item in photos.list" v-bind:class="[ 'col-xs-12', $index%4==0 ? 'first' : '', $index%4==1 ? 'second' : '', $index%4==2 ? 'third' : '', $index%4==3 ? 'forth' : '']" @click="choosePhoto(item, $event)"  >
                                 <div class="thumbnail photo-item">
                                    <img v-bind:src="item.url" class="">
                                    </img>
                                    <!-- <div v-bind:class="['img-menu', item.showMenu ? '' : 'hide' ]"  >
                                        <div class="img-menu-mask"></div>
                                        <div class="img-menu-content">
                                            <button class="btn btn-primary">状态配图</button>
                                        </div>
                                    </div> -->
                                <div>
                            </li>
                        </ul>
                    </div>
                    <div class="col-xs-6 col-sm-3 third-list">
                        <ul class="photo-list list-inline row">
                            <li v-for="item in photos.list" v-bind:class="['col-xs-12', $index%4==0 ? 'first' : '', $index%4==1 ? 'second' : '', $index%4==2 ? 'third' : '', $index%4==3 ? 'forth' : '']" @click="choosePhoto(item, $event)"   >
                                <div class="thumbnail photo-item">
                                    <img v-bind:src="item.url" class="">
                                    </img>
                                    <!-- <div v-bind:class="['img-menu', item.showMenu ? '' : 'hide' ]"  >
                                        <div class="img-menu-mask"></div>
                                        <div class="img-menu-content">
                                            <button class="btn btn-primary">状态配图</button>
                                        </div>
                                    </div> -->
                                <div>
                            </li>
                        </ul>    
                    </div>
                    <div class="col-xs-6 col-sm-3 forth-list">
                        <ul class="photo-list list-inline row">
                            <li v-for="item in photos.list" v-bind:class="['col-xs-12', $index%4==0 ? 'first' : '', $index%4==1 ? 'second' : '', $index%4==2 ? 'third' : '', $index%4==3 ? 'forth' : '']" @click="choosePhoto(item, $event)"  >
                                <div class="thumbnail photo-item">
                                    <img v-bind:src="item.url" class="">
                                    </img>
                                    <!-- <div v-bind:class="['img-menu', item.showMenu ? '' : 'hide' ]"  >
                                        <div class="img-menu-mask"></div>
                                        <div class="img-menu-content">
                                            <button class="btn btn-primary">状态配图</button>
                                        </div>
                                    </div> -->
                                <div>
                            </li>
                        </ul>    
                    </div>
                </div>
                
                <div class="up-down ">
                    <span v-show="loadStatus == 0" class="load-more-data btn bg-color-primary" @click="loadMore()" >加载更多</span>
                    <span v-show="loadStatus == 1" class="loading-data am-icon-spinner am-icon-spin">正在加载...</span>
                    <span v-show="loadStatus == 2" class="no-more-data">没有更多了</span>
                </div>
            </div>
        </div>
    </div>
    <div @click="backTop" class="back-top" v-show="backTopShow">
        <div class="back-top-mask"></div>
        <div class="back-top-content glyphicon glyphicon-arrow-up text-center"></div>
    </div>
</div>