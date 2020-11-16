<template>
  <div class="attachment">
    <div class="form-inline flex-col">
      <span class="title-name">附件内容</span>
      <div class="flex-col-bd"></div>
      <a-upload
        v-if="update_flag"
        name="file"
        :showUploadList="false"
        :beforeUpload="beforeUpload"
        :customRequest="customRequest"
      >
        <SvgIcon item="Attachment" class="attachment-icon" />
        <a-button class="seefile-link" type="link">上传附件</a-button>
      </a-upload>
      <a
        v-if="file_path.file_path&&file_path.file_path.length>0"
        :href="`${HttpUrl}/enclosure_download?document_id=${docomid}&type=2&token=${$store.state.token}`"
      >
        <SvgIcon item="upload" class="attachment-icon" />
        <a-button class="seefile-link" type="link">全部下载</a-button>
      </a>
    </div>
    <div class="threeform-inline">
      <!-- 查询的内容 -->
      <template v-for="(item, index) in file_path.file_path">
        <div class="threeform-inline-row flex-col" :key="index">
          <div
            class="imgs"
            :class="get_file_img(item.path.split('.')[item.path.split('.').length-1])"
          ></div>
          <div>
            <p class="threeform-inline-row-p">{{item.old_name}}</p>
            <p class="threeform-inline-row-p" style="color:#9B9B9B;">{{item.size}}KB</p>
          </div>
          <div class="flex-col-bd"></div>
          <div class="threeform-inline-row-c threeform-inline-row-right">
            <a-icon
              v-if="[
        'txt',
        'doc',
        'docx',
        'pdf',
        'png',
        'jpg',
        'jpe',
      ].includes(get_suffix(item))"
              class="threeform-inline-row-right-icon hand"
              @click="look(item)"
              type="eye"
              title="查看"
            />
            <a
              class="threeform-inline-row-right-icon hand"
              :href="`${HttpUrl}/red_template_download?id=${item.id}&type=1&token=${$store.state.token}`"
              download="123"
            >
              <a-icon class="threeform-inline-row-right-icon-a" type="cloud-download" title="下载" />
            </a>
          </div>
        </div>
      </template>
      <!-- 上传的内容 -->
      <template v-for="(item, index) in percent">
        <div class="threeform-inline-row flex-col" :key="'p'+index">
          <div
            class="imgs"
            :class="get_file_img(item.data.key.split('.')[item.data.key.split('.').length-1])"
          ></div>
          <div>
            <p class="threeform-inline-row-p">{{item.name}}</p>
            <p class="threeform-inline-row-p" style="color:#9B9B9B;">{{item.size}}KB</p>
          </div>
          <div class="flex-col-bd"></div>

          <a-icon
            class="threeform-inline-row-right-icon hand"
            @click="look(item)"
            type="eye"
            title="查看"
          />
        </div>
      </template>
      <!-- 上传效果 -->
      <div v-show="show_uploading" class="threeform-inline-row flex-col my">
        <div
          class="imgs"
          :class="get_file_img(that_percent.name.split('.')[that_percent.name.split('.').length-1])"
        ></div>
        <div class="flex-col">
          <span class="threeform-inline-row-name">{{that_percent.name}}</span>
          <span style="color:#9B9B9B;margin-left:10px">{{Math.ceil(that_percent.size / 1024)}}KB</span>
        </div>
        <div class="flex-col-bd"></div>
        <a-icon class="threeform-inline-row-right-icon hand" type="eye" title="查看" />
        <div class="progress">
          <a-progress :percent="progress" size="small" />
        </div>
        <span v-show="!that_reFresh">取消</span>
      </div>
      <a-modal v-model="visible" title="预览附件内容" ok-text="确认" cancel-text="取消" @ok="visible=false">
        <pre class="view-file-box" v-html="that_view_file_text"></pre>
      </a-modal>
    </div>
  </div>
</template>
<script>
import {
  randomnumber,
  public_data_files,
  HttpUrl,
  preview_url,
  get_file_img,
} from "@/js/public.js";
import { batchDownload, get_word } from "@/api/public.js";
import { file_download } from "@/api/file_management.js";
import SvgIcon from "@/views/components/svgicon.vue";

