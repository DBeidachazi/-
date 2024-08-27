import calc_pawn_targets from "./calc_pawn_targets";
import evaluate_panel_weight from "./evaluate_panel_weight";
var init_panel_arr = [
    "rc1 rm1 rx1 rs1 rj1 rs2 rx2 rm2 rc2 ",
    "000 000 000 000 000 000 000 000 000",
    "000 rp1 000 000 000 000 000 rp2 000",
    "rz1 000 rz2 000 rz3 000 rz4 000 rz5",
    "000 000 000 000 000 000 000 000 000",
    //中间线
    "000 000 000 000 000 000 000 000 000",
    "mz1 000 mz2 000 mz3 000 mz4 000 mz5",
    "000 mp1 000 000 000 000 000 mp2 000",
    "000 000 000 000 000 000 000 000 000",
    "mc1 mm1 mx1 ms1 mj1 ms2 mx2 mm2 mc2",

];//初始化棋盘

init_panel_arr = [
    "rc1 rm1 rx1 rs1 rj1 rs2 rx2 rm2 rc2 ",
    "000 000 000 000 000 000 000 000 000",
    "000 rp1 000 000 000 000 000 rp2 000",
    "rz1 000 rz2 000 rz3 000 rz4 000 rz5",
    "000 000 000 000 000 000 000 000 000",
    //中间线
    "000 000 000 000 000 000 000 000 000",
    "mz1 000 mz2 000 mz3 000 mz4 000 mz5",
    "000 mp1 000 000 000 000 000 mp2 000",
    "000 000 000 000 000 000 000 000 000",
    "mc1 mm1 mx1 ms1 mj1 ms2 mx2 mm2 mc2",

];//初始化棋盘

