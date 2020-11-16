<template>
  <div class="enclosureList">
    <div class="summary enclosure-list">
      <ul class="sec-content">
        <li class="approval">
          <div class="opinion-list">
            <div
              class="opinion-item"
              v-for="(item, index) in approval"
              :key="index"
            >
              <div class="left-index">
                <span :class="index <= 2 ? 'forefront' : 'index'"></span>
                <div v-if="index <= approval.length - 2" class="border"></div>
              </div>
              <div class="date mb flex-col-db">
                <span class="submitter">{{ item.name }}</span>
              </div>
              <div
                class="people"
                v-for="(item2, index2) in item.userinfo"
                :key="index2"
              >
                <!-- 用户信息 -->
                <div class="flex-col-db">
                  <div class="user-msg mb">
                    <div class="head-img">
                      <img :src="item2.avatar" alt />
                    </div>
                    <div class="name">
                      {{ item2.name }}
                      <span v-if="item2.dname != ''" class="dname"
                        >({{ item2.dname.join(",") }})</span
                      >
                    </div>
                  </div>
                  <!-- 点击上传 -->
                  <span
                    style="margin-bottom: 15px"
                    v-if="item.rstatus == 2 && item2.userid == userinfo.userid"
                  >
                    <a-upload
                      name="avatar"
                      :showUploadList="false"
                      list-type="picture"
                      :beforeUpload="beforeUpload"
                      :customRequest="customRequest"
                    >
                      <div class="jiedian hand">
                        <SvgIcon
                          item="downloads"
                          style="margin-right: 5px"
                        />上传附件
                      </div>
                    </a-upload>
                  </span>
                </div>
                <template
                  v-if="item2.rstatus == undefined || item2.rstatus == 6"
                >
                  <template v-if="item2.userid == userinfo.userid">
                    <!-- 已上传列表 -->
                    <ul class="file-list" v-show="percent.length > 0">
                      <li
                        class="file-item"
                        v-for="(item, index) in percent"
                        :key="index"
                      >
                        <div class="file-item-left">
                          <i
                            :class="
                              get_file_img(
                                item.path.split('.')[
                                  item.path.split('.').length - 1
                                ]
                              )
                            "
                          ></i>
                          <span>{{ item.name }}</span>
                        </div>

                        <div class="file-item-right">
                          <i class="eye" @click="look(item)"></i>
                          <i class="delete" @click="del_file(index)"></i>
                        </div>
                      </li>
                    </ul>
                    <!-- 正在上传 -->
                    <div class="uploading" v-show="reFreshing">
                      <div class="up-title">
                        <span>{{ that_percent.name }}</span>
                        <span>{{ upload_state }}</span>
                      </div>
                      <div class="speed">
                        <a-progress
                          :percent="progress"
                          strokeColor="#75D25EFF"
                        />
                        <span class="gray" v-show="!that_reFresh">取消</span>
                      </div>
                    </div>
                  </template>
                </template>
                <!-- 附件列表 -->
                <ul class="file-list" v-if="itemlg(item2)">
                  <li
                    class="file-item"
                    v-for="(item3, index3) in item2.file"
                    :key="index3"
                  >
                    <div class="file-item-left">
                      <i
                        :class="
                          get_file_img(
                            item3.path.split('.')[
                              item3.path.split('.').length - 1
                            ]
                          )
                        "
                      ></i>
                      <span>{{ item3.old_name }}</span>
                    </div>
                    <div class="file-item-right">
                      <i
                        class="eye"
                        v-if="
                          [
                            'txt',
                            'doc',
                            'docx',
                            'pdf',
                            'png',
                            'jpg',
                            'jpe',
                          ].includes(get_suffix(item3))
                        "
                        @click="look(item3)"
                      ></i>
                      <a
                        :href="`${HttpUrl}/red_template_download?id=${item3.id}&type=1&token=${$store.state.token}`"
                        download="123"
                      >
                        <a-icon
                          class="threeform-inline-row-right-icon hand"
                          type="cloud-download"
                          title="下载"
                        />
                      </a>
                    </div>
                  </li>
                </ul>
                <div
                  v-else-if="item2.rstatus != undefined && item2.rstatus != 6"
                  style="color: #909399"
                >
                  暂无附件
                </div>
              </div>
            </div>
            <NotFound v-show="!approval || approval.length <= 0" />
          </div>
        </li>
      </ul>
    </div>
    <a
      class="download-all hand"
      :href="`${HttpUrl}/download_all?id=${$route.query.id}&token=${$store.state.token}`"
      download="123"
      v-if="all_file_flag > 0"
    >
      <SvgIcon item="upload" style="margin-right: 5px" />下载全部附件
    </a>
    <!-- 文件预览 -->
    <div class="file_preview">
      <a-modal
        v-model="vis_path"
        title="预览附件内容"
        ok-text="确认"
        cancel-text="取消"
        @ok="vis_path = false"
      >
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
import SvgIcon from "@/views/components/svgicon.vue";
import { approval_opinion } from "@/api/incoming.js";
import { get_word } from "@/api/public";
import NotFound from "@/views/components/notFound.vue";
export default {
  data() {
    return {
      approval: null,
      look_path: false,
      vis_path: false,
      HttpUrl,
      //文件上传进度
      upload_state: "上传中...",
      progress: 0,
      reFreshing: false, //正在上传显示
      that_reFresh: false, //当前文件是否上传成功
      that_percent: {}, //当前文件数据
      // percent: [], // 上传文件的数据
      setInt: "", // 关闭倒计时的变量
      uids: "", // 当前上传文件的id

      //控制下载全部附件按钮
      all_file_flag: 0,

      that_view_file_text: "",
    };
  },
  components: {
    SvgIcon,
    NotFound,
  },
  created() {
    this.get_approval_opinion();
  },
  computed: {
    leftdata() {
      return this.$store.state.leftdata;
    },
    userinfo() {
      return this.$store.state.userinfo;
    },
    itemlg() {
      return (v) => {
        return v.rstatus == 6 ? false : v?.file?.length;
      };
    },

    percent() {
      return this.$store.state.percent;
    },
  },
  methods: {
    get_file_img,
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
    async get_approval_opinion() {
      let data = await approval_opinion({
        data_id: this.$route.query.id,
      });
      //空数据处理
      if (data.data) {
        data.data.forEach((el) => {
          if (el?.userinfo?.length > 0) {
            el.userinfo.forEach((el2) => {
              switch (el2.rstatus) {
                case 3:
                  el2.c_status = "同意";
                  break;
                case 4:
                  el2.c_status = "拒绝";
                  break;
                case 5:
                  el2.c_status = "已撤销";
                  break;
                case 6:
                  el2.c_status = "暂放";
                  break;
                case 7:
                  el2.c_status = "报废";
                  break;
              }

              if (el2?.file?.length > 0) {
                this.all_file_flag++;
              }
            });
          }
        });
        this.approval = data.data;
      }
    },
    //文件预览
    async look(item) {
      let suffix = item?.path.split(".")[item.path.split(".").length - 1];

      this.look_path = item.path;

      if (suffix == "png" || suffix == "jpg") {
        window.open(this.look_path);
      } else if (suffix == "doc" || suffix == "docx" || suffix == "pdf") {
        if (suffix == "pdf") {
          window.open(this.look_path);
        } else {
          window.open(preview_url + "?src=" + this.look_path);
        }
      } else {
        let data = await get_word({
          path: this.look_path,
          file_type: 1,
        });
        this.that_view_file_text = data.data;
        this.vis_path = true;
      }
    },
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
      // 获取随机数
      let nums = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
      let timer = setInterval(() => {
        if (this.progress < nums) {
          this.progress += 1;
        } else {
          this.reFreshing = false;
          clearInterval(timer);
        }
      }, 100);

      let { file } = files;
      // this.uid = file.uid;
      randomnumber(files, this.saveFile);
    },
    // callback获取七牛云返回的数据
    saveFile(data) {
      this.progress = 100;
      this.upload_state = "上传成功";
      this.that_reFresh = true;
      let path = data.url + "/" + data.data.key;
      this.percent.push({ ...data, path });
      this.that_percent = data;
    },
    //删除文件
    del_file(key) {
      this.$confirm({
        icon: "info-circle",
        title: "提示",
        content: "是否删除该文件？",
        okText: "确认",
        cancelText: "取消",
        onOk: function () {
          this.percent.splice(key, 1);
          this.reset();
        }.bind(this),
        onCancel() {},
      });
    },
    //上传属性重置
    reset() {
      this.reFreshing = false;
      this.that_reFresh = false;
      this.progress = 0;
      this.that_percent.name = "";
    },
  },
};
</script>

