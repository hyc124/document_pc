<template>
  <!-- 预览公文内容 -->
  <div class="preview preview2">
    <div class="preview-title-box flex-col" v-if="Popup.vis3">
      <span style="display: flex">
        {{ Popup.titleTxt }}单位或人员：
        <span class="preview-box-title">{{
          Popup_usernames(Popup.usernames)
        }}</span>
        ，{{ Popup.titleTxt }}后不可撤回，确认{{ Popup.titleTxt }}？
      </span>
      <div class="flex-col-bd"></div>
      <a-button @click="Popup.onClose">取消</a-button>
      <a-button
        type="primary"
        style="margin-left: 10px"
        @click="Popup.onSendOut"
        >确定</a-button
      >
    </div>
    <div class="content-text" ref="content_text">
      <h2>{{ text }}单</h2>
      <p class="time" v-if="get_time && get_time != ''">时间：{{ get_time }}</p>
      <div
        class="line fir"
        v-for="(item, index) in view_data.fir"
        :key="'fir' + index"
      >
        <div class="head">{{ item.c_name }}：</div>
        <div class="content">{{ item.value }}</div>
      </div>
      <div
        class="line sec"
        v-for="(item, index) in view_data.sec"
        :key="'sec' + index"
      >
        <p class="solidss"></p>
        <div class="item" v-for="item2 in item" :key="item2.e_name">
          <div class="head">{{ item2.c_name }}：</div>
          <div class="content self-adaption">{{ item2.value }}</div>
        </div>
      </div>
    </div>
    <div class="file-text" ref="file_text">
      <div
        class="head"
        v-if="Getredtemplat && Getredtemplat.content != ''"
        v-html="Getredtemplat.content"
      ></div>
      <div class="body-title">{{ view_data.fir[0].value }}</div>
      <div class="body" v-if="datas && datas.content">
        <pre
          v-if="['/draft/quickPost', '/draft/addDraft'].includes($route.path)"
          v-html="datas.content.text"
        ></pre>
        <pre v-else v-html="datas.content"></pre>
        <div class="signature">
          <template v-if="!['/home/incoming'].includes($route.path)">
            <img
              class="zhang"
              v-for="(item, index) in Getsignature"
              :style="set_signature_style(item)"
              :key="index"
              :src="'data:image/png;base64,' + item.img_data"
              alt
            />
          </template>
          <template v-else>
            <img
              class="zhang"
              v-for="(item, index) in Getsignature.use"
              :style="set_signature_style(item)"
              :key="index"
              :src="'data:image/png;base64,' + item.img_data"
              alt
            />
            <img
              class="zhang"
              v-for="(item, index) in Getsignature.other"
              :style="set_signature_style(item)"
              :key="index"
              :src="'data:image/png;base64,' + item.img_data"
              alt
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { HttpUrl } from "@/js/public";
export default {
  // view=>传进来的vuex的值
  // show=>弹窗是否显示了
  props: {
    ViewDocument: {
      default: null,
    },
    datas: {
      default: null,
    },
    Popup: {
      default: () => {
        return {
          vis3: false,
        };
      },
    },
  },
  data() {
    return {
      HttpUrl,
      view_data: {
        fir: [],
        sec: [],
      },
      text: "",
    };
  },
  computed: {
    Popup_usernames() {
      return (v) => {
        if (typeof v == "object") {
          return v.join(",");
        } else {
          return v;
        }
      };
    },
    //套红模板
    Getredtemplat() {
      if (["/home/incoming"].includes(this.$route.path)) {
        return { content: this.datas?.red_templete_content };
      } else if (this.$route.path == "/draft/quickPost") {
        if (this.datas.process.red_template_model == undefined) {
          return {
            content: "",
            id: "",
            name: "",
          };
        } else {
          return this.datas.process.red_template_model;
        }
      } else if (this.$route.path == "/draft/addDraft") {
        if (this.datas.process.red_template_model == undefined) {
          return {
            content: "",
            id: "",
            name: "",
          };
        } else {
          return this.datas.process.red_template_model;
        }
      } else {
        return this.datas?.red_templete_content;
      }
    },

    //签章
    Getsignature() {
      if (["/draft/quickPost", "/draft/addDraft"].includes(this.$route.path)) {
        this.datas.process.signature.map((v) => {
          v.img_data = v.signature_img;
          return v;
        });
        return this.datas.process.signature;
      } else if (["/home/incoming"].includes(this.$route.path)) {
        return {
          other: this.$store.state.other_zhang,
          use: this.$store.state.use_zhang,
        };
      } else {
        this.datas.process.signature.map((v) => {
          v.img_data = v.signature_img;
          return v;
        });
        return this.datas.signature;
      }
    },
    get_now_time() {
      let date = new Date();
      let dateYear = date.getFullYear(); //获取年
      let dateMonth = date.getMonth(); //获取月
      let dateDate = date.getDate(); //获取当日
      return dateYear + "-" + dateMonth + "-" + dateDate;
    },

    get_time() {
      if (["/draft/addDraft"].includes(this.$route.path)) {
        return this.datas.distribute_time;
      } else if (["/home/incoming"].includes(this.$route.path)) {
        return this.$store.state.leftdata.distribute_time;
      } else {
        return this.datas.distribute_time;
      }
    },
  },
  created() {
    this.set_view_document_data();
    this.set_view_style();
  },
  mounted() {
    let _obj = {
      1: "发文",
      2: "收文",
      3: "签报",
      5: "发文",
      6: "收文",
    };
    if (this.datas.type != undefined) {
      this.text = _obj[this.datas.type];
    } else if (this.ViewDocument.type) {
      this.text = _obj[this.ViewDocument.type];
    } else {
      this.text = _obj[this.$route.jquery.type];
    }
    if (this.ViewDocument.condition) {
      let _contentHeight = 1052 - this.$refs.content_text.offsetHeight;
      this.$refs.content_text.style.marginBottom = _contentHeight + "px";
      let _fileHeight = 850 - (this.$refs.file_text.offsetHeight % 1052);
      this.$refs.file_text.style.paddingBottom = _fileHeight + "px";
    }
    let _domsright = document.getElementsByClassName("self-adaption");
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
  },
  methods: {
    set_signature_style(item) {
      return (
        "z-index:" +
        item.zindex +
        "px;top:" +
        // parseInt(item.position.top + 100) +
        parseInt(item.position.top) +
        "px;left:" +
        // parseInt(item.position.left * (750 / 793) - 56) +
        parseInt(item.position.left) +
        "px;width:" +
        item.position.width +
        "px"
      );
    },
    //数据预览
    set_view_document_data() {
      let zanshi_fir = [];
      let zanshi_sec = [];
      let header_data = null;

      if (this.$route.path == "/home/incoming") {
        header_data = JSON.parse(JSON.stringify(this.datas.fields));
      } else if (
        ["/draft/quickPost", "/draft/addDraft"].includes(this.$route.path)
      ) {
        header_data = JSON.parse(JSON.stringify(this.datas.header));
      } else {
        header_data = JSON.parse(JSON.stringify(this.datas.fields));
      }

      if (
        ["/home/incoming", "/draft/addDraft", "/draft/quickPost"].includes(
          this.$route.path
        )
      ) {
        for (let key in header_data) {
          let value = null;
          if (header_data[key].value) {
            if (header_data[key].value.select) {
              let select_data = [];
              let text_data = [];

              if (header_data[key].value.select) {
                header_data[key].value.select.forEach((el) => {
                  select_data.push(el.name);
                });
              }
              if (header_data[key].value.text) {
                if (typeof header_data[key].value.text == "string") {
                  text_data = header_data[key].value.text.split();
                } else {
                  text_data = header_data[key].value.text;
                }
              }
              let all_data = [...new Set([...text_data, ...select_data])];
              value = all_data.join();
            } else if (key == "secret_level") {
              header_data[key].child.forEach((el) => {
                if (el.id == header_data[key].value) {
                  value = el.name;
                }
              });
            } else if (key == "urgent_level") {
              header_data[key].child.forEach((el) => {
                if (el.id == header_data[key].value) {
                  value = el.name;
                }
              });
            } else if (key == "word_no") {
              if (this.$route.path == "/home/incoming") {
                value = header_data[key].value;
              } else {
                value = header_data[key].value.word_no || "";
              }
            } else {
              value = header_data[key].value;
            }
          } else {
            value = "";
          }
          if (["title", "word_no"].includes(key)) {
            zanshi_fir.push({
              c_name: header_data[key].c_name,
              e_name: header_data[key].e_name,
              value,
            });
          } else {
            if (
              zanshi_sec.length > 0 &&
              zanshi_sec[zanshi_sec.length - 1].length < 2
            ) {
              zanshi_sec[zanshi_sec.length - 1].push({
                value,
                c_name: header_data[key].c_name,
                e_name: header_data[key].e_name,
              });
            } else {
              zanshi_sec.push([
                {
                  value,
                  c_name: header_data[key].c_name,
                  e_name: header_data[key].e_name,
                },
              ]);
            }
          }
        }
      } else {
        header_data.forEach((el) => {
          let value = null;
          if (el.value) {
            if (el.value.select) {
              let select_data = [];
              let text_data = [];
              if (el.value.select) {
                el.value.select.forEach((el) => {
                  select_data.push(el.name);
                });
              }
              if (el.value.text) {
                text_data = el.value.text.split();
              }
              let all_data = [...text_data, ...select_data];
              value = all_data.join();
            } else if (el.e_name == "secret_level") {
              this.datas.degree.forEach((els) => {
                if (els.id == el.value) {
                  value = els.name;
                }
              });
            } else if (el.e_name == "urgent_level") {
              this.datas.urgen_level.forEach((els) => {
                if (els.id == el.value) {
                  value = els.name;
                }
              });
            } else {
              value = el.value;
            }
          } else {
            value = "";
          }
          if (["title", "word_no"].includes(el.e_name)) {
            zanshi_fir.push({
              c_name: el.c_name,
              e_name: el.e_name,
              value,
            });
          } else {
            if (
              zanshi_sec.length > 0 &&
              zanshi_sec[zanshi_sec.length - 1].length < 2
            ) {
              zanshi_sec[zanshi_sec.length - 1].push({
                value,
                c_name: el.c_name,
                e_name: el.e_name,
              });
            } else {
              zanshi_sec.push([
                {
                  value,
                  c_name: el.c_name,
                  e_name: el.e_name,
                },
              ]);
            }
          }
        });
      }
      this.view_data = { fir: zanshi_fir, sec: zanshi_sec };
    },
    //设置预览的样式
    set_view_style() {
      this.$nextTick(() => {
        let sec_style = document.querySelectorAll(".sec");
        for (let i = 0; i < sec_style.length; i++) {
          let sec_height = sec_style[i].clientHeight;
          for (let j = 0; j < sec_style[i].childNodes.length; j++) {
            sec_style[i].childNodes[j].setAttribute(
              "style",
              "min-height:" +
                sec_height +
                "px" +
                "min-height:" +
                sec_height +
                "px" +
                "!important"
            );
          }
        }
      });
    },
  },
  watch: {
    // 当显示的时候重新筛选数据
    "ViewDocument.vis2": {
      handler() {
        if (this.ViewDocument.vis2) {
          this.set_view_document_data();
          this.set_view_style();
        }
      },
    },
    "ViewDocument.view_data": {
      handler() {
        this.set_view_document_data();
        this.set_view_style();
      },
      deep: true,
    },
  },
};
</script>


