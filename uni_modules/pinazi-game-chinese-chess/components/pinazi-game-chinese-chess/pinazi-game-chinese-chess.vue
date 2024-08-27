<template>
    <view>
        <view class="pnz_chinese_chess_wrap" style="padding:20px 2px;">
            <view class="" style="padding: 10px 0 20px 0;font-size: 30px;color:#333;">
                互联网新时代概念象棋
            </view>
            <view class="pnz_panel_wrap" @click="clickEvent">
                <view v-for="(line,line_index) in 9" :key="line" class="single_line">
<!--                    {{line}}-->
                    <view class="panel_center" :style="[panelCenterStyle()]" v-if="line_index === 4">
                        <span>退 麻</span>
                        <span style="transform: rotate(180deg)">盒 寄</span>
                    </view>
                    <view v-else
                          v-for="(cell,cell_index) in 8" :key="cell_index"
                          class="single_cell"
                          :class="[customSingleCellClass(cell_index,line_index)]"
                          :style="[customSingleCellStyle(cell_index,line_index)]"
                    >
                    </view>
                </view>

                <!-- 此处要加上 绝对定位的 棋子 -->
                <view v-for="(pawn_line_item,pawn_line_index) in all_data" >
                    <view
                        v-for="(pawn_item,pawn_index) in pawn_line_item"
                        class="single_pawn_base "
                        :class="[pawnClass(pawn_item)]"
                        :style="[pawnStyle(pawn_item)]"
                    >
                        <span class="pawn_text" v-if="pawn_item.status">{{pawn_item.text}}</span>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import chinese_chess_logic from "./chinese_chess_logic";