<style lang="less" scoped>
.enclosureList {
  padding: 28px 0;
  //意见汇总
  .summary {
    .sec-tab {
      display: flex;
      justify-content: center;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(228, 231, 237, 1);
      li {
        width: 130px;
        height: 32px;
        background: rgba(239, 248, 255, 1);
        border: 1px solid rgba(130, 199, 255, 1);
        color: #82c7ffff;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        &:first-child {
          border-radius: 4px 0 0 4px;
          border-right: none;
        }
        &:last-child {
          border-radius: 0px 4px 4px 0px;
          border-left: none;
        }
      }

      .active {
        background: #82c7ffff;
        color: white;
      }
    }
    .sec-content {
      padding: 0 10px;
      li {
        .opinion-item {
          position: relative;
          padding-left: 30px;
          .mb {
            margin-bottom: 15px;
          }
          .left-index {
            position: absolute;
            left: 0;
            height: 100%;
            span {
              position: absolute;
              top: 7px;
              left: -4px;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              text-align: center;
              z-index: 1;
            }
            .index {
              background: rgba(238, 238, 238, 1);
              color: #606266ff;
            }
            .forefront {
              background: #41aaff;
            }
            .border {
              position: relative;
              top: 7px;
              width: 1px;
              background: #eeeeee;
              height: 100%;
            }
          }
          &:last-child {
            .left-index {
              .border {
                width: 0;
              }
            }
          }

          .date {
            font-size: 12px;
            color: #909399ff;
          }
          .user-msg {
            display: flex;
            align-items: center;

            .head-img {
              width: 28px;
              height: 28px;
              border-radius: 50%;
              overflow: hidden;
              margin-right: 10px;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
          .ant-input {
            height: 120px;
            resize: none;
            color: #303133ff;
            background: rgba(245, 247, 250, 1);
            border: none;
          }
          .enclosure {
            display: flex;
            align-items: center;

            .download {
              margin: 0 20px 0 10px;
            }
          }
        }
      }
      .approval,
      .crculation {
        padding: 0 10px;
      }

      .crculation {
        .title {
          padding-left: 25px;
          border-left: 4px solid rgba(164, 213, 255, 1);
          font-size: 16px;
          color: #303133ff;
          margin-left: -20px;
          margin-bottom: 20px;
        }
        .r-content {
          padding: 0 10px 0 15px;
          overflow-y: scroll;
        }
        .content {
          /deep/ .ant-table-wrapper {
            width: 100%;
          }
        }
        .record {
          margin-top: 50px;
        }
      }
    }
  }
  //附件列表
  .enclosure-list {
    max-height: 800px;
    overflow: auto;
    .opinion-list {
      position: relative;
      min-height: 400px;
      .download-all {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 10px;
        text-align: right;
        color: #0082ef;
        cursor: pointer;
        .download {
          width: 13px;
          height: 12px;
          background: url("../../../../../assets/addpostset/download.png")
            no-repeat center;
          background-size: 13px 12px;
          margin-right: 10px;
        }
      }
      .opinion-item {
        padding-bottom: 30px;
        .file-list {
          overflow-y: scroll;
          .file-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(251, 251, 251, 1);
            margin-bottom: 15px;
            padding: 10px;
            transition: all 0.3s;
            box-sizing: border-box;
            &:hover {
              background: rgba(240, 242, 245, 1);
            }

            div {
              display: flex;
              height: 100%;
              align-items: center;
            }
            i {
              display: block;
            }
            .file-item-left {
              display: flex;
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;

              span {
                width: 150px;
                margin-left: 8px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
            .file-item-right {
              .download {
                width: 13px;
                height: 12px;
                background: url("../../../../../assets/addpostset/download.png")
                  no-repeat center;
                background-size: 13px 12px;
              }
              .delete {
                cursor: pointer;
                width: 11px;
                height: 16px;
                background: url("../../../../../assets/addpostset/delete.png")
                  no-repeat center;
                background-size: 11px 16px;
              }
              .eye {
                width: 16px;
                height: 12px;
                background: url("../../../../../assets/addpostset/eye.png")
                  no-repeat center;
                margin-right: 10px;
                background-size: 16px 12px;
              }
            }
          }
        }
      }
    }
  }
  .download-all {
    display: block;
    margin-top: 20px;
    height: 36px;
    background-color: #f9f9f9;
    border: 1px dotted #d9d9d9;
    border-radius: 2px;
    line-height: 36px;
    text-align: center;
    color: #0082ef;
  }
}
.upload {
  text-align: right;
  color: #0082ef;
  margin-top: 10px;
}
.sec-tab {
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(228, 231, 237, 1);
  li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 130px;
    height: 32px;
    background: rgba(239, 248, 255, 1);
    border: 1px solid rgba(130, 199, 255, 1);
    color: #82c7ffff;
    cursor: pointer;
    transition: all 0.3s;
    &:first-child {
      border-radius: 4px 0 0 4px;
      border-right: none;
    }
    &:last-child {
      border-radius: 0px 4px 4px 0px;
      border-left: none;
    }
  }

  .active {
    background: rgba(0, 130, 239, 1);
    color: white;
  }
}
.sec-content {
  padding: 0 10px;
  li {
    .opinion-item {
      position: relative;
      padding-left: 30px;

      .mb {
        margin-bottom: 15px;
      }
      .left-index {
        position: absolute;
        left: 0;
        height: 100%;
        span {
          position: absolute;
          left: -11px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          line-height: 22px;
          text-align: center;
        }
        .index {
          background: rgba(238, 238, 238, 1);
          color: #606266ff;
        }
        .forefront {
          background: #0082efff;
          color: white;
        }
        .border {
          width: 1px;
          background: rgba(238, 238, 238, 1);
          height: 100%;
        }
      }
      &:last-child {
        .left-index {
          .border {
            width: 0;
          }
        }
      }

      .date {
        font-size: 12px;
        color: #909399ff;
      }
      .user-msg {
        display: flex;
        align-items: center;

        .head-img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 10px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .opinions {
        margin-bottom: 15px;
      }
      .ant-input {
        min-height: 40px;
        resize: none;
        color: #303133ff;
        background: rgba(245, 247, 250, 1);
        border: none;
      }
      .enclosure {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .noHas {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 20px;
          width: 44px;
          height: 24px;
          background: rgba(96, 98, 102, 0.2);
          color: rgba(96, 98, 102, 1);
          border-radius: 12px;
        }
        .Has {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 20px;
          width: 44px;
          height: 24px;
          color: rgba(98, 194, 50, 1);
          border-radius: 12px;
          background: rgba(98, 194, 50, 0.2);
        }
        .download {
          margin: 0 20px 0 10px;
        }
      }
    }
    .approval,
    .crculation {
      padding: 0 10px;
    }
    .approval {
      height: 560px;
      overflow-y: scroll;
      .opinion-list {
        padding: 0 10px;
      }
    }
    .crculation {
      .title {
        padding-left: 25px;
        border-left: 4px solid rgba(164, 213, 255, 1);
        font-size: 16px;
        color: #303133ff;
        margin-left: -20px;
        margin-bottom: 20px;
      }
      .r-content {
        padding: 0 10px 0 15px;
        height: 560px;
        overflow-y: scroll;
      }
      .content {
        height: 400px;
        overflow-y: scroll;
        /deep/ .ant-table-wrapper {
          width: 100%;
        }
      }
      .record {
        margin-top: 50px;
      }
    }
  }
}
.jiedian {
  color: #0082ef;
  font-size: 14px;
}
.people {
  padding-bottom: 20px;
}
.submitter {
  color: #303133ff;
  font-size: 14px;
}
.opinion {
  display: flex;
  width: 100%;
  min-height: 40px;
  background: rgba(245, 247, 250, 1);
  align-items: center;
  padding-left: 10px;
}
.opinion-agree {
  color: #62c232;
  margin-right: 10px;
}
.dowload {
  width: 13px;
  height: 12px;
  background: url("../../../../../assets/addpostset/download.png") no-repeat
    center;
  background-size: 13px 12px;
}
.view-file-box {
  height: 400px;
  overflow: auto;
}
.dname {
  color: #909399;
  font-size: 12px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
  position: relative;
  top: 4px;
}
</style>