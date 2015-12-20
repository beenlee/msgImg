<div class="row second-tag-page" v-show="show">
    <div class="col-xs-12 text-left text-primary nav-wrap">
        <div class="tag-nav " @click="backFirstList()">
            {{nav.firstLabel}}
        </div>
    </div>
    <div class="list-wrap col-xs-12 text-center text-primary">
        
        <ul class="tag-second-list list-inline">
            <li class="tag-item" v-for="item in tagsSecondList" v-on:click="chooseSecondTag(item, $event)"  >
                <div  class="tag-item-text">{{item.secondLabel}}</div>
            </li>
        </ul>
    </div>
</div>