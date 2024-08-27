
var calc_pawn_targets = {
    all_matrix:[],
    getPointsArr(current_item,all_matrix) {
        this.all_matrix = all_matrix;
        var dest = [];
        switch (current_item.code){
            case "c":
                dest = this.calcC(current_item,all_matrix);
                break;
            case "m":
                dest = this.calcM(current_item,all_matrix);
                break;
            case "x":
                dest = this.calcX(current_item,all_matrix);
                break;
            case "s":
                dest = this.calcS(current_item,all_matrix);
                break;
            case "j":
                dest = this.calcJ(current_item,all_matrix);
                break;
            case "p":
                dest = this.calcP(current_item,all_matrix);
                break;
            case "z":
                dest = this.calcZ(current_item,all_matrix);
                break;
        }
        return dest;
    },
    calcC(current_item,all_matrix) {
        var x,y,lx,rx,ly,ry,dest_arr = [],res_flag = false;
        lx = rx = x = current_item.x;
        ly = ry = y = current_item.y;
        var innerLogic = (y,x) => {
            if (//不存在这个点或者这个点是对手的
                this.isPawnNotExistsOrIsRival(y,x,current_item)
            ) {
                dest_arr.push(all_matrix[y][x]);
                if (all_matrix[y][x].status) {
                    return true;
                }
            }else{
                return true;
            }
        }
        while (lx >= 1) {
            lx--;
            res_flag = innerLogic(y,lx)
            if (res_flag === true) {
                break;
            }
        }
        while (rx <= 7) {
            rx++;
            res_flag = innerLogic(y,rx)
            if (res_flag === true) {
                break;
            }
        }
        while (ly >= 1) {
            ly--;
            res_flag = innerLogic(ly ,x)
            if (res_flag === true) {
                break;
            }
        }
        while (ry <= 8) {
            ry++;
            res_flag = innerLogic(ry ,x)
            if (res_flag === true) {
                break;
            }
        }
        return dest_arr;
    },
    calcM(current_item, all_matrix) {
        var x,y,dest_arr = [];
        x = current_item.x;
        y = current_item.y;
        //看马腿是否被别
        if (x >= 2) {
            if(!all_matrix[y][x-1].status){
                if (this.isPawnNotExistsOrIsRival(y-1,x-2,current_item)) {
                    dest_arr.push(all_matrix[y - 1][x - 2]);
                }
                if ( this.isPawnNotExistsOrIsRival(y + 1,x-2,current_item)) {
                    dest_arr.push(all_matrix[y + 1][x - 2]);
                }
            }
        }

        if (x <= 6) {
            if(!all_matrix[y][x+1].status){
                if (this.isPawnNotExistsOrIsRival(y-1,x+2,current_item)
                ) {
                    dest_arr.push(all_matrix[y - 1][x + 2]);
                }
                if (this.isPawnNotExistsOrIsRival(y+1,x+2,current_item)
                ) {
                    dest_arr.push(all_matrix[y + 1][x + 2]);
                }
            }
        }

        if (y >= 2) {
            if(!all_matrix[y-1][x].status){
                if ( this.isPawnNotExistsOrIsRival(y-2,x- 1,current_item)) {
                    dest_arr.push(all_matrix[y - 2][x - 1]);
                }
                if (this.isPawnNotExistsOrIsRival(y-2,x+ 1,current_item)) {
                    dest_arr.push(all_matrix[y - 2][x + 1]);
                }
            }
        }

        if (y <= 7) {
            if(!all_matrix[y+1][x].status){
                if (this.isPawnNotExistsOrIsRival(y+2,x- 1,current_item)) {
                    dest_arr.push(all_matrix[y + 2][x - 1]);
                }
                if (this.isPawnNotExistsOrIsRival(y+2,x+ 1,current_item)) {
                    dest_arr.push(all_matrix[y + 2][x + 1]);
                }
            }
        }
        return dest_arr;
    },

    calcX(current_item,all_matrix) {
        var x,y,dest_arr = [];
        x = current_item.x;
        y = current_item.y;

        var four_directions = [
            [[y - 1, x - 1],[y - 2,x - 2]],
            [[y + 1, x - 1],[y + 2,x - 2]],
            [[y - 1, x + 1],[y - 2,x + 2]],
            [[y + 1, x + 1],[y + 2,x + 2]],
        ];
        for (var i in four_directions) {
            var temp_point_arr = four_directions[i][0];
            var temp_real_arr = four_directions[i][1];
            if (
                this.isPawnEmpty(temp_point_arr[0],temp_point_arr[1]) &&
                this.isPawnNotExistsOrIsRival(temp_real_arr[0],temp_real_arr[1],current_item )
            ) {
                dest_arr.push(all_matrix[temp_real_arr[0]][temp_real_arr[1]]);
            }
        }
        //再过滤出只有本方的点
        dest_arr = dest_arr.filter((v) => {
            if (current_item.is_rival) {
                return v.y<=4;
            }else{
                return v.y>=5
            }
        })

        return dest_arr;
    },

    calcS(current_item,all_matrix) {
        var x,y,dest_arr = [];
        x = current_item.x;
        y = current_item.y;
        var inAreaCondition = (y,x) => {
            if (current_item.is_rival) {
                return y<=2 && x>=3 && x <=5;
            }else{
                return y>=7 && x>=3 && x <=5;
            }
        };
        var four_directions = [
            [y-1,x-1],
            [y+1,x-1],
            [y+1,x+1],
            [y-1,x+1],
        ]
        for (var i in four_directions) {
            var temp_y = four_directions[i][0];
            var temp_x = four_directions[i][1];
            if (this.isPawnNotExistsOrIsRival(temp_y,temp_x,current_item) && inAreaCondition(temp_y,temp_x)) {
                dest_arr.push(all_matrix[temp_y][temp_x]);
            }
        }
        return dest_arr;
    },

    calcJ(current_item,all_matrix) {
        var x,y,dest_arr = [];
        x = current_item.x;
        y = current_item.y;
        var inAreaCondition = (y,x) => {
            if (current_item.is_rival) {
                return y<=2 && x>=3 && x <=5;
            }else{
                return y>=7 && x>=3 && x <=5;
            }
        };
        //再判断对方的将是否在目标线上
        var rival_j_obj
        all_matrix.forEach((line) => {
            line.forEach((v) => {
                if(v.code === 'j' && v.is_rival !== current_item.is_rival){
                    rival_j_obj = v;
                    return false;
                }
            })
        })
        var isFaceRivalJ = (y,x) => {
            var is_facing = false;
            if (x === rival_j_obj.x) {
                //    再判断此方向有没有其他子
                var min_y = Math.min(y, rival_j_obj.y);
                var start_y = Math.max(y, rival_j_obj.y) -1;
                var has_block = false;
                while (start_y > min_y) {
                    if (all_matrix[start_y][x].status) {
                        has_block = true;
                        break;
                    }
                    start_y--;
                }
                if (!has_block) {
                    //    没有挡，则
                    is_facing = true;
                }
            }
            return is_facing
        }
        var four_directions = [
            [y-1,x],
            [y+1,x],
            [y,x+1],
            [y,x-1],
        ]
        for (var i in four_directions) {
            var temp_y = four_directions[i][0];
            var temp_x = four_directions[i][1];
            if (this.isPawnNotExistsOrIsRival(temp_y,temp_x,current_item)
                && inAreaCondition(temp_y,temp_x)
                && !isFaceRivalJ(temp_y,temp_x)
            ) {
                dest_arr.push(all_matrix[temp_y][temp_x]);
            }
        }
        return dest_arr;
    },

    calcP(current_item,all_matrix) {
        var x,y,lx,rx,ly,ry,dest_arr = [],block = {num:0},res_flag;
        lx = rx = x = current_item.x;
        ly = ry = y = current_item.y;

        var innerLogic = (y,x) => {
            if(!this.isPawnInPanel(y,x)){
                return true;
            }
            if (!block.num) {
                if ( this.isPawnEmpty(y,x)  ) {
                    dest_arr.push(all_matrix[y][x]);
                }else {
                    //    有值
                    block.num++;
                }
            }else{
                //已经有阻挡，找第一个是不是对手，对手则加入
                if (!this.isPawnEmpty(y, x)) {
                    if (all_matrix[y][x].is_rival !== current_item.is_rival) {
                        dest_arr.push(all_matrix[y][x]);
                    }
                    return true;
                }
            }
        }
        while (lx >= 1) {
            lx--;
            res_flag = innerLogic(y,lx)
            if (res_flag === true) {
                break;
            }
        }
        block.num = 0
        while (rx <= 7) {
            rx++;
            res_flag = innerLogic(y,rx)
            if (res_flag === true) {
                break;
            }
        }
        block.num = 0
        while (ly >= 1) {
            ly--;
            res_flag = innerLogic(ly,x)
            if (res_flag === true) {
                break;
            }
        }
        block.num = 0
        while (ry <= 8) {
            ry++;
            res_flag = innerLogic(ry,x)
            if (res_flag === true) {
                break;
            }
        }
        return dest_arr;
    },
    calcZ(current_item,all_matrix) {
        var x,y,dest_arr = [];
        x = current_item.x;
        y = current_item.y;
        var temp_arr = [];
        if (current_item.is_rival) {
            temp_arr.push([x, y + 1])
            if (current_item.y > 4) {
                temp_arr.push([x - 1, y])
                temp_arr.push([x + 1, y])
            }
        }else{
            temp_arr.push([x, y - 1])
            if (current_item.y <= 4) {
                temp_arr.push([x - 1, y])
                temp_arr.push([x + 1, y])
            }
        }
        for (var i in temp_arr) {
            var v = temp_arr[i];
            if(this.isPawnNotExistsOrIsRival(v[1], v[0],current_item)){
                dest_arr.push(all_matrix[v[1]][ v[0]]);
            }
        }
        return dest_arr;
    },

    isPawnInPanel(y,x) {
        return !(y < 0 || y > 9 || x < 0 || x > 8);
    },
    isPawnEmpty(y,x) {
        if (!this.isPawnInPanel(y, x)) {
            return false;
        }
        return !this.all_matrix[y][x].status
    },
    isPawnNotExistsOrIsRival(y,x,current) {
        if (!this.isPawnInPanel(y, x)) {
            return false;
        }
        return !this.all_matrix[y][x].status
            || this.all_matrix[y][x].is_rival !== current.is_rival
    },
}

export default calc_pawn_targets;
