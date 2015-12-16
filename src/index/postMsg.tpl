<div class="container-fluid post-msg" v-show="show" style="display:none;">
    <div class="row">
        <div class="col-xs-12 col-sm-6 msg-wrap">
            <form v-on:submit.prevent="submit">
                <div class="form-group">
                    <label for="msg-input" class="text-color-primary">要发的状态</label>
                    <input id="msg-input" placeholder="输入..." v-model="msg" class="form-control">
                </div>
                <div class="form-group text-right">
                    <span v-on:click="imgOnly" class="magic-btn text-warning text-center bg-color-primary">变</span>
                    <button type="submit" class="btn bg-color-primary" v-bind:disabled="enable">生成图片</button>
                </div>
            </form>                
        </div>
        <div class="col-xs-12 col-sm-6 img-wrap">
            <canvas id="img-canvas" class="img-canvas" v-bind:width="canvasWidth" v-bind:height="canvasHeight"></canvas>
            <img v-bind:src="cvsUrl" v-show="img">
        </div>
    </div>
</div>