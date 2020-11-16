<template>
  <div class="acceptadd">
    <a-affix :offset-top="64">
      <Maintitle :titleObj="titleObj" @go_back="reverts"></Maintitle>
    </a-affix>
    <Maincontent>
      <div class="flex-col acceptadd-box">
        <div class="title">
          <span class="text">发文单</span>
        </div>
        <template v-for="(item, index) in view_data">
          <div class="form-inline" :key="index">
            <div class="form-inline-title">
              <span class="title-name">{{ item.c_name }}</span>
            </div>
            <div
              v-if="item.e_name == 'secret_level'"
              class="form-inline-input heights"
            >
              {{ item.value | urgen_level(datas.degree) }}
            </div>
            <div
              v-else-if="item.e_name == 'urgent_level'"
              class="form-inline-input heights"
            >
              {{ item.value | Degree(datas.urgen_level) }}
            </div>
            <div v-else class="form-inline-input heights">{{ item.value }}</div>
          </div>
        </template>
      </div>
      <div class="flex-col acceptadd-box">
        <div class="title" style="margin: 50px 0 20px 0">
          <span class="text">正文内容</span>
        </div>
        <div class="zhengwen">
          <div class="twoform-inline twoformh" v-html="datas.content"></div>
          <div class="zhang-list">
            <img
              class="zhang-item"
              :style="
                'z-index:' +
                item.zindex +
                'px;top:' +
                item.position.top +
                'px;left:' +
                item.position.left +
                'px;width:' +
                item.position.width +
                'px'
              "
              v-for="(item, index) in datas.signature"
              :key="index"
              :src="'data:image/png;base64,'+item.img_data"
              alt
            />
          </div>
        </div>
      </div>
      <div class="flex-col acceptadd-box">
        <div class="title" style="margin-top: 50px">
          <span class="text">附件内容</span>
        </div>
        <div class="twoform addInpostrafts-enclosure">
          <div class="form-inline-input addInpostrafts-enclosure-textbox">
            <div
              class="addInpostrafts-enclosure-textbox-inbox-tltle file-item"
              v-for="(item, index) in datas.file"
              :key="index"
            >
              <div class="left">
                <div
                  :class="
                    get_file_img(
                      item.path.split('.')[item.path.split('.').length - 1]
                    )
                  "
                ></div>
                <div class="msg">
                  <span
                    class="addInpostrafts-enclosure-textbox-inbox-tltle-text"
                    >{{ item.old_name }}</span
                  >
                  <span
                    class="addInpostrafts-enclosure-textbox-inbox-tltle-file-size"
                    >{{ item.size }}K</span
                  >
                </div>
              </div>
              <div class="right">
                <div
                  v-if="
                    ['txt', 'doc', 'docx', 'pdf', 'png', 'jpg', 'bmp'].includes(
                      item.path.split('.')[item.path.split('.').length - 1]
                    )
                  "
                  class="addInpostrafts-enclosure-textbox-inbox-tltle-rightimg hand"
                  @click="look(item)"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-col acceptadd-box" v-if="datas.remark">
        <div class="title" style="margin-top: 50px">
          <span class="text">退回理由</span>
        </div>
        <div class="return">{{ datas.remark }}</div>
      </div>
      <a-modal
        class="acceptGoBack"
        v-model="goBack.visible"
        title="退回理由"
        @ok="onHandleOk"
      >
        <a-textarea
          v-model="goBack.value"
          placeholder="请输入退回理由"
          :auto-size="{ minRows: 8, maxRows: 8 }"
          :maxLength="200"
        />
        <span class="acceptGoBackComNum">{{ goBack.value.length }}/200</span>
      </a-modal>
    </Maincontent>
    <a-affix :offset-bottom="15">
      <div
        class="postformworkset-bott-btn-box flex-col"
        v-if="buttons.zhuanshouwen == 1 || buttons.tuihui == 1"
      >
        <div class="flex-col-bd"></div>
        <a-button
          @click="transfer"
          class="bcbtn"
          v-if="buttons.zhuanshouwen == 1"
          >转收文</a-button
        >
        <a-button @click="onGiveBack" class="bcbtn" v-if="buttons.tuihui == 1"
          >退回</a-button
        >
      </div>
    </a-affix>
    <NewDocument
      :TemplatePopup="TemplatePopup"
      @delNewDoucument="delNewDoucument"
    />
    <a-modal
      v-model="visible_view"
      title="预览附件内容"
      ok-text="确认"
      cancel-text="取消"
      @ok="visible = false"
    >
      <pre class="view-file-box" v-html="that_view_file_text"></pre>
    </a-modal>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import NewDocument from "@/views/components/NewDocument.vue";
