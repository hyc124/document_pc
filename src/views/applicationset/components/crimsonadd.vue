<template>
  <div class="main_bottom">
    <div class="maintitle">
      <span class="hand flex-col" @click="$router.go(-1)">
        <img class="retuLeft" v-if="titleObj.retu" src="../../../assets/left.png" alt />
        <span class="fwb">{{titles[$route.query.type]}}</span>
      </span>
      <div>
        <a-button
          v-if="query.type!=2"
          type="primary"
          style="margin-left: 10px;"
          @click="onSubmit"
        >保存</a-button>
      </div>
    </div>
    <Maincontent>
      <div class="maincontent-col">
        <div class="maincontent-col-title">模板名称</div>
        <div class="maincontent-col-content">
          <a-form-model-item>
            <a-input
              :class="{'red-border':isok}"
              @change="name_change"
              v-model="form.name"
              placeholder="请输入模板名称,上限15个字"
              :maxLength="15"
              style="height:40px;width:620px"
            />
            <br />
            <label v-show="isok" style="color:#F33636">* 请输入正确的模板名称</label>
          </a-form-model-item>
          <div style="height:100%;padding-top:9px;">
            <a-checkbox v-model="status">设为我的常用模板</a-checkbox>
          </div>
        </div>
      </div>
      <div class="maincontent-col">
        <div class="maincontent-col-title">编辑模板</div>
        <div class="maincontent-col-content">
          <div class="flex-col" style="width:100%;">
            <a-upload
              nname="file"
              :beforeUpload="beforeUpload"
              :customRequest="customRequest"
              :disabled="filedisabled"
              :showUploadList="false"
            >
              <a-button>
                <SvgIcon :item="'downloads'" />
                <span class="btn-text">上传模板</span>
                <span class="btn-text up">点击上传</span>
              </a-button>
            </a-upload>
            <span class="upload-text">仅支持txt，docx，pdf格式的文件</span>
            <div class="flex-col-bd"></div>
            <a
              class="main_bottom-downloadFiles hand"
              download="示例模板"
              :href="`${HttpUrl}/get_template_example?token=${$store.state.token}`"
            >
              <SvgIcon :item="'upload'" />下载示例模板
            </a>
          </div>
        </div>
      </div>
      <div class="maincontent-col" style="margin-top:12px;padding-bottom: 25px">
        <div class="maincontent-col-title"></div>
        <div class="maincontent-col-content box" style="margin-top:30px">
          <a-button class="top-center-btn" @click="onEmpty">清空</a-button>
          <div class="main-top-center" id="editors"></div>
          <div class="filesets-box" v-if="showeditor">
            <div v-for="(item, index) in percent" :key="index">
              <Filesets :percent="item" />
              <div class="filesets-line">
                <div class="left">
                  <div>{{item.name}}</div>
                </div>
                <div class="right">
                  <span class="look" @click="lookfile(item)">查看</span>
                  <span class="del" @click="delfile(index)">删除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mask" v-if="query.type==2"></div>
    </Maincontent>
  </div>
</template>
<script>
import { HttpUrl } from "@/js/public.js";
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import Filesets from "@/views/components/filesets.vue";
import SvgIcon from "@/views/components/svgicon.vue";
import {
  Addloadcrims,
  red_template_one,
  Setloadcrims,
} from "@/api/postcrimsonset.js";
import {
  randomnumber,
  preview_url,
  public_data_files,
  randomImg,
} from "@/js/public.js";
import { get_word } from "@/api/public";
import html2Canvas from "html2canvas";