export default {
  name: "Attachment",
  props: {
    file_path: {
      default: function () {
        return null;
      },
    },
  },
  data() {
    return {
      progress: 0, //文件上传进度
      reFreshing: false, //正在上传显示
      that_reFresh: false, //当前文件是否上传成功
      that_percent: { name: "", volume: "" }, //当前文件数据
      percent: [], // 上传文件的数据
      uids: "", // 当前上传文件的id
      show_uploading: false,
      docomid: "",
      look_path: null, //文件路径
      visible: false,
      HttpUrl,
      that_view_file_text: "",
      update_flag: false,
    };
  },
  components: {
    SvgIcon,
  },
  computed: {
    leftdata() {
      return this.$store.state.leftdata;
    },
  },
  mounted() {
    if (this.leftdata.auth.can_approval == 1||this.leftdata.status==20) {
      if (this.file_path.template_info) {
        if (this.file_path.template_info.fujian == 1) {
          this.update_flag = true;
        }
      } else {
        this.update_flag = true;
      }
    }

    this.docomid = this.$route.query?.id;
  },
  created() {
    this.$bus.$on("Set_content_data_data", this.set_content_enclosure);
  },
  methods: {
    get_file_img,
    // 判断上传文件是否符合要求
    beforeUpload(file) {
      let type = [
        // 支持上传文件类型
        "txt",
        "docx",
        "pptx",
        "ppt",
        "pdf",
        "xls",
        "xlsx",
        "mp3",
        "mp4",
        "zip",
        "rar",
        "png",
        "jpg",
        "jpeg",
        "bmp",
      ];
      return public_data_files(file, type);
    },
    // 获取上传文件信息以及从后端获取token
    customRequest(files) {
      this.reset();
      this.reFreshing = true;
      this.show_uploading = true;
      // 获取随机数
      let nums = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
      let timer = setInterval(() => {
        if (this.progress < nums) {
          this.progress += 1;
        } else {
          clearInterval(timer);
        }
      }, 100);

      let { file } = files;
      this.uid = file.uid;
      this.that_percent = file;

      randomnumber(files, this.saveFile);
    },
    // callback获取七牛云返回的数据
    saveFile(data) {
      this.that_reFresh = true;
      setTimeout(() => {
        this.progress = 100;
        setTimeout(() => {
          this.show_uploading = false;
          this.percent.push(data);
          this.set_en_arr();
        }, 500);
      }, 1000);
    },
    set_en_arr() {
      let set_enclosure = this.percent.map((res) => {
        return {
          oldname: res.name,
          path: res.url + "/" + res.data.key,
          size: res.size,
        };
      });
      this.$store.commit("SET_LEFTDATA_enclosure",set_enclosure)
    },
    //上传属性重置
    reset() {
      this.reFreshing = false;
      this.that_reFresh = false;
      this.progress = 0;
      this.that_percent = { name: "" };
    },
    // 提交修改上传附件内容
    set_content_enclosure() {
      let obj = [];
      obj = this.percent.map((element) => {
        return {
          path: element.url + "/" + element.data.key,
          old_name: element.name,
          size: element.size,
        };
      });
      this.$store.commit("SET_LEFTDATA_enclosure", obj);
    },
    //获取文件前缀
    get_suffix(item) {
      let suffix = null;
      if (item.old_name) {
        suffix = item.old_name.split(".")[item.old_name.split(".").length - 1];
      } else {
        suffix = item.data.key.split(".")[item.data.key.split(".").length - 1];
      }
      return suffix;
    },
    //文件预览
    async look(item) {
      let suffix = null;
      if (item.old_name) {
        suffix = item.old_name.split(".")[item.old_name.split(".").length - 1];
        this.look_path = item.path;
      } else {
        suffix = item.data.key.split(".")[item.data.key.split(".").length - 1];
        this.look_path = item.url + "/" + item.data.key;
      }
      if (suffix == "png" || suffix == "jpg" || suffix == "pdf") {
        window.open(this.look_path);
      } else if (suffix == "doc" || suffix == "docx") {
        window.open(preview_url + "?src=" + this.look_path);
      } else {
        let data = await get_word({
          path: this.look_path,
          file_type: 1,
        });
        this.that_view_file_text = data.data;
        this.visible = true;
      }
    },
  },
  filters: {},
};
</script>
<style lang="less" scoped>
@import url("../../../../getmanage/pendingtrial/compoentscss/index");
.imgs {
  width: 30px;
  height: 36px;
  margin-right: 12px;
}
.threeform-inline-row-right-icon-a {
  color: #b7b7b7;
  margin-left: 12px;
}
.threeform-inline-row-right-icon {
  color: #b7b7b7;
}
.my {
  background-color: rgba(255, 255, 255, 1) !important;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
  border-radius: 2px;
  cursor: pointer;
}
.progress {
  width: 100px;
  display: flex;
  align-items: center;
  margin: 0 10px;
  border-radius: 2px;
  box-sizing: border-box;
  /deep/ .ant-progress-inner {
    border-radius: 2px;
    height: 14px;
    border: 1px solid rgba(117, 210, 94, 1);
    padding: 2px;
    .ant-progress-bg {
      height: 100% !important;
      background: rgba(117, 210, 94, 1);
      border-radius: 1px !important;
    }
  }
  /deep/.ant-progress-text {
    color: #75d25eff;
    font-size: 12px;
  }
}
.form-inline-input-group {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}
.threeform-inline-row {
  transition: all 0.4s;
  height: 60px;
  background: #f9f9f9;
  border: 1px solid #d9d9d9;
  padding: 0 20px;
  margin-bottom: 10px;
  .threeform-inline-row-p {
    margin: 0px;
  }
}
.ant-upload-picture-card-wrapper {
  width: 88px;
  height: 32px;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  /deep/ .ant-upload {
    width: 88px;
    height: 32px;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
}
/deep/.ant-modal-body {
  overflow-y: scroll;
}
/deep/ .ant-modal-content {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 680px;
}
.form-inline {
  padding-left: 8px;
  height: 16px;
  border-left: 4px solid #0082ef;
  margin: 10px 0 22px;
}
.seefile-link {
  padding: 0px;
}
.attachment-icon {
  margin: 0 4px 0 33px;
  color: #1890ff;
}
.view-file-box {
  height: 400px;
  overflow: auto;
}
</style>