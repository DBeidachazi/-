if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  var calc_pawn_targets = {
    all_matrix: [],
    getPointsArr(current_item, all_matrix) {
      this.all_matrix = all_matrix;
      var dest = [];
      switch (current_item.code) {
        case "c":
          dest = this.calcC(current_item, all_matrix);
          break;
        case "m":
          dest = this.calcM(current_item, all_matrix);
          break;
        case "x":
          dest = this.calcX(current_item, all_matrix);
          break;
        case "s":
          dest = this.calcS(current_item, all_matrix);
          break;
        case "j":
          dest = this.calcJ(current_item, all_matrix);
          break;
        case "p":
          dest = this.calcP(current_item, all_matrix);
          break;
        case "z":
          dest = this.calcZ(current_item, all_matrix);
          break;
      }
      return dest;
    },
    calcC(current_item, all_matrix) {
      var x, y, lx, rx, ly, ry, dest_arr = [], res_flag = false;
      lx = rx = x = current_item.x;
      ly = ry = y = current_item.y;
      var innerLogic = (y2, x2) => {
        if (
          //不存在这个点或者这个点是对手的
          this.isPawnNotExistsOrIsRival(y2, x2, current_item)
        ) {
          dest_arr.push(all_matrix[y2][x2]);
          if (all_matrix[y2][x2].status) {
            return true;
          }
        } else {
          return true;
        }
      };
      while (lx >= 1) {
        lx--;
        res_flag = innerLogic(y, lx);
        if (res_flag === true) {
          break;
        }
      }
      while (rx <= 7) {
        rx++;
        res_flag = innerLogic(y, rx);
        if (res_flag === true) {
          break;
        }
      }
      while (ly >= 1) {
        ly--;
        res_flag = innerLogic(ly, x);
        if (res_flag === true) {
          break;
        }
      }
      while (ry <= 8) {
        ry++;
        res_flag = innerLogic(ry, x);
        if (res_flag === true) {
          break;
        }
      }
      return dest_arr;
    },
    calcM(current_item, all_matrix) {
      var x, y, dest_arr = [];
      x = current_item.x;
      y = current_item.y;
      if (x >= 2) {
        if (!all_matrix[y][x - 1].status) {
          if (this.isPawnNotExistsOrIsRival(y - 1, x - 2, current_item)) {
            dest_arr.push(all_matrix[y - 1][x - 2]);
          }
          if (this.isPawnNotExistsOrIsRival(y + 1, x - 2, current_item)) {
            dest_arr.push(all_matrix[y + 1][x - 2]);
          }
        }
      }
      if (x <= 6) {
        if (!all_matrix[y][x + 1].status) {
          if (this.isPawnNotExistsOrIsRival(y - 1, x + 2, current_item)) {
            dest_arr.push(all_matrix[y - 1][x + 2]);
          }
          if (this.isPawnNotExistsOrIsRival(y + 1, x + 2, current_item)) {
            dest_arr.push(all_matrix[y + 1][x + 2]);
          }
        }
      }
      if (y >= 2) {
        if (!all_matrix[y - 1][x].status) {
          if (this.isPawnNotExistsOrIsRival(y - 2, x - 1, current_item)) {
            dest_arr.push(all_matrix[y - 2][x - 1]);
          }
          if (this.isPawnNotExistsOrIsRival(y - 2, x + 1, current_item)) {
            dest_arr.push(all_matrix[y - 2][x + 1]);
          }
        }
      }
      if (y <= 7) {
        if (!all_matrix[y + 1][x].status) {
          if (this.isPawnNotExistsOrIsRival(y + 2, x - 1, current_item)) {
            dest_arr.push(all_matrix[y + 2][x - 1]);
          }
          if (this.isPawnNotExistsOrIsRival(y + 2, x + 1, current_item)) {
            dest_arr.push(all_matrix[y + 2][x + 1]);
          }
        }
      }
      return dest_arr;
    },
    calcX(current_item, all_matrix) {
      var x, y, dest_arr = [];
      x = current_item.x;
      y = current_item.y;
      var four_directions = [
        [[y - 1, x - 1], [y - 2, x - 2]],
        [[y + 1, x - 1], [y + 2, x - 2]],
        [[y - 1, x + 1], [y - 2, x + 2]],
        [[y + 1, x + 1], [y + 2, x + 2]]
      ];
      for (var i in four_directions) {
        var temp_point_arr = four_directions[i][0];
        var temp_real_arr = four_directions[i][1];
        if (this.isPawnEmpty(temp_point_arr[0], temp_point_arr[1]) && this.isPawnNotExistsOrIsRival(temp_real_arr[0], temp_real_arr[1], current_item)) {
          dest_arr.push(all_matrix[temp_real_arr[0]][temp_real_arr[1]]);
        }
      }
      dest_arr = dest_arr.filter((v) => {
        if (current_item.is_rival) {
          return v.y <= 4;
        } else {
          return v.y >= 5;
        }
      });
      return dest_arr;
    },
    calcS(current_item, all_matrix) {
      var x, y, dest_arr = [];
      x = current_item.x;
      y = current_item.y;
      var inAreaCondition = (y2, x2) => {
        if (current_item.is_rival) {
          return y2 <= 2 && x2 >= 3 && x2 <= 5;
        } else {
          return y2 >= 7 && x2 >= 3 && x2 <= 5;
        }
      };
      var four_directions = [
        [y - 1, x - 1],
        [y + 1, x - 1],
        [y + 1, x + 1],
        [y - 1, x + 1]
      ];
      for (var i in four_directions) {
        var temp_y = four_directions[i][0];
        var temp_x = four_directions[i][1];
        if (this.isPawnNotExistsOrIsRival(temp_y, temp_x, current_item) && inAreaCondition(temp_y, temp_x)) {
          dest_arr.push(all_matrix[temp_y][temp_x]);
        }
      }
      return dest_arr;
    },
    calcJ(current_item, all_matrix) {
      var x, y, dest_arr = [];
      x = current_item.x;
      y = current_item.y;
      var inAreaCondition = (y2, x2) => {
        if (current_item.is_rival) {
          return y2 <= 2 && x2 >= 3 && x2 <= 5;
        } else {
          return y2 >= 7 && x2 >= 3 && x2 <= 5;
        }
      };
      var rival_j_obj;
      all_matrix.forEach((line) => {
        line.forEach((v) => {
          if (v.code === "j" && v.is_rival !== current_item.is_rival) {
            rival_j_obj = v;
            return false;
          }
        });
      });
      var isFaceRivalJ = (y2, x2) => {
        var is_facing = false;
        if (x2 === rival_j_obj.x) {
          var min_y = Math.min(y2, rival_j_obj.y);
          var start_y = Math.max(y2, rival_j_obj.y) - 1;
          var has_block = false;
          while (start_y > min_y) {
            if (all_matrix[start_y][x2].status) {
              has_block = true;
              break;
            }
            start_y--;
          }
          if (!has_block) {
            is_facing = true;
          }
        }
        return is_facing;
      };
      var four_directions = [
        [y - 1, x],
        [y + 1, x],
        [y, x + 1],
        [y, x - 1]
      ];
      for (var i in four_directions) {
        var temp_y = four_directions[i][0];
        var temp_x = four_directions[i][1];
        if (this.isPawnNotExistsOrIsRival(temp_y, temp_x, current_item) && inAreaCondition(temp_y, temp_x) && !isFaceRivalJ(temp_y, temp_x)) {
          dest_arr.push(all_matrix[temp_y][temp_x]);
        }
      }
      return dest_arr;
    },
    calcP(current_item, all_matrix) {
      var x, y, lx, rx, ly, ry, dest_arr = [], block = { num: 0 }, res_flag;
      lx = rx = x = current_item.x;
      ly = ry = y = current_item.y;
      var innerLogic = (y2, x2) => {
        if (!this.isPawnInPanel(y2, x2)) {
          return true;
        }
        if (!block.num) {
          if (this.isPawnEmpty(y2, x2)) {
            dest_arr.push(all_matrix[y2][x2]);
          } else {
            block.num++;
          }
        } else {
          if (!this.isPawnEmpty(y2, x2)) {
            if (all_matrix[y2][x2].is_rival !== current_item.is_rival) {
              dest_arr.push(all_matrix[y2][x2]);
            }
            return true;
          }
        }
      };
      while (lx >= 1) {
        lx--;
        res_flag = innerLogic(y, lx);
        if (res_flag === true) {
          break;
        }
      }
      block.num = 0;
      while (rx <= 7) {
        rx++;
        res_flag = innerLogic(y, rx);
        if (res_flag === true) {
          break;
        }
      }
      block.num = 0;
      while (ly >= 1) {
        ly--;
        res_flag = innerLogic(ly, x);
        if (res_flag === true) {
          break;
        }
      }
      block.num = 0;
      while (ry <= 8) {
        ry++;
        res_flag = innerLogic(ry, x);
        if (res_flag === true) {
          break;
        }
      }
      return dest_arr;
    },
    calcZ(current_item, all_matrix) {
      var x, y, dest_arr = [];
      x = current_item.x;
      y = current_item.y;
      var temp_arr = [];
      if (current_item.is_rival) {
        temp_arr.push([x, y + 1]);
        if (current_item.y > 4) {
          temp_arr.push([x - 1, y]);
          temp_arr.push([x + 1, y]);
        }
      } else {
        temp_arr.push([x, y - 1]);
        if (current_item.y <= 4) {
          temp_arr.push([x - 1, y]);
          temp_arr.push([x + 1, y]);
        }
      }
      for (var i in temp_arr) {
        var v = temp_arr[i];
        if (this.isPawnNotExistsOrIsRival(v[1], v[0], current_item)) {
          dest_arr.push(all_matrix[v[1]][v[0]]);
        }
      }
      return dest_arr;
    },
    isPawnInPanel(y, x) {
      return !(y < 0 || y > 9 || x < 0 || x > 8);
    },
    isPawnEmpty(y, x) {
      if (!this.isPawnInPanel(y, x)) {
        return false;
      }
      return !this.all_matrix[y][x].status;
    },
    isPawnNotExistsOrIsRival(y, x, current) {
      if (!this.isPawnInPanel(y, x)) {
        return false;
      }
      return !this.all_matrix[y][x].status || this.all_matrix[y][x].is_rival !== current.is_rival;
    }
  };
  var evaluate_panel_weight = {
    all_matrix: [],
    code_weight_map: {},
    //棋子权重映射
    evaluate(all_matrix) {
      this.all_matrix = all_matrix;
      var dest = 0;
      for (var i in all_matrix) {
        for (var j in all_matrix[i]) {
          var temp_pawn = all_matrix[i][j];
          switch (temp_pawn.code) {
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
    __formatVal(current_item, val) {
      return current_item.is_rival ? -1 * val : val;
    },
    __formatMap(code, arr) {
      this.code_weight_map[code] = {};
      var temp_arr = [];
      for (var i in arr) {
        var line_arr = arr[i].split(/\s+/);
        line_arr = line_arr.map((v) => {
          return parseInt(v);
        });
        line_arr.push(line_arr[3]);
        line_arr.push(line_arr[2]);
        line_arr.push(line_arr[1]);
        line_arr.push(line_arr[0]);
        temp_arr.push(line_arr);
      }
      this.code_weight_map[code]["self"] = JSON.parse(JSON.stringify(temp_arr));
      this.code_weight_map[code]["rival"] = temp_arr.reverse();
    },
    __getWeight(current_item, code) {
      var key = "self";
      if (current_item.is_rival) {
        key = "rival";
      }
      return this.code_weight_map[code][key][current_item.y][current_item.x];
    },
    // todo 应该根据棋盘不同的点有不同的值的，现在只简单这样了
    evaluateC(current_item) {
      var extra = 0;
      if (current_item.x > 0 && current_item.x < 8 && current_item.y >= 2 && current_item.y <= 7) {
        extra = 20;
      }
      if (current_item.x > 0 && current_item.x < 8 && current_item.y >= 4 && current_item.y <= 5) {
        extra = 26;
      }
      return this.__formatVal(current_item, 300 + extra);
    },
    evaluateM(current_item) {
      var extra = 0;
      if (current_item.x > 0 && current_item.x < 8 && current_item.y >= 2 && current_item.y <= 7) {
        extra = 10;
      }
      if (current_item.x > 1 && current_item.x < 7 && current_item.y >= 3 && current_item.y <= 5) {
        extra = 20;
      }
      return this.__formatVal(current_item, 130 + extra);
    },
    evaluateX(current_item) {
      var extra = 0;
      if (current_item.x === 4 && (current_item.y === 2 || current_item.y === 7)) {
        extra = 15;
      }
      return this.__formatVal(current_item, 20 + extra);
    },
    evaluateS(current_item) {
      var extra = 0;
      if (current_item.x === 4 && (current_item.y === 1 || current_item.y === 8)) {
        extra = 5;
      }
      return this.__formatVal(current_item, 20 + extra);
    },
    evaluateJ(current_item) {
      var extra = 0;
      if (current_item.x === 4 && (current_item.y === 0 || current_item.y === 9)) {
        extra = 10;
      }
      if (current_item.x === 4 && (current_item.y === 1 || current_item.y === 8)) {
        extra = 5;
      }
      return this.__formatVal(current_item, 1e4 + extra);
    },
    evaluateP(current_item) {
      var extra = 0;
      if (current_item.x === 4 && (current_item.y === 2 || current_item.y === 7)) {
        extra = 25;
      }
      return this.__formatVal(current_item, 140 + extra);
    },
    evaluateZ(current_item) {
      var extra = 0;
      if (current_item.y === 4 || current_item.y === 5) {
        extra = 2;
      }
      return this.__formatVal(current_item, 20 + extra);
    }
  };
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
    "mc1 mm1 mx1 ms1 mj1 ms2 mx2 mm2 mc2"
  ];
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
    "mc1 mm1 mx1 ms1 mj1 ms2 mx2 mm2 mc2"
  ];
  var codePawnTextMap = {
    c: "创",
    m: "孝",
    x: "典",
    s: "绝",
    j: "蚌",
    p: "急",
    z: "对"
  };
  var codePawnTextMap2 = {
    c: "盒",
    m: "批",
    x: "寄",
    s: "乐",
    j: "赢",
    p: "麻",
    z: "退"
  };
  var chinese_chess_logic = {
    panel: {},
    status_const: {
      me: 1,
      rival: 2
    },
    history_steps: [],
    is_own_turn: true,
    //是否该己方下子，
    all_matrix: [],
    //棋盘所有子的矩阵
    all_win_arr: [],
    //存储所有赢法数组 ['x-y','x1-y1'] //x,y索引做成字符串
    total_win_count: 0,
    //所有赢法总数
    my_win_arr: [],
    //我自己所有能赢的数组
    rival_win_arr: [],
    //对手所有能赢的数组
    is_game_over: false,
    //是否游戏结束
    own_weight: [],
    //自己的权重，计算 ai 时用到
    rival_weight: [],
    //对手权重 ，计算 ai 时用到
    renderView: (x, y, is_rival) => {
    },
    //放下子的UI逻辑，由外部传入
    mySucceed: (completed_arr) => {
    },
    //我成功的逻辑，由外部传入
    myFailed: (completed_arr) => {
    },
    //我失败的逻辑，由外部传入
    init(params, is_ai_first) {
      this.is_game_over = false;
      this.is_own_turn = true;
      this.total_win_count = 0;
      this.all_win_arr = [];
      Object.assign(this, params);
      this.initPanelWithPawns();
      return this;
    },
    //初始化棋盘
    initPanelWithPawns() {
      var dest_data = [];
      for (var line_index in init_panel_arr) {
        var line = init_panel_arr[line_index];
        line = line.trim();
        var temp_line = [];
        var pawn_code_arr = line.split(/\s+/);
        for (var pawn_index in pawn_code_arr) {
          temp_line.push(this.getInitSinglePawnData(pawn_code_arr[pawn_index], line_index, pawn_index));
        }
        dest_data.push(temp_line);
      }
      this.all_matrix = dest_data;
      return dest_data;
    },
    defaultItem(y, x) {
      return {
        x,
        y,
        is_target_blink: false,
        //是否是可移动的点，默认不是
        is_selected: false,
        //是否选中，默认不是
        status: 0
      };
    },
    getInitSinglePawnData(code_str, line_index, pawn_index) {
      var dest_obj = this.defaultItem(parseInt(line_index), parseInt(pawn_index));
      if (code_str.length !== 3) {
        formatAppLog("error", "at uni_modules/pinazi-game-chinese-chess/components/pinazi-game-chinese-chess/chinese_chess_logic.js:116", code_str + "格式不对");
        return false;
      }
      if (code_str !== "000") {
        var is_rival = code_str[0] === "r";
        var num = code_str[2];
        var code = code_str[1];
        dest_obj = Object.assign(dest_obj, {
          status: is_rival ? this.status_const.rival : this.status_const.me,
          text: is_rival ? codePawnTextMap2[code] : codePawnTextMap[code],
          code,
          num,
          is_rival
        });
      }
      return dest_obj;
    },
    getNewStepMatrix(old_pawn, new_pawn, all_matrix) {
      var new_all_matrix = JSON.parse(JSON.stringify(all_matrix));
      new_all_matrix[old_pawn.y][old_pawn.x] = this.defaultItem(old_pawn.y, old_pawn.x);
      var new_item = Object.assign({}, old_pawn, {
        x: new_pawn.x,
        y: new_pawn.y
      });
      new_all_matrix[new_pawn.y][new_pawn.x] = new_item;
      return new_all_matrix;
    },
    onClickEvent(x, y) {
      formatAppLog("log", "at uni_modules/pinazi-game-chinese-chess/components/pinazi-game-chinese-chess/chinese_chess_logic.js:148", x, y);
    },
    calcAllTargetPoints(current_item, all_matrix) {
      return calc_pawn_targets.getPointsArr(current_item, all_matrix);
    },
    calcPanelVals(all_matrix) {
      return evaluate_panel_weight.evaluate(all_matrix);
    },
    getAllOneSideSteps(all_matrix, is_rival) {
      var all_one_side_pawns = this.getOneSidePawns(all_matrix, is_rival);
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
      return dest_steps;
    },
    calcAiStep(all_matrix) {
      formatAppLog("log", "at uni_modules/pinazi-game-chinese-chess/components/pinazi-game-chinese-chess/chinese_chess_logic.js:176", "calc-");
      var available_steps = this.getAllOneSideSteps(all_matrix, true);
      var now_val = 1e5;
      var dest_step = null;
      formatAppLog("log", "at uni_modules/pinazi-game-chinese-chess/components/pinazi-game-chinese-chess/chinese_chess_logic.js:182", available_steps);
      for (var k in available_steps) {
        var single_step = available_steps[k];
        var new_matrix = this.getNewStepMatrix(single_step.from, single_step.to, all_matrix);
        var available_sub_steps = this.getAllOneSideSteps(new_matrix, false);
        var temp_step_val = -1e4;
        for (var m in available_sub_steps) {
          var single_sub_step = available_sub_steps[m];
          var new_sub_matrix = this.getNewStepMatrix(single_sub_step.from, single_sub_step.to, new_matrix);
          var new_sub_val = this.calcPanelVals(new_sub_matrix);
          if (new_sub_val > temp_step_val) {
            temp_step_val = new_sub_val;
          }
        }
        if (temp_step_val < now_val) {
          formatAppLog("log", "at uni_modules/pinazi-game-chinese-chess/components/pinazi-game-chinese-chess/chinese_chess_logic.js:198", temp_step_val);
          now_val = temp_step_val;
          dest_step = single_step;
        }
      }
      formatAppLog("log", "at uni_modules/pinazi-game-chinese-chess/components/pinazi-game-chinese-chess/chinese_chess_logic.js:203", dest_step);
      return dest_step;
    },
    recursiveCalcAiSteps(all_matrix, is_rival, depth) {
      if (depth === 0) {
        return {
          val: this.calcPanelVals(all_matrix)
        };
      }
    },
    //
    calcAiStepBf(all_matrix) {
      var all_rival_pawns = this.getOneSidePawns(all_matrix, true);
      all_rival_pawns.sort(() => {
        return Math.random() >= 0.5 ? -1 : 1;
      });
      for (var j in all_rival_pawns) {
        var from_pawn = all_rival_pawns[j];
        var all_target_points = this.calcAllTargetPoints(from_pawn, all_matrix);
        if (all_target_points.length) {
          all_target_points.sort(() => {
            return Math.random() >= 0.5 ? -1 : 1;
          });
          return {
            from: from_pawn,
            to: all_target_points[0]
          };
        }
      }
      return null;
    },
    getOneSidePawns(all_matrix, is_rival) {
      var dest_arr = [];
      for (var i in all_matrix) {
        for (var j in all_matrix[i]) {
          if (all_matrix[i][j].status && all_matrix[i][j].is_rival === is_rival) {
            dest_arr.push(all_matrix[i][j]);
          }
        }
      }
      return dest_arr;
    },
    getOneSideJiang(all_matrix, is_rival) {
      var all_pawns = this.getOneSidePawns(all_matrix, is_rival);
      for (var i in all_pawns) {
        if (all_pawns[i].code === "j") {
          return all_pawns[i];
        }
      }
      return null;
    }
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$2 = {
    name: "pinazi-game-chinese-chess",
    data() {
      return {
        all_data: [[]],
        panel: {
          x: 9,
          y: 10
        },
        status_const: {
          me: 1,
          rival: 2
        },
        ai_first: true,
        // ai先下
        cell_length: 40,
        //单元格大小
        pawn_length: 34,
        //棋子大小
        current_clicked_item: null,
        //当前已经选中的棋子
        current_target_arr: null
        //当前 子可操作的点
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.logic_obj = chinese_chess_logic.init(
          {
            status_const: this.status_const
          },
          this.ai_first
        );
        this.initAllData();
      },
      putPawn(x, y, is_rival) {
        is_rival ? this.status_const.rival : this.status_const.me;
      },
      initAllData() {
        this.all_data = [];
        for (var j in this.logic_obj.all_matrix) {
          var temp_line = [];
          for (var i in this.logic_obj.all_matrix[j]) {
            temp_line.push(this.logic_obj.all_matrix[j][i]);
          }
          this.all_data.push(temp_line);
        }
      },
      panelCenterStyle() {
        var dest_style = {
          lineHeight: this.cell_length + "px",
          height: this.cell_length + "px",
          fontSize: this.cell_length * 0.6 + "px"
        };
        return dest_style;
      },
      customSingleCellStyle(cell_index, line) {
        var dest_style = {
          width: this.cell_length + "px",
          height: this.cell_length + "px"
        };
        return dest_style;
      },
      customSingleCellClass(cell_index, line) {
        var dest_class = "";
        if (line === 7 && cell_index === 3 || line === 0 && cell_index === 3) {
          dest_class = "shi_bias";
        }
        return dest_class;
      },
      pawnClass(pawn_item) {
        var dest = "none";
        switch (pawn_item.status) {
          case 2:
            dest = "red";
            break;
          case 1:
            dest = "black";
            break;
        }
        if (pawn_item.is_selected) {
          dest = dest + " selected";
        }
        if (pawn_item.is_target_blink) {
          dest = dest + " target_blink";
        }
        return dest;
      },
      pawnStyle(pawn_item) {
        var dest = {
          fontSize: this.pawn_length * 0.6 + "px",
          fontWeight: "bold",
          width: this.pawn_length + "px",
          height: this.pawn_length + "px",
          left: this.cell_length * pawn_item.x - this.pawn_length / 2 + "px",
          top: this.cell_length * pawn_item.y - this.pawn_length / 2 + "px"
        };
        return dest;
      },
      getLengthIndex(offset_length) {
        var index = 0;
        if (offset_length > 0) {
          index = parseInt(offset_length / this.cell_length);
          var extra_length = offset_length % this.cell_length;
          if (extra_length > this.cell_length / 2) {
            index = index + 1;
          }
        }
        return index;
      },
      restart() {
        this.init();
      },
      failed() {
        uni.showModal({
          content: "输了",
          confirmText: "再来一局",
          success: (res) => {
            if (res.confirm) {
              this.restart();
            } else if (res.cancel) {
              this.restart();
            }
          }
        });
      },
      succeed() {
        uni.showModal({
          content: "赢了",
          confirmText: "再来一局",
          success: (res) => {
            if (res.confirm) {
              this.restart();
            } else if (res.cancel) {
              this.restart();
            }
          }
        });
      },
      clickEvent(e) {
        if (!this.logic_obj.is_own_turn) {
          formatAppLog("log", "at uni_modules/pinazi-game-chinese-chess/components/pinazi-game-chinese-chess/pinazi-game-chinese-chess.vue:199", "不该我们移子");
          return false;
        }
        if (this.logic_obj.is_game_over) {
          formatAppLog("log", "at uni_modules/pinazi-game-chinese-chess/components/pinazi-game-chinese-chess/pinazi-game-chinese-chess.vue:203", "游戏已经结束");
          return false;
        }
        var offset_x = e.detail.x - e.currentTarget.offsetLeft;
        var offset_y = e.detail.y - e.currentTarget.offsetTop;
        var x_index = this.getLengthIndex(offset_x);
        var y_index = this.getLengthIndex(offset_y);
        var now_item = this.all_data[y_index][x_index];
        if (!this.current_clicked_item) {
          if (!now_item.status || now_item.is_rival) {
            formatAppLog("log", "at uni_modules/pinazi-game-chinese-chess/components/pinazi-game-chinese-chess/pinazi-game-chinese-chess.vue:217", "不该点");
            return false;
          }
          this.itemSelected(now_item);
        } else {
          if (now_item.status && !now_item.is_rival) {
            this.clearSelectedStatus();
            this.itemSelected(now_item);
          } else {
            var is_in_targets = !!this.current_target_arr.filter((v) => {
              return v.x === now_item.x && v.y === now_item.y;
            }).length;
            if (is_in_targets) {
              this.logic_obj.history_steps.push({
                from: this.current_clicked_item,
                to: now_item,
                is_eating: now_item.status
              });
              this.clearSelectedStatus();
              this.moveStep(this.current_clicked_item, now_item);
              if (!this.logic_obj.getOneSideJiang(this.all_data, true)) {
                this.logic_obj.is_game_over = true;
                this.succeed();
                return false;
              }
              this.current_clicked_item = null;
              this.current_target_arr = null;
              this.logic_obj.is_own_turn = !this.logic_obj.is_own_turn;
              var res = this.logic_obj.calcAiStep(this.all_data);
              this.moveStep(res.from, res.to);
              this.logic_obj.is_own_turn = !this.logic_obj.is_own_turn;
              if (!this.logic_obj.getOneSideJiang(this.all_data, false)) {
                this.logic_obj.is_game_over = true;
                this.failed();
                return false;
              }
            }
          }
        }
      },
      moveStep(old_pawn, new_pawn) {
        this.$set(this, "all_data", this.logic_obj.getNewStepMatrix(old_pawn, new_pawn, this.all_data));
      },
      clearSelectedStatus() {
        this.$set(this.current_clicked_item, "is_selected", false);
        for (var i in this.current_target_arr) {
          this.$set(this.current_target_arr[i], "is_target_blink", false);
        }
      },
      itemSelected(now_item) {
        this.current_clicked_item = now_item;
        this.$set(now_item, "is_selected", true);
        this.current_target_arr = this.logic_obj.calcAllTargetPoints(this.current_clicked_item, this.all_data);
        for (var i in this.current_target_arr) {
          this.$set(this.current_target_arr[i], "is_target_blink", true);
        }
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("view", {
        class: "pnz_chinese_chess_wrap",
        style: { "padding": "20px 2px" }
      }, [
        vue.createElementVNode("view", {
          class: "",
          style: { "padding": "10px 0 20px 0", "font-size": "30px", "color": "#333" }
        }, " 互联网新时代概念象棋 "),
        vue.createElementVNode("view", {
          class: "pnz_panel_wrap",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.clickEvent && $options.clickEvent(...args))
        }, [
          (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(9, (line, line_index) => {
              return vue.createElementVNode("view", {
                key: line,
                class: "single_line"
              }, [
                vue.createCommentVNode("                    {{line}}"),
                line_index === 4 ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: "panel_center",
                    style: vue.normalizeStyle([$options.panelCenterStyle()])
                  },
                  [
                    vue.createElementVNode("span", null, "哈基米"),
                    vue.createElementVNode("span", { style: { "transform": "rotate(180deg)" } }, "曼 波")
                  ],
                  4
                  /* STYLE */
                )) : (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 1 },
                  vue.renderList(8, (cell, cell_index) => {
                    return vue.createElementVNode(
                      "view",
                      {
                        key: cell_index,
                        class: vue.normalizeClass(["single_cell", [$options.customSingleCellClass(cell_index, line_index)]]),
                        style: vue.normalizeStyle([$options.customSingleCellStyle(cell_index, line_index)])
                      },
                      null,
                      6
                      /* CLASS, STYLE */
                    );
                  }),
                  64
                  /* STABLE_FRAGMENT */
                ))
              ]);
            }),
            64
            /* STABLE_FRAGMENT */
          )),
          vue.createCommentVNode(" 此处要加上 绝对定位的 棋子 "),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.all_data, (pawn_line_item, pawn_line_index) => {
              return vue.openBlock(), vue.createElementBlock("view", null, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(pawn_line_item, (pawn_item, pawn_index) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        class: vue.normalizeClass(["single_pawn_base", [$options.pawnClass(pawn_item)]]),
                        style: vue.normalizeStyle([$options.pawnStyle(pawn_item)])
                      },
                      [
                        pawn_item.status ? (vue.openBlock(), vue.createElementBlock(
                          "span",
                          {
                            key: 0,
                            class: "pawn_text"
                          },
                          vue.toDisplayString(pawn_item.text),
                          1
                          /* TEXT */
                        )) : vue.createCommentVNode("v-if", true)
                      ],
                      6
                      /* CLASS, STYLE */
                    );
                  }),
                  256
                  /* UNKEYED_FRAGMENT */
                ))
              ]);
            }),
            256
            /* UNKEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-1f92a923"], ["__file", "C:/Users/26950/uni-app/中国象棋示例/uni_modules/pinazi-game-chinese-chess/components/pinazi-game-chinese-chess/pinazi-game-chinese-chess.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        title: "Hello"
      };
    },
    onLoad() {
    },
    methods: {}
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_pinazi_game_chinese_chess = resolveEasycom(vue.resolveDynamicComponent("pinazi-game-chinese-chess"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createVNode(_component_pinazi_game_chinese_chess)
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/26950/uni-app/中国象棋示例/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/26950/uni-app/中国象棋示例/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
