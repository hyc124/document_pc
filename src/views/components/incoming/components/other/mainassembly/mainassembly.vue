<template>
  <div class="mainassembly">
    <!-- 修改详情对比展示弹窗 -->
    <a-modal v-model="contrast.onOff" title="修改详情">
      <div class="flex-col mine-contrast-titlebox">
        <div class="contrast-box flex-col">
          <span class="contrast-box-back" style="background: #f56c6c"></span>
          <span style="color: '#F56C6C'">删除</span>
        </div>
        <div class="contrast-box flex-col">
          <span class="contrast-box-back" style="background: #62c232"></span>
          <span style="color: '#62C232'">新增</span>
        </div>
      </div>
      <div class="flex-col mine-contrast-navbox">
        <div class="mine-contrast-navbox-inbox">
          <p class="mine-contrast-navbox-inbox-title">上一版本</p>
          <div class="mine-contrast-navbox-inbox-center">
            <p class="mine-contrast-navbox-inbox-center-title">{{title}}单</p>
            <p class="mine-contrast-navbox-inbox-center-time">
              时间：{{ contrast.info.lastdata.create_time }}
            </p>
            <div class="mine-contrast-navbox-inbox-center-box flex-col">
              <template v-for="item in contrast.info.lastdata.fields">
                <div
                  v-if="formheader.includes(item.e_name)"
                  class="flex-col formheaderbigtext"
                  :key="item.e_name"
                >
                  <div class="left">{{ item.c_name }}</div>
                  <div
                    class="right flex-col flex-col-bd"
                    :class="item.e_name + item.field_id"
                  ></div>
                </div>
              </template>
              <template v-for="(item, index) in contrast.info.lastdata.fields">
                <div
                  v-if="!formheader.includes(item.e_name)"
                  class="flex-col formheadertext leftBoxHeight"
                  :key="item.e_name"
                >
                  <div class="left" :class="index % 2 != 0 ? 'lefttitle' : ''">
                    {{ item.c_name }}
                  </div>
                  <div
                    class="right flex-col flex-col-bd rightBoxHeight"
                    :class="item.e_name + item.field_id"
                  ></div>
                </div>
              </template>
              <div
                v-if="contrast.info.lastdata.fields.length % 2 != 0"
                class="flex-col formheadertextno rightBoxHeight"
              ></div>
            </div>
            <p
              class="mine-contrast-navbox-inbox-bott-box"
              v-if="contrast.info.lastdata.red_template.content"
              v-html="contrast.info.lastdata.red_template.content"
            ></p>
            <p class="mine-contrast-navbox-inbox-bott-titles">
              {{ contrast.info.lastdata.fields[0].value }}
            </p>
            <div class="centertext">
              <template v-for="item in contrast.info.lastdata.signature">
                <div
                  :key="item.id"
                  :style="`width:${
                    item.position.width / 1.26
                  }px;height:auto;position:absolute;top:${
                    item.position.top / 1.26
                  }px;left:${item.position.left / 1.26}px;`"
                >
                  <img
                    style="width: 100%; height: 100%"
                    :src="'data:image/png;base64,' + item.signature_img"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="mine-contrast-navbox-inbox">
          <p class="mine-contrast-navbox-inbox-title">当前版本</p>
          <div class="mine-contrast-navbox-inbox-center">
            <p class="mine-contrast-navbox-inbox-center-title">{{title}}单</p>
            <p class="mine-contrast-navbox-inbox-center-time">
              时间：{{ contrast.info.thisdata.create_time }}
            </p>
            <div class="mine-contrast-navbox-inbox-center-box flex-col">
              <template v-for="item in contrast.info.thisdata.fields">
                <div
                  v-if="formheader.includes(item.e_name)"
                  class="flex-col formheaderbigtext"
                  :key="item.e_name"
                >
                  <div class="left">{{ item.c_name }}</div>
                  <div
                    class="right flex-col flex-col-bd"
                    :class="item.e_name + item.field_id"
                  ></div>
                </div>
              </template>
              <template v-for="(item, index) in contrast.info.thisdata.fields">
                <div
                  v-if="!formheader.includes(item.e_name)"
                  class="flex-col formheadertext"
                  :key="item.e_name"
                >
                  <div
                    class="left leftBoxHeight"
                    :class="index % 2 != 0 ? 'lefttitle' : ''"
                  >
                    {{ item.c_name }}
                  </div>
                  <div
                    class="right flex-col flex-col-bd rightBoxHeight"
                    :class="item.e_name + item.field_id"
                  ></div>
                </div>
              </template>
              <div
                v-if="contrast.info.thisdata.fields.length % 2 != 0"
                class="flex-col formheadertextno rightBoxHeight"
              ></div>
            </div>
            <p
              class="mine-contrast-navbox-inbox-bott-box"
              v-if="contrast.info.thisdata.red_template.content"
              v-html="contrast.info.thisdata.red_template.content"
            ></p>
            <p class="mine-contrast-navbox-inbox-bott-titles">
              {{ contrast.info.thisdata.fields[0].value }}
            </p>
            <div class="centertext">
              <template v-for="item in contrast.info.thisdata.signature">
                <div
                  :key="item.id"
                  :style="`width:${
                    item.position.width / 1.26
                  }px;height:auto;position:absolute;top:${
                    item.position.top / 1.26
                  }px;left:${item.position.left / 1.26}px;`"
                >
                  <img
                    style="width: 100%; height: 100%"
                    :src="'data:image/png;base64,' + item.signature_img"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <div id="show"></div>
  </div>
</template>
<script>
import { initUI } from "@/js/public.js";
export default {
  name: "mainassembly",
  data() {
    return {
      formheader: ["title", "word_no"],
    };
  },
  props: ["contrast"],
  computed: {
    title() {
      let _obj = {
        1: "发文",
        2: "收文",
        3: "签报",
      };
      return _obj[this.$route.query.file_type];
    },
  },
  filters: {
    signatureHeight(height) {
      return height;
    },
    signatureHeight(width) {
      return width;
    },
  },
  mounted() {
    let _this = this;
    let center = this.contrast.info;
    let _array = center.lastdata.fields;
    let _index;
    _array.forEach((item, index) => {
      initUI(
        _this,
        this.DataFiltering(center.lastdata.fields[index].value),
        this.DataFiltering(center.thisdata.fields[index].value),
        "show",
        center.thisdata.fields[index].e_name +
          center.thisdata.fields[index].field_id,
        document,
        index + 2
      );
      if (index == _array.length - 1) {
        initUI(
          _this,
          center.lastdata.content,
          center.thisdata.content,
          "show",
          "centertext",
          document,
          index + 3
        );
      }
    });
    setTimeout(() => {
      this.set_style();
      let _domsright = document.getElementsByClassName("rightBoxHeight");
      for (let i = 0; i < _domsright.length; i += 2) {
        if (_domsright[i + 1] != undefined) {
          if (_domsright[i].clientHeight > _domsright[i + 1].clientHeight) {
            _domsright[i + 1].style.height = `${
              _domsright[i].clientHeight - 1
            }px`;
          } else if (
            _domsright[i].clientHeight < _domsright[i + 1].clientHeight
          ) {
            _domsright[i].style.height = `${
              _domsright[i + 1].clientHeight + 1
            }px`;
          }
        }
      }
    }, 100);
  },
  methods: {
    DataFiltering(info) {
      let _info = "";
      if (typeof info == "string" || typeof info == "number") {
        return `${info}`;
      } else if (info == null) {
        return "未录入";
      } else if (typeof info == "object") {
        info.select.forEach((item) => {
          if (_info == "") {
            _info = item.name;
          } else {
            _info += `,${item.name}`;
          }
        });
        if (_info != "") {
          if (info.text != "") {
            _info += `,${info.text}`;
          }
        } else {
          if (info.text != "") {
            _info = info.text;
          } else {
            _info = "";
          }
        }
        return _info;
      }
    },
    set_style() {
      let dom = Array.from(document.querySelectorAll(".formheadertext"));
      dom.forEach((el) => {
        let dom_height = el.offsetHeight;
        Array.from(el.childNodes).forEach((el2) => {
          el2.style.height = dom_height + "px";
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-modal {
  font-family: FangSong;
  width: 1000px !important;
  .ant-modal-body {
    padding: 10px 30px 20px;
  }
  .mine-contrast-titlebox {
    background: #f7f7f7;
    line-height: 44px;
    .contrast-box {
      margin: 0px 17px 0px 20px;
      .contrast-box-back {
        width: 30px;
        height: 14px;
        border-radius: 2px;
        display: inline-block;
        margin-right: 8px;
      }
    }
  }
  /deep/.ant-modal-footer {
    display: none;
    font-family: FangSong;
  }
  .mine-contrast-navbox {
    font-family: FangSong;
    height: 670px;
    margin-top: 20px;
    align-items: flex-start;
    justify-content: space-between;
    .mine-contrast-navbox-inbox {
      width: 460px;
      height: 618px;
      .mine-contrast-navbox-inbox-title {
        color: #303133;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 14px;
      }
      .mine-contrast-navbox-inbox-center {
        width: 100%;
        height: 620px;
        border: 1px solid #d9d9d9;
        padding: 10px;
        overflow-y: auto;
        .mine-contrast-navbox-inbox-center-title {
          color: #fa5555;
          font-size: 20px;
          margin: 24px 0 10px;
          text-align: center;
          font-weight: 900;
        }
        .mine-contrast-navbox-inbox-center-time {
          font-size: 12px;
          color: #909399;
          text-align: right;
          margin-bottom: 10px;
        }
        .mine-contrast-navbox-inbox-center-box {
          border-bottom: 1px solid #fa5555;
          display: flex;
          flex-wrap: wrap;
          .formheadertext {
            width: 50%;
            position: relative;
          }
          .formheadertextno {
            border-top: 1px solid #fa5555;
            border-right: 1px solid #fa5555;
            width: 50%;
            min-height: 33px;
          }
          .formheaderbigtext {
            width: 100%;
            position: relative;
          }
          .left {
            width: 100px;
            min-height: 32px;
            border-top: 1px solid #fa5555;
            border-left: 1px solid #fa5555;
            text-align: center;
            font-weight: 900;
            position: absolute;
            left: 0;
            height: 100% !important;
            font-size: 16px;
          }
          .right {
            border: 1px solid #fa5555;
            border-bottom: 0px solid #fa5555;
            min-height: 33px;
            padding-left: 10px;
            margin-left: 100px;
            font-size: 16px;
          }
          .lefttitle {
            border-left: 0px solid #fa5555;
          }
        }
        .mine-contrast-navbox-inbox-bott-box {
          line-height: 54px;
          font-size: 20px;
          color: #fa5555;
          text-align: center;
          border-bottom: 2px solid #fa5555;
          font-weight: 900;
          margin: 0px;
        }
        .mine-contrast-navbox-inbox-bott-title {
          font-size: 12px;
          margin: 7px 0px 12px;
          text-align: center;
          color: #303133;
        }
        .mine-contrast-navbox-inbox-bott-titles {
          color: #303133;
          font-size: 18px;
          text-align: center;
          margin-top: 20px;
        }
        .centertext {
          margin-top: 30px;
          font-size: 16px;
          position: relative;
        }
      }
    }
  }
}
#show {
  font-family: FangSong;
  opacity: 0;
  position: absolute;
}
/deep/ .CodeMirror-merge-r-inserted {
  font-family: FangSong;
  background: #fa5555;
  background-image: none !important;
  color: #ffffff;
}
/deep/ .CodeMirror-merge-r-deleted {
  font-family: FangSong;
  background: #62c232;
  color: #ffffff;
  background-image: none !important;
}
/deep/ .CodeMirror-merge-r-chunk-end {
  font-family: FangSong;
  border: none;
}
/deep/.CodeMirror-merge-r-chunk-start {
  font-family: FangSong;
  border: none;
}
/deep/.CodeMirror-merge-r-chunk {
  font-family: FangSong;
  background: none;
}
/deep/pre {
  font-family: FangSong;
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
  word-break: break-all;
  overflow: hidden;
}
/deep/.CodeMirror-code {
  font-family: FangSong;
  position: relative;
  left: -5px;
}
</style>