<style lang="less" scoped>
.preview-title-box {
  width: 793px;
  height: 50px;
  position: absolute;
  top: -60px;
  padding: 0 15px;
  display: flex;
  background: #ffffff;
  border-radius: 4px;
  transition: all 0.1s;
  left: 50%;
  transform: translateX(-50%);
  .preview-box-title {
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.preview-title-boxs {
  right: 50.1%;
  width: 793px;
  height: 56px;
  transition: all 0.3s linear;
  padding: 0px 26px 0px 20px;
  opacity: 1;
}
//  预览公文内容
.zhang {
  position: absolute;
}
.preview {
  width: 548px;
  margin: 0 auto;
  padding-top: 132px;
  box-sizing: border-box;
  h2 {
    text-align: center;
    color: #ff0000;
    margin-bottom: 20px;
    font-size: 26px;
    font-family: FangSong;
    font-weight: bold;
  }
  .time {
    text-align: right;
    color: #000000;
    font-size: 12px;
    font-family: SimSun;
    margin-bottom: 16px;
  }
  .content-text {
    .line {
      display: flex;
      align-items: center;
      border-bottom: none;
      flex: 1;
      font-family: FangSong !important;
      color: #000000;
      font-size: 19px;
      &:last-child {
        border-bottom: 1px solid #ff0000;
      }
      .head {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ff0000;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 10px;
        font-weight: bold;
      }
    }

    // 第一种
    .fir {
      line-height: 32px;
      box-sizing: border-box;
      border: 1px solid #fa5555;
      border-bottom: none;

      .head {
        margin-top: -1px;
        color: #ff0000;
        height: 54px !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .content {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        max-width: 440px;
        height: 100%;
        padding-left: 10px;
        min-height: 48px;
        white-space: normal;
        word-break: break-all;
      }
    }
    .sec {
      display: flex;
      border: 1px solid #fa5555;
      border-bottom: none;
      position: relative;
      overflow: hidden;
      .item {
        display: flex;
        height: 100%;
        min-height: 48px;
        width: 50%;
        &:last-child {
          border-left: 1px solid #fa5555;
        }
      }

      .content {
        display: flex;
        align-items: center;
        min-height: 48px;
        max-width: 166px;
        flex-wrap: wrap;
        white-space: normal;
        word-break: break-all;
      }
    }
  }
  /deep/ .file-text {
    position: relative;
    .head {
      text-align: center;
      color: #ff0000;
      margin-top: 88px;
      pre {
        white-space: normal;
      }
    }
    .body-title {
      height: 56px;
      font-size: 29px;
      font-family: SimSun !important;
      font-weight: 400;
      line-height: 42px;
      color: #000000;
      text-align: center;
      margin-top: 36px;
      margin-bottom: 40px;
    }
    .body {
      position: relative;
      font-family: FangSong !important;
      font-weight: 400;
      color: #000000;
      min-height: 605px;
      pre {
        font-size: 19px;
        font-family: FangSong !important;
        white-space: pre-wrap !important; /*css-3*/
        white-space: -moz-pre-wrap !important; /*Mozilla,since1999*/
        white-space: -pre-wrap !important; /*Opera4-6*/
        white-space: -o-pre-wrap !important; /*Opera7*/
        word-wrap: break-word !important; /*InternetExplorer5.5+*/
        * {
          line-height: 1.5;
          font-family: FangSong !important;
          max-width: 548px;
        }
      }
      p {
        margin-bottom: 0;
      }
    }
  }
}
</style>
<style midia="print" lang="less">
@page {
  margin: 132px 101px;
  size: auto;
}
.solidss {
  position: absolute;
  top: 0px;
  left: 50%;
  height: 100%;
  border-left: 1px solid #fa5555;
}
@media print {
  .solidss {
    position: absolute;
    top: 0px;
    left: 50%;
    height: 100%;
    border-left: 1px solid #fa5555;
  }
  .preview-title-box {
    width: 793px;
    height: 50px;
    position: absolute;
    top: -60px;
    padding: 0 15px;
    display: flex;
    background: #ffffff;
    border-radius: 4px;
    transition: all 0.1s;
    left: 50%;
    transform: translateX(-50%);
    .preview-box-title {
      max-width: 150px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .preview-title-boxs {
    right: 50.1%;
    width: 793px;
    height: 56px;
    transition: all 0.3s linear;
    padding: 0px 26px 0px 20px;
    opacity: 1;
  }
  //  预览公文内容
  .zhang {
    position: absolute;
  }
  .preview {
    width: 548px;
    margin: 0 auto;
    box-sizing: border-box;
    h2 {
      text-align: center;
      color: #ff0000;
      margin-bottom: 20px;
      font-size: 26px;
      font-family: FangSong !important;
      font-weight: bold;
    }
    .time {
      text-align: right;
      color: #000000;
      font-size: 12px;
      font-family: SimSun;
      margin-bottom: 16px;
    }
    .content-text {
      .line {
        display: flex;
        align-items: center;
        border-bottom: none;
        flex: 1;
        font-family: FangSong !important;
        color: #000000;
        font-size: 19px;
        &:last-child {
          border-bottom: 1px solid #ff0000;
        }
        .head {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ff0000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-left: 10px;
          font-weight: bold;
        }
      }

      // 第一种
      .fir {
        line-height: 32px;
        box-sizing: border-box;
        border: 1px solid #fa5555;
        border-bottom: none;

        .head {
          margin-top: -1px;
          color: #ff0000;
          height: 48px !important;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .content {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          max-width: 440px;
          height: 100%;
          padding-left: 10px;
          min-height: 48px;
          white-space: normal;
          word-break: break-all;
        }
      }
      .sec {
        display: flex;
        border: 1px solid #fa5555;
        border-bottom: none;
        position: relative;
        overflow: hidden;
        .item {
          display: flex;
          height: 100%;
          min-height: 48px;
          width: 50%;
          &:last-child {
            border-left: 1px solid #fa5555;
          }
        }

        .content {
          display: flex;
          align-items: center;
          min-height: 48px;
          max-width: 166px;
          flex-wrap: wrap;
          white-space: normal;
          word-break: break-all;
        }
      }
    }
    /deep/ .file-text {
      position: relative;
      .head {
        text-align: center;
        color: #ff0000;
        margin-top: 88px;
        pre {
          white-space: normal;
        }
      }
      .body-title {
        height: 56px;
        font-size: 29px;
        font-family: FangSong !important;
        font-weight: 400;
        line-height: 42px;
        color: #000000;
        text-align: center;
        margin-top: 36px;
        margin-bottom: 40px;
      }
      .body {
        position: relative;
        font-family: FangSong !important;
        font-weight: 400;
        color: #000000;
        min-height: 605px;
        pre {
          font-size: 19px;
          font-family: FangSong !important;
          white-space: pre-wrap !important; /*css-3*/
          white-space: -moz-pre-wrap !important; /*Mozilla,since1999*/
          white-space: -pre-wrap !important; /*Opera4-6*/
          white-space: -o-pre-wrap !important; /*Opera7*/
          word-wrap: break-word !important; /*InternetExplorer5.5+*/
          * {
            line-height: 1.5;
            font-family: FangSong !important;
            max-width: 548px;
          }
        }
        p {
          margin-bottom: 0;
        }
      }
    }
  }
  .preview2 {
    padding-top: 0 !important;
  }
}
</style>