export default {
  name: "Crimsonadd",
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: true, // 返回开关
      },
      titles: {
        1: "新建套红模板",
        2: "预览套红模板",
        3: "编辑套红模板",
      },
      HttpUrl, // 服务器地址
      //副文本
      showeditor: false,
      editor: null,
      editorContent: null, //富文本内容
      status: false, //是否常用模板
      num: 0,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: "",
      },
      reFresh: false, // 上传文件状态显示栏的开关
      percent: {}, // 上传文件的数据
      setInt: "", // 关闭倒计时的变量
      uid: "", // 当前上传文件的id
      data: "",
      filedisabled: false, //限制上传文件数量
      timer: 100,
      imgData: {}, //图片上传后七牛云返回数据

      //检验名称是否为空
      isok: false,
    };
  },
  props: ["type"],
  components: {
    Filesets,
    Maintitle,
    Maincontent,
    SvgIcon,
  },
  mounted() {
    //query  type：1:=>新建，2=>预览，3=>编辑
    //创建副文本
    this.editor = new this.$E("#editors");
    this.editor.customConfig.onchange = (html) => {
      this.editorContent = html;
    };
    this.editor.create();
    if (this.query.type == 2 || this.query.type == 3) {
      this.get_red_template_one();
    }
  },
  computed: {
    query() {
      return this.$route.query;
    },
  },
  created() {
    // this.creatEditor()
  },
  methods: {
    // 点击清楚正文里面的内容
    onEmpty() {
      this.editor.txt.html("");
    },
    //获取单条详情
    async get_red_template_one() {
      let { data } = await red_template_one({ id: this.query.id });
      this.form.name = data.name;
      this.status = data.is_comm == 1 ? true : false;
      this.editor.txt.html(`<pre id="content">${data.content}</pre>`); //如果是txt文件添加标签
    },
    //模板名称改变
    name_change() {
      if (this.form.name.trim().length > 0) {
        this.isok = false;
      }
    },
    // 点击确定
    onSubmit() {
      if (this.form.name.trim() != "") {
        let dom = document.getElementsByClassName("w-e-text")[0];
        //html转图片
        html2Canvas(dom).then((canvas) => {
          let dataURL = canvas.toDataURL("image/png");
          let imgFile = this.dataURLtoFile(dataURL, this.form.name);
          randomImg(imgFile, this.callParams);
        });
      } else {
        this.isok = true;
      }
    },
    //将base64转file对象
    dataURLtoFile(dataurl, filename) {
      //将base64转换为文件
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {
        type: mime,
      });
    },
    //保存数据
    callParams(data) {
      this.imgData = data;
      if (this.query.type == 1) {
        Addloadcrims({
          name: this.form.name,
          path: this.data ? this.data.url + "/" + this.data.data.key : "",
          pic_path: this.imgData
            ? this.imgData.url + "/" + this.imgData.data.key
            : "",
          old_name: this.data ? this.data.name : "",
          type: this.type,
          status: this.status ? 1 : 0,
          content: this.editor.txt.html(),
        }).then((res) => {
          this.data = "";
          this.$router.go(-1);
        });
      } else if (this.query.type == 3) {
        Setloadcrims({
          id: this.query.id,
          name: this.form.name,
          path: this.data ? this.data.url + "/" + this.data.data.key : "",
          pic_path: this.imgData
            ? this.imgData.url + "/" + this.imgData.data.key
            : "",
          old_name: this.data ? this.data.name : "",
          type: this.type,
          status: this.status ? 1 : 0,
          content: this.editor.txt.html(),
        }).then((res) => {
          this.data = "";
          this.$router.go(-1);
        });
      } else {
        this.$router.go(-1);
      }
    },
    //获取word文件内容
    async get_get_word() {
      let { data } = await get_word({
        path: this.data.url + "/" + this.data.data.key,
      });
      this.percent[this.uid].num = 100;
      clearInterval(this.setInt);
      this.percent[this.uid].status = 2;
      this.showeditor = false;
      this.text = data;
      this.editorContent = data;
      this.editor.txt.html(`<pre id="content">${this.text}</pre>`); //如果是txt文件添加标签
    },
    // 获取上传文件信息以及从后端获取token
    customRequest(files) {
      this.showeditor = true;
      this.reFresh = true;
      let { file } = files;
      this.uid = file.uid;
      this.percent = {};
      this.$set(this.percent, file.uid, {
        name: file.name,
        timer: null,
        num: 0,
        status: 1,
      });
      // 获取随机数
      let nums = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
      this.setInt = setInterval(() => {
        if (this.percent[this.uid].num < nums) {
          this.percent[this.uid].num += 1;
        }
      }, this.timer);
      randomnumber(files, this.saveFile);
    },
    // callback获取七牛云返回的数据
    saveFile(data) {
      this.percent[this.uid].url = data.url + "/" + data.data.key;
      this.data = data;
      this.get_get_word();
    },
    // 判断上传文件是否符合要求
    beforeUpload(file) {
      return public_data_files(file, ["txt", "docx", "pdf"], 10);
    },
    // 已经上传的文件预览
    lookfile(item) {
      let suffix = this.data.name.split(".")[
        this.data.name.split(".").length - 1
      ];
      if (suffix === "pdf" || suffix === "PDF") {
        window.open(this.percent[this.uid].url);
      }
    },
    // 删除上传的文件
    delfile(index) {
      this.percent = {};
      this.reFresh = false;
      this.$message.success("删除成功");
    },
  },
  filters: {
    onstatus(status) {
      let text = "";
      if (status == 1) {
        text = "文件上传中。。。";
      } else if (status == 2) {
        text = "文件上传成功";
      } else {
        text = "文件上传失败";
      }
      return text;
    },
  },
};
</script>
<style lang="less" scoped>
.box {
  border: 1px solid #ccc;
  background: hsla(0, 0%, 98%, 0.5);
  padding: 0 !important;
  overflow-y: scroll;
  #editors {
    width: 100%;
    height: 400px;
    /deep/ .w-e-text-container,
    /deep/.w-e-toolbar {
      border: none !important;
    }
    /deep/ .w-e-toolbar {
      position: sticky;
    }
    /deep/ .w-e-text-container {
      position: relative;
      width: 548px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      pre {
        text-align: center;
      }
    }
  }
}
.mask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 10;
}
.top-center-btn {
  position: absolute;
  top: 4px;
  right: 50px;
  z-index: 9;
  height: 24px;
  padding: 0 10px;
  font-size: 12px;
}
.red-border {
  border: red solid 2px;
}
.main_bottom {
  width: 100%;
  height: 100%;
}