import { addacceptInfo, addgiveBack } from "@/api/accept.js";
import { preview_url, get_file_img } from "@/js/public";
import { get_word } from "@/api/public";
export default {
  name: "Acceptadd",
  data() {
    return {
      //文件预览
      visible_view: false,
      // 当前预览的文件的路径
      look_path: null,
      // 头部需要的开关集合
      titleObj: {
        retu: true, // 返回开关
      },
      formarry: "",
      id: "",
      // 退回理由弹窗需要的变量
      goBack: {
        visible: false, // 开关
        value: "", // 内容
      },
      disabled: true,
      // 文件数据
      datas: {
        file: [], // 附件列表
        content: "", // 正文内容
        urgen_level: [], // 紧急程度
        degree: [], // 密级程度
        remark: "",
      },
      // 发送给模板弹窗的数据对象
      TemplatePopup: {
        // 公文分发id
        file_id: "",
        visibles: false,
        type: 2,
        type2: 6,
        title: "收文模板",
        distribute_id: "",
      },
      // 退回 转收发文权限
      buttons: {},
      view_data: null,
      that_view_file_text: "",
    };
  },
  components: {
    Maintitle,
    Maincontent,
    NewDocument,
  },
  mounted() {
    this.id = this.$route.query.id;
    if (this.$route.query.type == 2) {
      this.addInfo();
    }
  },
  filters: {
    // 公文密级程度
    Degree(info, degree) {
      let _arry = degree?.filter((item) => item.id == info);
      if (_arry == "") {
        return "";
      } else {
        return _arry[0]?.name;
      }
    },
    // 公文紧急程度
    urgen_level(info, urgen_level) {
      let _arry = urgen_level?.filter((item) => item.id == info);
      if (_arry == "") {
        return "";
      } else {
        return _arry[0]?.name;
      }
    },
  },
  methods: {
    get_file_img,
    //查看，删除
    async look(item) {
      let suffix = item.path.split(".")[item.path.split(".").length - 1];
      this.look_path = item.path;
      if (suffix === "txt") {
        let data = await get_word({
          path: this.look_path,
          file_type: 1,
        });
        this.that_view_file_text = data.data;
        this.visible_view = true;
      } else if (["jpg", "png", "jpeg", "bmp", "pdf"].includes(suffix)) {
        window.open(this.look_path);
      } else {
        window.open(preview_url + "?src=" + this.look_path);
      }
    },
    // 退回理由弹窗确定按钮
    onHandleOk() {
      this.getGiveBack();
    },
    // 点击取消，返回上一页
    reverts() {
      this.$router.go(-1);
    },
    // 打开弹窗
    transfer() {
      this.TemplatePopup.visibles = true;
    },
    // 退回公文
    onGiveBack() {
      this.goBack.visible = true;
    },
    // 通过子组件弹窗调用父组件方法关闭弹窗
    delNewDoucument() {
      this.TemplatePopup.visibles = false;
    },
    // 根据传过来的id，获取公文详情
    addInfo() {
      addacceptInfo({
        id: this.id,
        cut: Number(this.$route.query.cut),
      }).then((data) => {
        this.buttons = data.data.button;
        let info = data.data.data;
        info.fields.map((v) => {
          v.disabled = true;
        });
        this.datas = {
          content: info.content,
          file: info.files_all.enclosure_file,
          urgen_level: info.urgen_level,
          degree: info.degree,
          remark: info.remark,
          signature: info.signature,
          status: info.status,
        };
        this.formarry = info.fields;
        this.TemplatePopup.file_id = info.id;
        this.TemplatePopup.distribute_id = data.data.data.distribute_id;
        this.set_view_document_data();
      });
    },
    //数据预览
    set_view_document_data() {
      let zanshi_fir = [];
      let zanshi_sec = [];
      let header_data = JSON.parse(JSON.stringify(this.formarry));
      for (let key in header_data) {
        let value = null;
        if (header_data[key].value) {
          if (header_data[key].value.select) {
            let select_data = [];
            let text_data = [];
            if (header_data[key].value.select) {
              header_data[key].value.select.forEach((el) => {
                if (el.name != "" && el.name != undefined) {
                  select_data.push(el?.name);
                }
              });
            }
            if (header_data[key].value.text) {
              text_data = header_data[key].value.text.split();
            }

            let all_data = [...text_data, ...select_data];

            value = all_data.join();
          } else if (key == "secret_level") {
            this.radio_data.secret_level.forEach((el) => {
              if (el.id == header_data[key].value) {
                if (el.name != "" && el.name != undefined) {
                  value = el?.name;
                }
              }
            });
          } else if (key == "urgent_level") {
            this.radio_data.urgent_level.forEach((el) => {
              if (el.id == header_data[key].value) {
                if (el.name != "" && el.name != undefined) {
                  value = el?.name;
                }
              }
            });
          } else if (key == "word_no") {
            this.all_word_no.forEach((el) => {
              if (el.id == header_data[key].value) {
                if (el.name != "" && el.name != undefined) {
                  value = el?.name;
                }
              }
            });
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
          zanshi_sec.push({
            value,
            c_name: header_data[key].c_name,
            e_name: header_data[key].e_name,
          });
        }
      }
      this.view_data = zanshi_sec;
      setTimeout(() => {
        let doms = document.querySelectorAll(".heights");
        for (let i = 0; i < doms.length; i += 2) {
          if (doms[i] != null) {
            if (doms[i].offsetHeight > doms[i + 1].offsetHeight) {
              doms[i + 1].style.height = `${doms[i].offsetHeight}px`;
            } else {
              doms[i].style.height = `${doms[i + 1].offsetHeight}px`;
            }
          }
        }
      }, 0);
    },
    // 退回公文
    getGiveBack() {
      addgiveBack({
        id: this.TemplatePopup.file_id,
        remark: this.goBack.value,
      }).then((data) => {
        this.goBack.visible = false;
        setTimeout(() => {
          this.$router.go(-1);
        }, 1500);
      });
    },
  },
};
</script>
<style lang="less" scoped>
pre {
  white-space: pre-wrap; /* css3.0 */
  white-space: -moz-pre-wrap; /* Firefox */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}

.zhengwen {
  font-family: FangSong;
  font-size: 19px;
  position: relative;
  width: 100%;
  padding: 0 305px;
  height: 420px;
  overflow-y: scroll;
  border: 1px solid #ebeef5;
}
.twoformh {
  height: 420px;
}
.zhang-list {
  position: absolute;
  top: 0;
  img {
    position: absolute;
  }
}
.maincontent {
  min-height: calc(100% - 150px);
  padding: 0px;
  background: #f7f7f7;
}
.postformworkset-bott-btn-box {
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  width: 1280px;
  height: 60px;
  background: #ffffff;
  margin-top: 15px;
  padding: 0 20px;
}
.acceptGoBack {
  position: relative;
  .acceptGoBackComNum {
    position: absolute;
    bottom: 80px;
    right: 30px;
  }
}
/deep/textarea.ant-input {
  padding-bottom: 30px;
  resize: none;
}
.return {
  border: 1px solid #ebeef5;
  width: 1220px;
  height: 144px;
  background: rgba(255, 255, 255, 1);
  overflow-y: scroll;
}
.bcbtn {
  margin-left: 20px;
}
.transfer-modal {
  /deep/ .ant-modal {
    width: 800px !important;
  }
  .search-box {
    display: flex;
    justify-content: space-between;
  }
  .list-box {
    margin-top: 15px;
    height: 257px;
    border: 1px solid #ebeef5;
    display: flex;
    .list-box-cl {
      width: 50%;
      height: 100%;
      overflow: auto;
      padding: 0 2px;
      .list-box-cl-cell {
        height: 40px;
        margin: 10px 0;
        display: flex;
        align-items: center;
        .transfer-icon {
          font-size: 24px;
          margin: 0 10px;
        }
        .transferlist-icon {
          color: #e6b821;
        }
        .transferlistcl-icon {
          color: #6fb9f6;
        }
      }
      .list-box-cl-cell-activ {
        background-color: #f2f7ff;
      }
    }
    .list-box-right {
      border-left: 1px solid #ebeef5;
    }
  }
}

.acceptadd {
  .acceptadd-box {
    flex-wrap: wrap;
    padding: 24px 30px 30px;
    margin-bottom: 10px;
    background: #ffffff;
  }
  .preview {
    text-align: right;
    margin: 20px 0 15px 0;
    color: #0082ef;
  }
  .form-inline {
    width: 50%;
    min-height: 48px;
    display: flex;
    align-items: center;
    position: relative;
    .form-inline-title {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 200px;
      border: 1px solid #ebeef5;
      background-color: #f5f7fa;
      .redcolor {
        padding-right: 5px;
        color: red;
        width: 72px;
        text-align: right;
      }
    }
    .form-inline-input {
      margin-left: 200px;
      display: flex;
      align-items: center;
      min-height: 48px;
      flex: 1;
      border: 1px solid #ebeef5;
      padding-left: 20px;
      padding: 5px 10px;
      .form-input {
        height: 100%;
        padding: 0 10px;
        width: 100%;
        border: none;
        outline: none;
      }
    }
  }
  .twoform {
    width: 100%;
  }
  .twoform-inline {
    width: 100%;
    padding: 31px;
    .twoform-textarea {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      resize: none;
    }
    .enclosure {
      height: 30px;
      background-color: #f0f2f5;
      width: 420px;
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 20px 0px 10px;
      color: #303133;
      font-size: 14px;
      .imgone {
        width: 19px;
        height: 16px;
        background: pink;
        margin-right: 4px;
      }
      .imgtwo {
        width: 16px;
        height: 11.4px;
        background: pink;
      }
      .imgonedele {
        margin-left: 20px;
        height: 15px;
        width: 10.7px;
        background: pink;
      }
    }
  }

  .redcolor-item {
    width: 420px;
    height: 36px;
    opacity: 1;
    margin-bottom: 10px;
    background: rgba(240, 242, 245, 1)
      url("../../../assets/addpostset/document.png") no-repeat 15px 10px;
    background-size: 19px 16px;
    padding-left: 38px;
    color: #303133;
    font-weight: 500;
    line-height: 36px;
  }
}

.title {
  width: 100%;
  flex-wrap: wrap;
  padding: 24px 30px 30px;
  margin: 0px 0px 16px !important;
  .text {
    color: #000000;
    font-size: 16px;
    font-weight: bold;
  }
}

@import url("../../sendout/css/enclosure.less");
.addInpostrafts-enclosure {
  padding-left: 0 !important;
}
</style>