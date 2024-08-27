"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_pinaziGameChineseChess_components_pinaziGameChineseChess_chinese_chess_logic = require("./chinese_chess_logic.js");
const _sfc_main = {
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
      this.logic_obj = uni_modules_pinaziGameChineseChess_components_pinaziGameChineseChess_chinese_chess_logic.chinese_chess_logic.init(
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
      common_vendor.index.showModal({
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
      common_vendor.index.showModal({
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
        console.log("不该我们移子");
        return false;
      }
      if (this.logic_obj.is_game_over) {
        console.log("游戏已经结束");
        return false;
      }
      var offset_x = e.detail.x - e.currentTarget.offsetLeft;
      var offset_y = e.detail.y - e.currentTarget.offsetTop;
      var x_index = this.getLengthIndex(offset_x);
      var y_index = this.getLengthIndex(offset_y);
      var now_item = this.all_data[y_index][x_index];
      if (!this.current_clicked_item) {
        if (!now_item.status || now_item.is_rival) {
          console.log("不该点");
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(9, (line, line_index, i0) => {
      return common_vendor.e({
        a: line_index === 4
      }, line_index === 4 ? {
        b: common_vendor.s($options.panelCenterStyle())
      } : {
        c: common_vendor.f(8, (cell, cell_index, i1) => {
          return {
            a: cell_index,
            b: common_vendor.n($options.customSingleCellClass(cell_index, line_index)),
            c: common_vendor.s($options.customSingleCellStyle(cell_index, line_index))
          };
        })
      }, {
        d: line
      });
    }),
    b: common_vendor.f($data.all_data, (pawn_line_item, pawn_line_index, i0) => {
      return {
        a: common_vendor.f(pawn_line_item, (pawn_item, pawn_index, i1) => {
          return common_vendor.e({
            a: pawn_item.status
          }, pawn_item.status ? {
            b: common_vendor.t(pawn_item.text)
          } : {}, {
            c: common_vendor.n($options.pawnClass(pawn_item)),
            d: common_vendor.s($options.pawnStyle(pawn_item))
          });
        })
      };
    }),
    c: common_vendor.o((...args) => $options.clickEvent && $options.clickEvent(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1f92a923"]]);
wx.createComponent(Component);