.maincontent {
  padding: 40px;

  .maincontent-col {
    display: flex;

    .maincontent-col-title {
      width: 60px;
      line-height: 40px;
    }

    .maincontent-col-content {
      padding: 0 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      position: relative;
      .main_bottom-downloadFiles {
        color: #0082ef;
      }
      /deep/ .ant-upload,
      .ant-upload-select,
      .ant-upload-select-text {
        display: flex;
        justify-content: center;
        align-items: center;

        .ant-btn {
          width: 326px;
          background-color: #f9f9f9;
          border-style: dotted;
        }

        .btn-text {
          padding-left: 10px;
        }

        .up {
          color: #0082ef;
        }
      }

      .upload-text {
        margin-left: 20px;
        color: #bbbbbb;
      }

      /*.maincontent-col-content-show {*/
      /*    position: absolute;*/
      /*    top: 0;*/
      /*    left: 0;*/
      /*    right: 0;*/
      /*    bottom: 0;*/
      /*    z-index: 10;*/
      /*}*/
    }
  }
}

.item-w {
  margin-bottom: 50px;
}

/deep/ .filesets {
  padding-left: 10px;
}

.filesets-box {
  position: absolute;
  width: 80%;
  top: 30%;
  left: 13%;
  background: #fff;
  box-shadow: 1px 1px 3px #ccc;
  z-index: 10000;

  .filesets-line {
    display: flex;
    font-size: 15px;
    font-weight: 400;
    height: 48px;
    line-height: 32px;
    background: rgba(245, 247, 250, 1);
    padding: 8px 10px;
    opacity: 1;
    border-radius: 2px;
    justify-content: space-between;

    .left {
      display: flex;
    }

    .filesets-img {
      margin-right: 10px;
    }

    .right {
      font-size: 12px;
      color: #b5b5b5;

      span {
        display: inline-block;
        width: 50px;
        text-align: right;
        cursor: pointer;
      }
    }
  }
}

/deep/ .ant-progress-bg {
  transition: all linear 0.1s !important;
}

.w-e-text {
  position: relative;
}
.maintitle {
  padding: 0 20px;
  height: 60px;
  background: white;
  margin-bottom: 15px;
  font-size: 18px;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
}
.retuLeft {
  width: 16px;
  height: 12px;
  margin-right: 5px;
}
.fwb {
  font-weight: bold;
}
</style>