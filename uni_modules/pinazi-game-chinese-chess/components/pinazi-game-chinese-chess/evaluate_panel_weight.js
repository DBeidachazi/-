var evaluate_panel_weight = {
    all_matrix:[],
    code_weight_map: {},//棋子权重映射
    evaluate(all_matrix) {
        this.all_matrix = all_matrix;
        var dest = 0;
        for (var i in all_matrix) {
            for (var j in all_matrix[i]) {
                var temp_pawn = all_matrix[i][j];
                switch (temp_pawn.code){
                    case "c":
                        dest += this.evaluateC(temp_pawn);
                        break;
                    case "m":
                        dest += this.evaluateM(temp_pawn);
                        break;
                    case "x":
                        dest += this.evaluateX(temp_pawn);
                        break;
                    case "s":
                        dest += this.evaluateS(temp_pawn);
                        break;
                    case "j":
                        dest += this.evaluateJ(temp_pawn);
                        break;
                    case "p":
                        dest += this.evaluateP(temp_pawn);
                        break;
                    case "z":
                        dest += this.evaluateZ(temp_pawn);
                        break;
                }
            }
        }
        return dest;
    },
    __formatVal(current_item,val) {
        return current_item.is_rival ? -1 * val : val
    },

    __formatMap(code,arr) {
        this.code_weight_map[code] = {}
        var temp_arr = []
        for (var i in arr) {
            var line_arr = arr[i].split(/\s+/);
            // 换成数字
            line_arr = line_arr.map((v) => {
                return parseInt(v)
            })
            //    由于只做前半段，所有要把后半段加上
            line_arr.push(line_arr[3]);
            line_arr.push(line_arr[2]);
            line_arr.push(line_arr[1]);
            line_arr.push(line_arr[0]);
            temp_arr.push(line_arr);
        }
        this.code_weight_map[code]['self'] =  JSON.parse(JSON.stringify( temp_arr ));
        this.code_weight_map[code]['rival'] = temp_arr.reverse();
    },
    __getWeight(current_item,code) {
        var key = "self";
        if (current_item.is_rival) {
            key = "rival"
        }
        return  this.code_weight_map[code][key][current_item.y][current_item.x];
    },

    // todo 应该根据棋盘不同的点有不同的值的，现在只简单这样了
    evaluateC(current_item) {
        //应该有问题 todo 回头参考下 皮卡鱼，看看他们怎么做的
        // var code = 'c'
        // if(!this.code_weight_map[code]){
        //     var arr = [
        //         "312 312 334 334 334",
        //         "312 334 334 340 350",
        //         "312 312 334 340 340",
        //         "312 334 334 340 340",
        //         "325 325 325 334 334",
        //         //中间线
        //         "325 330 330 334 330",
        //         "312 325 312 330 325",
        //         "300 325 312 330 312",
        //         "305 325 320 330 300",
        //         "300 320 312 330 300",
        //     ];
        //     this.__formatMap(code,arr)
        // }
        // return this.__getWeight(current_item,code)
        var extra = 0;
        if (current_item.x > 0 && current_item.x < 8 && current_item.y >= 2 &&current_item.y <=7) {
            extra = 20;
        }

        if (current_item.x > 0 && current_item.x < 8 && current_item.y >= 4 &&current_item.y <=5) {
            extra = 26;
        }
        return this.__formatVal(current_item, 300 + extra);
    },
    evaluateM(current_item) {
        // todo 怎么比不加这个的还笨？
        // var code = 'm'
        // if(!this.code_weight_map[code]){
        //     var arr = [
        //         "130 130 130 130 130",
        //         "136 136 160 140 136",
        //         "142 140 152 160 152",
        //         "136 160 152 166 160",
        //         "152 152 160 166 166",
        //         //中间线
        //         "136 152 160 162 160",
        //         "136 140 152 140 152",
        //         "142 140 148 140 136",
        //         "130 136 136 136 126",
        //         "130 130 130 130 130",
        //     ];
        //     this.__formatMap(code,arr)
        // }
        // return this.__getWeight(current_item,code)

        var extra = 0;
        if (current_item.x > 0 && current_item.x < 8 && current_item.y >= 2 &&current_item.y <=7) {
            extra = 10;
        }
        if (current_item.x > 1 && current_item.x < 7 && current_item.y >= 3 &&current_item.y <=5) {
            extra = 20;
        }
        return this.__formatVal(current_item, 130 + extra);
    },

    evaluateX(current_item) {
        var extra = 0;
        if(current_item.x === 4 && (current_item.y === 2  || current_item.y === 7)){
            extra = 15
        }
        return this.__formatVal(current_item, 20 + extra);
    },

    evaluateS(current_item) {
        var extra = 0;
        if(current_item.x === 4 && (current_item.y === 1  || current_item.y === 8)){
            extra = 5
        }
        return this.__formatVal(current_item, 20 + extra);
    },
    evaluateJ(current_item) {
        var extra = 0;
        if(current_item.x === 4 && (current_item.y === 0  || current_item.y === 9)){
            extra = 10
        }
        if(current_item.x === 4 && (current_item.y === 1  || current_item.y === 8)){
            extra = 5
        }
        return this.__formatVal(current_item, 10000 + extra);
    },
    evaluateP(current_item) {
        var extra = 0;
        if(current_item.x === 4 && (current_item.y === 2  || current_item.y === 7)){
            extra = 25
        }
        return this.__formatVal(current_item, 140 + extra);
    },
    evaluateZ(current_item) {
        var extra = 0;
        if((current_item.y === 4  || current_item.y === 5)){
            extra = 2
        }
        return this.__formatVal(current_item, 20+extra);
    },
}
export default evaluate_panel_weight;
