<div class="row first-tag-page" v-show="show">
    <div class="col-xs-12 text-center ">
        <h3>选择您想要的标签</h3>
        <ul class="tag-first-list list-inline">
            <li class="tag-item" v-for="item in tagsFirstList"  v-on:click="chooseFirstTag(item, $event)"  >
                <div class="tag-item-text">{{item.firstLabel}}</div>
            </li>
        </ul>
    </div>
</div>