export default {
    name:"pinazi-game-chinese-chess",
    data() {
        return {
            all_data:[[

            ]],
            panel:{
                x:9,
                y:10
            },
            status_const:{
                me:1,
                rival:2
            },
            ai_first:true,// ai先下
            cell_length:40 ,//单元格大小

            pawn_length:34,//棋子大小

            current_clicked_item:null,//当前已经选中的棋子
            current_target_arr:null,//当前 子可操作的点

        };
    },
    mounted() {
        this.init()
    },
    methods:{
        init(){
            this.logic_obj = chinese_chess_logic.init(
                {
                    status_const:this.status_const,
                },this.ai_first)

            this.initAllData();

        },

        putPawn(x, y, is_rival) {
            var dest_status = is_rival ? this.status_const.rival : this.status_const.me;
            // this.$set(this.all_data[y][x], 'status', dest_status);
        },
        initAllData(){
            this.all_data = [];
            //获得数据
            for (var j in  this.logic_obj.all_matrix) {
                var temp_line = []
                for (var i in this.logic_obj.all_matrix[j]) {

                    temp_line.push(this.logic_obj.all_matrix[j][i]);
                }
                this.all_data.push(temp_line)
            }
        },
        panelCenterStyle(){
            var dest_style = {
                lineHeight:this.cell_length+"px",
                height:this.cell_length+"px",
                fontSize:this.cell_length*0.6+"px"
            }
            return dest_style;
        },
        customSingleCellStyle(cell_index,line){
            var dest_style = {
                width:this.cell_length+"px",
                height:this.cell_length+"px",
            }
            return dest_style;

        },
        customSingleCellClass(cell_index,line){
            var dest_class = ""
            if(
                (line === 7 && cell_index=== 3) || (line === 0 && cell_index === 3)
            )
            {
                dest_class = "shi_bias"
            }
            return dest_class
        },
        pawnClass(pawn_item){
            var dest = "none"
            switch (pawn_item.status){
                case 2:
                    dest = "red"
                    break;
                case 1:
                    dest = "black"
                    break;
            }

            if (pawn_item.is_selected) {
                dest = dest + " selected"
            }
            if (pawn_item.is_target_blink) {
                dest = dest + " target_blink"
            }
            return dest;
        },
        pawnStyle(pawn_item) {
            var dest = {
                fontSize: this.pawn_length * 0.6 + "px",
                fontWeight: 'bold',
                width: this.pawn_length + "px",
                height: this.pawn_length + "px",
                left: (this.cell_length * pawn_item.x - this.pawn_length / 2) + 'px',
                top: (this.cell_length * pawn_item.y - this.pawn_length / 2) + 'px'
            }
            return dest;
        },
        getLengthIndex(offset_length){
            // 算出 x的 index
            var index = 0;
            if(offset_length > 0)
            {
                index = parseInt(offset_length/this.cell_length);
                var extra_length = offset_length % this.cell_length;
                if(extra_length > this.cell_length/2){
                    // 如果尺寸大于 1/2 则算做下一个
                    index = index +1;
                }
            }
            return index;
        },
        restart() {
            this.init()

        },
        failed() {
            uni.showModal({
                content: '输了',
                confirmText:'再来一局',
                success:  (res) => {
                    if (res.confirm) {
                        this.restart()
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            });
        },
        succeed() {

            uni.showModal({
                content: '赢了',
                confirmText:'再来一局',
                success:  (res) => {
                    if (res.confirm) {
                        this.restart()
                    } else if (res.cancel) {
                       this.restart()
                    }
                }
            });
        },
        clickEvent(e){
            if (!this.logic_obj.is_own_turn) {
                console.log("不该我们移子")
                return false;
            }
            if (this.logic_obj.is_game_over) {
                console.log('游戏已经结束')
                return false;
            }
            var offset_x = e.detail.x - e.currentTarget.offsetLeft;
            var offset_y = e.detail.y - e.currentTarget.offsetTop;
            // 算出 x的 index
            var x_index = this.getLengthIndex(offset_x)
            var y_index = this.getLengthIndex(offset_y)
            //根据点把当前的 selected ui改下，再查找下一步的可能的点，渲染
            var now_item = this.all_data[y_index ][x_index]

            if (!this.current_clicked_item) {
                //不存在，则是第一次点
                if (!now_item.status || now_item.is_rival) {
                    console.log('不该点');
                    return false;
                }
                this.itemSelected(now_item)
            }else{
                //点过，如果是自己的子，则换成现在的子为要移动的子
                if (now_item.status && !now_item.is_rival) {
                    //先把老的清空
                    this.clearSelectedStatus()
                    //再重新设置
                    this.itemSelected(now_item)
                }else{
                    //这时应该下子了，如果在目标数组中，则移动，否则不移动
                    var is_in_targets = !!this.current_target_arr.filter((v) => {
                        return v.x === now_item.x && v.y === now_item.y
                    }).length;
                    if (is_in_targets) {
                        this.logic_obj.history_steps.push({
                            from:this.current_clicked_item,
                            to: now_item,
                            is_eating:now_item.status
                        })
                        //    UI改变
                        this.clearSelectedStatus();
                        this.moveStep(this.current_clicked_item,now_item)
                        if (!this.logic_obj.getOneSideJiang(this.all_data, true)) {
                            this.logic_obj.is_game_over = true;
                            this.succeed();
                            return false;
                        }
                        this.current_clicked_item = null;
                         this.current_target_arr = null;
                        // this.$set(this.all_data[now_item.y], now_item.x,new_item)
                        this.logic_obj.is_own_turn = !this.logic_obj.is_own_turn;
                        // 该让 AI去算下一步怎么走了
                        var res = this.logic_obj.calcAiStep(this.all_data);
                        this.moveStep(res.from,res.to)
                        this.logic_obj.is_own_turn = !this.logic_obj.is_own_turn;
                        if (!this.logic_obj.getOneSideJiang(this.all_data, false)) {
                            this.logic_obj.is_game_over = true;
                            this.failed();
                            return false;
                        }
                    }
                }
                //已经点过，则这一次 看下是吃，还是移动
            }
        },

        moveStep(old_pawn,new_pawn) {
            this.$set(this,'all_data',this.logic_obj.getNewStepMatrix(old_pawn,new_pawn,this.all_data))
        },
        clearSelectedStatus() {
            this.$set(this.current_clicked_item,'is_selected',false);
            for (var i in this.current_target_arr) {
                this.$set(this.current_target_arr[i], 'is_target_blink', false);
            }
        },
        itemSelected(now_item) {
            this.current_clicked_item = now_item;
            this.$set(now_item,'is_selected',true);
            //    再算出可以到的点
            this.current_target_arr = this.logic_obj.calcAllTargetPoints(this.current_clicked_item,this.all_data);
            for (var i in this.current_target_arr) {
                this.$set(this.current_target_arr[i], 'is_target_blink', true);
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.pnz_chinese_chess_wrap{
    font-family: "楷体";
    text-align: center;
    overflow: auto;
    box-sizing: border-box;
}
.pnz_panel_wrap{
    display: inline-flex;
    border : 2px solid #999;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
    background: #eee;
}
.single_line{
    display: flex;
    justify-content: center;
    box-sizing: border-box;

}
.single_cell{
    position: relative;
    border:1px solid #bbb;
    box-sizing: border-box;

    &.shi_bias:before{
        content: "";
        position: absolute;
        left:-50%;
        top:100%;
        // width:240%;
        width:300%;
        transform: rotate(45deg);
        transform-origin: center;
        height:1px;
        overflow: hidden;
        background-color: #bbb;
    }

    &.shi_bias:after{
        content: "";
        position: absolute;
        left:-50%;
        top:100%;
        width:300%;
        transform: rotate(-45deg);
        transform-origin: center;
        height:1px;
        overflow: hidden;
        background-color: #bbb;
    }
}
.panel_center{
    font-weight: bold;
    color:#555;

    width:100%;
    display: flex;
    justify-content: space-around;
}

.single_pawn_base{
    position:absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    box-sizing: border-box;
    border:#4e3817 double 6px;
    background-color:#c0956a;
    margin:auto;text-align:center;
    box-shadow:2px 3px 2px black;

    &.none{
        display: none;
    }
    &.black{
        color:#000;
    }
    &.red{
        color: #aa0000;;
        border-color:#aa0000;
    }
    .pawn_text{
        // font-size: 30px;
    }
    &.selected{ //选中状态
        outline: 5px solid yellowgreen;
    }
    &.target_blink.none{
        display: block;
        border:none;
        left:0;
        transform: scale(0.3);
        background: red;
    }

    &.target_blink:before{
        content: '';
        width:5px;
        height:5px;
        display: block;
        position: relative;
        border:none;
        left:0;
        background: red;
    }
}
</style>
