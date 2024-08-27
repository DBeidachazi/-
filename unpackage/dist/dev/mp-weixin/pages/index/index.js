"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      title: "Hello"
    };
  },
  onLoad() {
  },
  methods: {}
};
if (!Array) {
  const _easycom_pinazi_game_chinese_chess2 = common_vendor.resolveComponent("pinazi-game-chinese-chess");
  _easycom_pinazi_game_chinese_chess2();
}
const _easycom_pinazi_game_chinese_chess = () => "../../uni_modules/pinazi-game-chinese-chess/components/pinazi-game-chinese-chess/pinazi-game-chinese-chess.js";
if (!Math) {
  _easycom_pinazi_game_chinese_chess();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