var codePawnTextMap = {
    c: "创",
    m: "孝",
    x: "典",
    s: "绝",
    j: "蚌",
    p: "急",
    z: "对",
};//棋盘棋子文字与代号的映射
var codePawnTextMap2 = {
    c: "盒",
    m: "批",
    x: "寄",
    s: "乐",
    j: "赢",
    p: "麻",
    z: "退",
};
var chinese_chess_logic = {
    panel:{
    },
    status_const:{
        me:1,
        rival:2
    },
    history_steps: [],
    is_own_turn:true, //是否该己方下子，

    all_matrix:[],//棋盘所有子的矩阵
    all_win_arr:[], //存储所有赢法数组 ['x-y','x1-y1'] //x,y索引做成字符串
    total_win_count:0,//所有赢法总数
    my_win_arr:[],//我自己所有能赢的数组
    rival_win_arr: [],//对手所有能赢的数组
    is_game_over:false,//是否游戏结束
    own_weight:[],//自己的权重，计算 ai 时用到
    rival_weight:[],//对手权重 ，计算 ai 时用到
    renderView:(x,y,is_rival) => {},//放下子的UI逻辑，由外部传入
    mySucceed:(completed_arr) => {},//我成功的逻辑，由外部传入
    myFailed:(completed_arr) => {},//我失败的逻辑，由外部传入

    init(params,is_ai_first) {
        this.is_game_over = false
        this.is_own_turn = true
        this.total_win_count = 0
        this.all_win_arr = []

        Object.assign(this,params)
        this.initPanelWithPawns();
        // if(is_ai_first)
        // {
        //     console.log('isaifirst');
        //     this.putSinglePawn(parseInt(this.panel.x/2),parseInt(this.panel.y/2),true) //如果让 ai 先走,则先占中间
        // }
        return this;
    },
    //初始化棋盘
    initPanelWithPawns() {
        var dest_data = []
        for (var line_index in init_panel_arr) {
            var line = init_panel_arr[line_index];
            line = line.trim();
            var temp_line = []
            var pawn_code_arr = line.split(/\s+/);
            for (var pawn_index in pawn_code_arr) {
                temp_line.push(this.getInitSinglePawnData(pawn_code_arr[pawn_index],line_index,pawn_index));
            }
            dest_data.push(temp_line);
        }
        this.all_matrix = dest_data;
        return dest_data;
    },
    defaultItem(y,x) {
        return {
            x: x,
            y:y,
            is_target_blink:false,//是否是可移动的点，默认不是
            is_selected:false,//是否选中，默认不是
            status:0
        }
    },
    getInitSinglePawnData(code_str,line_index,pawn_index) {
        var dest_obj = this.defaultItem(parseInt(line_index), parseInt(pawn_index))
        if(code_str.length !== 3){
            console.error(code_str + "格式不对");
            return false;
        }
        if (code_str !== '000') {
            //    有值
            var is_rival = code_str[0] === "r";
            var num = code_str[2];
            var code = code_str[1];
            dest_obj = Object.assign(dest_obj,{
                status: is_rival ? this.status_const.rival : this.status_const.me,
                text: codePawnTextMap[code],
                code:code,
                num:num,
                is_rival:is_rival
            } )
        }
        return dest_obj;
    },
    getNewStepMatrix(old_pawn,new_pawn,all_matrix) {
        var new_all_matrix = JSON.parse(JSON.stringify(all_matrix));
        new_all_matrix[old_pawn.y][old_pawn.x] = this.defaultItem(old_pawn.y,old_pawn.x);
        // 新值除了 x,y 其他用老值
        var new_item = Object.assign({},old_pawn,{
            x:new_pawn.x,
            y:new_pawn.y
        })
        new_all_matrix[new_pawn.y][new_pawn.x] = new_item;
        return new_all_matrix;
        // this.$set(this.all_data[new_item.y], new_item.x,new_item)
    },

    onClickEvent(x,y) {
        console.log(x,y)
    },
    calcAllTargetPoints(current_item,all_matrix) {
        return calc_pawn_targets.getPointsArr(current_item,all_matrix)
    },

    calcPanelVals(all_matrix) {
        return  evaluate_panel_weight.evaluate(all_matrix)

    },

    getAllOneSideSteps(all_matrix,is_rival) {
        var all_one_side_pawns = this.getOneSidePawns(all_matrix,is_rival);
        //再获得所有子的所有走法
        var dest_steps = [];
        for (var i in all_one_side_pawns) {
            var from_pawn = all_one_side_pawns[i];
            var all_target_points = this.calcAllTargetPoints(from_pawn, all_matrix);
            for (var j in all_target_points) {
                dest_steps.push({
                    from: from_pawn,
                    to: all_target_points[j]
                });
            }
        }
        return dest_steps
    },
    calcAiStep(all_matrix) {
        console.log('calc-')
        var depth = 3;//默认深度为3 越大越准
        var available_steps = this.getAllOneSideSteps(all_matrix,true);
        //再遍历新的步骤，看下一步的情况
        var now_val = 100000//最差情况的 val
        var dest_step = null;
        console.log(available_steps)
        for (var k in available_steps) {
            var single_step = available_steps[k];
            var new_matrix = this.getNewStepMatrix(single_step.from, single_step.to, all_matrix);
            var available_sub_steps = this.getAllOneSideSteps(new_matrix, false);
            var temp_step_val = -10000
            for (var m in available_sub_steps) {
                var single_sub_step = available_sub_steps[m];
                var new_sub_matrix = this.getNewStepMatrix(single_sub_step.from, single_sub_step.to, new_matrix);
                var new_sub_val = this.calcPanelVals(new_sub_matrix);
                if (new_sub_val > temp_step_val) {
                    temp_step_val = new_sub_val;
                }
            }
            //    计算出当前 的棋局
            if (temp_step_val <now_val) {
                console.log(temp_step_val);
                now_val = temp_step_val;
                dest_step = single_step;
            }
        }
        console.log(dest_step);
        return dest_step;
    },

    recursiveCalcAiSteps(all_matrix,is_rival,depth) {
        if (depth === 0) {
            //根据 matrix 算出当前的棋盘的价值差
            return  {
                val: this.calcPanelVals(all_matrix),
            }
        }

    },
    //
    calcAiStepBf(all_matrix) {
        var all_rival_pawns = this.getOneSidePawns(all_matrix,true);
        //再获得所有子的所有走法
        all_rival_pawns.sort(() =>{return Math.random()>=0.5?-1:1;});
        for (var j in all_rival_pawns) {
            var from_pawn = all_rival_pawns[j];
            //列出此子的所有走法
            var all_target_points = this.calcAllTargetPoints(from_pawn, all_matrix);
            if (all_target_points.length) {
                all_target_points.sort(() =>{return Math.random()>=0.5?-1:1;});
                return {
                    from : from_pawn,
                    to: all_target_points[0]
                };
            }
        }
        return null;
    },
    getOneSidePawns(all_matrix,is_rival) {
        var dest_arr = [];
        for (var i in all_matrix) {
            for (var j in all_matrix[i]) {
                if (all_matrix[i][j].status && all_matrix[i][j].is_rival === is_rival) {
                    dest_arr.push(all_matrix[i][j])
                }
            }
        }
        return dest_arr;

    },
    getOneSideJiang(all_matrix,is_rival){
        var all_pawns = this.getOneSidePawns(all_matrix, is_rival);
        for (var i in all_pawns) {
            if (all_pawns[i].code === 'j') {
                return all_pawns[i]
            }
        }
        return null
    }
}

export default chinese_chess_logic;
