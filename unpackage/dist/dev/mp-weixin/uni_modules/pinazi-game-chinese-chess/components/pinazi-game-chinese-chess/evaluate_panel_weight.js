"use strict";
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
exports.evaluate_panel_weight = evaluate_panel_weight;
