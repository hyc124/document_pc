<template>
  <div class="addInpostrafts-footer-handle">
    <div class="processing">
      <div class="line submitter" v-if="list_data && list_data.submitter">
        <div class="p-title flex-col">提交人</div>
        <div class="p-content">
          <div class="item" v-if="list_data.submitter.dname.length > 0">
            <div class="head">
              <img :src="list_data.submitter.avatar" alt />
            </div>
            <div class="user-info">
              <span class="name">{{ list_data.submitter.name }}</span>
              <span
                class="position"
                v-if="list_data.submitter.dname.length == 1"
                >{{ list_data.submitter.dname[0] }}</span
              >
            </div>
          </div>
          <div class="item" v-else>
            <div class="head">
              <img :src="list_data.submitter.avatar" alt />
            </div>
            <div class="user-info">
              <span class="name">{{ list_data.submitter.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="line department">
        <div class="p-title flex-col">提交人所在部门</div>
        <div class="p-content">
          <a-radio-group
            name="department"
            @change="department_change"
            v-model="get_process.department"
          >
            <a-radio
              :value="item.id"
              v-for="(item, index) in dept"
              :style="get_process.department == item.id ? 'color:#0082ef;' : ''"
              :key="'department' + index"
              >{{ item.dep_name }}</a-radio
            >
          </a-radio-group>
        </div>
      </div>

      <div class="line next submitter" style="height: 100px; overflow: auto">
        <div class="p-title flex-col" style="height: 100px">即将流向</div>
        <div class="p-content" v-if="next_process && next_process.length > 0">
          <div class="item" v-for="(item, index) in next_process" :key="index">
            <div class="head" v-if="item.avatar">
              <img :src="item.avatar" alt="头像" />
            </div>
            <div class="user-info">
              <span class="name" v-if="item.name">{{ item.name }}</span>
              <template v-if="item.dname && item.dname.length > 0">
                <span
                  class="position"
                  v-for="(item2, index2) in item.dname"
                  :key="index2"
                  >{{ item2 }}</span
                >
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="line urgents">
        <div class="p-title flex-col">紧急程度</div>
        <div class="p-content">
          <a-radio-group
            name="urgents"
            v-model="get_process.urgency"
            @change="onChange"
          >
            <a-radio :value="1" style="color: #303133">普通</a-radio>
            <a-radio class="jinji" :value="2" style="color: #f84949"
              >紧急</a-radio
            >
            <a-radio class="jiaji" :value="3" style="color: #d12d2d"
              >加急</a-radio
            >
          </a-radio-group>
        </div>
      </div>

      <div class="line opinions">
        <div class="p-title flex-col">处理意见</div>
        <div class="p-content">
          <div class="p-box">
            <a-textarea
              style="
                border-bottom: none;
                box-shadow: none;
                border: 1px solid #d9d9d9 !important;
                padding-bottom: 30px;
              "
              v-model="get_process.opinion"
              placeholder="请输入处理意见"
              :rows="4"
              :maxLength="400"
            />
            <span class="box-textnum">{{ inputLength }}/400</span>
            <div class="btn-list">
              <div class="btn-item hand" @click="reply.reply_visible = true">
                快捷回复
                <i class="sanjiao xia"></i>
              </div>
              <div class="btn-item hand" @click="Signature.list_visible = true">
                使用电子签章
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 通知选项 -->
      <div class="line noticing">
        <div class="p-title flex-col">通知选项</div>
        <div class="p-content">
          <div class="left">
            流程启动后
            <a-input
              v-model="get_process.msg_time.day"
              @change="time_set"
              placeholder="0"
              class="day"
              :maxLength="2"
            />&nbsp;天 &nbsp;
            <a-input
              v-model="get_process.msg_time.hour"
              @change="time_set"
              placeholder="0"
              class="hour"
              :maxLength="2"
            />&nbsp;时 &nbsp;
            <a-input
              v-model="get_process.msg_time.minute"
              @change="time_set"
              placeholder="0"
              class="minute"
              :maxLength="2"
            />&nbsp;分&nbsp; 后仍无结束通知我
          </div>
          <a-checkbox v-model="get_process.notice" @change="onChange"
            >流程结束后通知我</a-checkbox
          >
        </div>
      </div>
      <!-- 通知方式 -->
      <div class="line noticing-ways" v-show="get_process.notice">
        <div class="p-title">通知方式</div>
        <div class="p-content">
          <a-checkbox-group v-model="get_process.way">
            <a-checkbox :disabled="true" :value="1">待办</a-checkbox>
            <a-checkbox :disabled="true" :value="4">企业微信</a-checkbox>
            <a-checkbox :value="2">邮箱</a-checkbox>
            <a-checkbox :value="3">短消息</a-checkbox>
          </a-checkbox-group>
        </div>
      </div>

      <div class="line files">
        <div class="p-title">
          <span>附件</span>
          <div
            style="
              font-size: 12px;
              color: #c0c6cc;
              width: 100%;
              text-align: center;
            "
          >
            (非正文附件)
          </div>
        </div>
        <div class="p-content flex-col">
          <a-upload
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :multiple="true"
            :showUploadList="false"
            :beforeUpload="beforeUpload"
            :customRequest="customRequest"
            :disabled="file.upload_state"
          >
            <div class="flex-center">
              <i class="upload-icon"></i>
              <span>上传附件</span>
              <span class="upload-text">点击上传</span>
            </div>
          </a-upload>
          <div
            class="file-item"
            v-for="(item, index) in file.vuex_percent"
            :key="index"
            :style="index==0?'margin-top:0px;':''"
          >
            <div class="left">
              <div :class="get_file_img(item.suffix)"></div>
              <div class="msg">
                <span
                  class="addInpostrafts-enclosure-textbox-inbox-tltle-text"
                  >{{ item.oldname }}</span
                >
                <span class="file-size">{{ item.size }}K</span>
              </div>
            </div>

            <div class="right">
              <div
                v-if="
                  [
                    'txt',
                    'doc',
                    'docx',
                    'pdf',
                    'png',
                    'jpg',
                    'jpe',
                    'bmp',
                  ].includes(item.suffix)
                "
                class="addInpostrafts-enclosure-textbox-inbox-tltle-rightimg"
                @click="look(item)"
              ></div>
              <div
                class="addInpostrafts-enclosure-textbox-inbox-tltle-rightimgs"
                @click="dele(index)"
              ></div>
            </div>
          </div>

          <div class="file-item" v-show="!file.that_reFresh">
            <div class="left">
              <div :class="get_file_img(file.that_percent.suffix)"></div>
              <div class="msg">
                <span
                  class="addInpostrafts-enclosure-textbox-inbox-tltle-text"
                  >{{ file.that_percent.name }}</span
                >
                <span class="file-size">{{ file.that_percent.name }}</span>
              </div>
            </div>
            <a-progress :percent="file.progress" size="small" />

            <span class="quxiao" @click="quxiao">取消</span>
          </div>
        </div>
      </div>

      <!-- 预览 -->
      <a-modal
        v-model="visible"
        title="预览附件内容"
        ok-text="确认"
        cancel-text="取消"
        @ok="visible = false"
      >
        <pre v-html="that_view_file_text"></pre>
      </a-modal>

      <!-- （快速回复选择） -->
      <a-modal
        v-model="reply.reply_visible"
        title="快捷回复"
        :footer="null"
        @cancel="reply_cancel"
      >
        <div class="reply-list">
          <div
            class="reply-item"
            :class="{ active: reply.choose_index == index }"
            @click="choose_opinion(index, item)"
            v-for="(item, index) in reply.reply_list"
            :key="index"
          >
            <div class="text">{{ item.content }}</div>
            <div class="icon">
              <i class="bianji" @click.stop="bianji(item)"></i>
              <i class="delete" @click.stop="reply_del(item.id)"></i>
            </div>
          </div>
        </div>
        <div
          class="add-reply"
          v-show="reply.reply_list && reply.reply_list.length < 10"
          @click="reply.set_visible = true"
        >
          <i class="add-reply-icon"></i>
          <span>添加快捷回复</span>
        </div>
      </a-modal>

      <!-- （快速回复自定义） -->
      <a-modal
        v-model="reply.set_visible"
        title="自定义回复"
        ok-text="确认"
        cancel-text="取消"
        @cancel="add_reply_cancel"
        @ok="reply_add_ok"
      >
        <p>回复内容</p>
        <a-textarea
          v-model="reply.add_reply_value"
          :maxLength="200"
          placeholder="请输入"
          style="height: 120px; resize: none; padding-bottom: 30px"
          :rows="4"
        />
        <span class="add-reply-spanNum"
          >{{ reply.add_reply_value.length }}/200</span
        >
      </a-modal>

      <!-- （电子签章列表） -->
      <a-modal
        v-model="Signature.list_visible"
        title="选择签章"
        ok-text="确认"
        cancel-text="取消"
        @ok="Signature_choice_ok"
        class="signature"
      >
        <a-tabs v-model="Signature.tab_key" @change="Signature_callback">
          <a-tab-pane :key="3" tab="我的常用签章">
            <MainSignature
              @select_signature="select_signature"
              @update_data="update_data"
              :list="Signature.signature_list"
              :all_val="all_val"
            />
          </a-tab-pane>
          <a-tab-pane :key="1" tab="所有签章" force-render>
            <MainSignature
              @select_signature="select_signature"
              @update_data="update_data"
              :list="Signature.signature_list"
              :all_val="all_val"
            />
          </a-tab-pane>
          <a-tab-pane :key="2" tab="我创建的">
            <MainSignature
              @select_signature="select_signature"
              @update_data="update_data"
              :list="Signature.signature_list"
              :all_val="all_val"
            />
          </a-tab-pane>
          <a-tab-pane :key="4" tab="授权给我的">
            <MainSignature
              @select_signature="select_signature"
              @update_data="update_data"
              :list="Signature.signature_list"
              :all_val="all_val"
            />
          </a-tab-pane>
          <div
            class="upload-signature"
            @click="onUpload"
            slot="tabBarExtraContent"
          >
            <span class="jia">+</span>
            上传签章
          </div>
        </a-tabs>
      </a-modal>
      <!-- 输入签章密码 -->
      <a-modal
        v-model="pwd_visible"
        cancelText="取消"
        okText="确定"
        title="输入使用密码"
        @cancel="form.pwd = ''"
        @ok="pwd_handleOk"
      >
        <a-form-model ref="ruleForm" :model="form">
          <a-form-model-item ref="name" label="签章密码" prop="name">
            <a-input-password placeholder="请输入密码" v-model="form.name" />
            <p class="error" v-show="pwd_error">{{ tips }}</p>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 跳转新建流程页面，保存草稿弹窗 -->
      <a-modal
        title="保存草稿"
        :visible="jumpPopup.visible"
        okText="保存草稿并跳转"
        cancelText="取消"
        @ok="onJumpPopupOk"
        @cancel="jumpPopup.visible = false"
      >
        <p>
          即将跳转到新建{{
            jumpPopup.centenText
          }}页面，是否需要保存本页面内容为草稿！！！
        </p>
      </a-modal>
    </div>
  </div>
</template>
<script>
import {
  public_data_files,
  randomnumber,
  preview_url,
  HttpUrl,
  get_file_img,
} from "@/js/public";
import {
  approval_get_nimble,
  approval_nimble_add,
  approval_nimble_delete,
  ele_index,
  ele_me_list,
  ele_check,
} from "@/api/draft";
import { get_word } from "@/api/public";
import MainSignature from "@/views/sendout/draft/addcompoents/components/signature/main.vue";

export default {
  name: "Handle",

  props: {
    list: {
      default: null,
    },
    dept: {
      default: null,
    },
    next_process_father: {
      default: null,
    },
  },
  data() {
    return {
      //即将流向
      value: 1,
      invalid: true,
      headers: {
        authorization: "authorization-text",
      },
      next_process: [],
      //通知选项
      notice: {
        day: null,
        hour: null,
        minute: null,
      },
      list_data: null,
      //----------------------------------
      // 当前预览的文件的路径
      visible: false,
      look_path: null,
      //文件参数
      file: {
        progress: 0,
        that_reFresh: true, //当前文件是否上传成功，默认true代表成功(不显示正在上传)
        upload_state: false, //按钮状态
        that_percent: {}, //当前文件数据
        that_file_index: null, //当前文件的下标(用于显示隐藏)

        //用于渲染以及提交的文件列表数据（真正使用的）
        vuex_percent: [],

        //用于取消判断的文件列表数据
        false_percent: [],
        quxiao_id: null, //当前取消id

        //当前文件的大小
        that_file_size: null,
      },

      //快速回复
      reply: {
        reply_list: null,
        reply_visible: false,
        set_visible: false,
        add_reply_value: "",
        choose_index: null,
        choose_item: null,
        that_bianji: null,
      },

      //电子签章
      Signature: {
        list_visible: false,
        tab_key: 3,
        signature_list: null,
        select_signature: null,
      },
      all_val: { name: "", type: 3 },
      form: {
        pwd: "",
      },
      pwd_visible: false,
      pwd_error: false,
      tips: "请输入密码",
      // 跳转流程页面弹窗控制
      jumpPopup: {
        visible: false, // 弹窗开关
        centenText: "", // 打开的按钮
      },
      that_view_file_text: "",
    };
  },
  components: { MainSignature },
  computed: {
    get_process() {
      return this.$store.state.document_all.process;
    },
    inputLength() {
      if (this.get_process.opinion != null) {
        return this.get_process.opinion.length;
      } else {
        return 0;
      }
    },
  },
  created() {
    //   初始赋值
    if (!this.list_data && this.list.data && this.list.data.length > 0) {
      this.list_data = this.list;
      this.next_process = this.list.data[0]?.info;
    }

    this.$bus.$off("file_approval");
    this.$bus.$on("file_approval", this.set_file_approval);
    this.get_approval_get_nimble();
    this.get_ele_index();

    //更新即将流向
    this.$bus.$off("updata_next_process");
    this.$bus.$on("updata_next_process", (data) => {
      if (data.data) {
        this.next_process = data.data[0]?.info;
      } else {
        if (data.length > 0) {
          if (data[0].users[0].flag == 4) {
            this.next_process = [
              {
                avatar: require("../../../../../assets/adddraft/default-head-img.png"),
                flag: 4,
                name: "直接上级",
              },
            ];
          } else if (data[0].users[0].flag == 3) {
            this.next_process = data[0]?.info;
          } else if (data[0].users[0].flag == 2) {
            this.next_process = [
              {
                avatar: require("../../../../../assets/adddraft/default-head-img.png"),
                flag: 2,
                name: data[0].title,
              },
            ];
          } else if (data[0].users[0].flag == 5) {
            this.next_process = [
              {
                avatar: require("../../../../../assets/adddraft/default-head-img.png"),
                flag: 5,
                name: "申请人",
              },
            ];
          } else if (data[0].users[0].flag == 1) {
            this.next_process = [
              {
                avatar: require("../../../../../assets/adddraft/default-head-img.png"),
                flag: 1,
                name: data[0].title,
              },
            ];
          } else {
            this.next_process = data[0]?.info;
          }
        } else {
          this.next_process = "";
        }
      }
    });
    //默认设置选中第一个部门
    if (this.dept) {
      this.$store.commit("SET_DOCUMENT_PROCESS_department", this.dept[0].id);
    }
  },
  watch: {
    list() {
      if (!this.list_data && this.list.data && this.list.data.length > 0) {
        this.list_data = this.list;
        this.next_process = this.list.data[0]?.info;
      }
    },
    next_process_father() {
      this.next_process = this.next_process_father;
    },

    dept() {
      if (this?.dept[0]?.id) {
        this.$store.commit("SET_DOCUMENT_PROCESS_department", this.dept[0].id);
      }
    },
  },
  methods: {
    //获取文件图片
    get_file_img,
    // 点击上传电子签章跳转到上传签章页面
    onUpload() {
      // 1是点击新建流程模板 2 是新建套红模板
      this.jumpPopup.centenText = "签章";
      this.jumpPopup.visible = true;
    },
    // 保存草稿并跳转新建流程页面
    onJumpPopupOk() {
      //叫发文保存草稿
      this.$bus.$emit("SettingNotice");
      this.jumpPopup.visible = false;
      this.$router.push({ path: "/allsignature/allsignatureadd" });
    },
    //获取快捷回复列表
    async get_approval_get_nimble() {
      let { data } = await approval_get_nimble();
      this.reply.reply_list = data;
    },
    //快捷回复新增
    async reply_add_ok() {
      let { code } = await approval_nimble_add({
        content: this.reply.add_reply_value,
        id: this.reply.that_bianji,
      });
      if (code == 1) {
        this.reply.add_reply_value = "";
        this.reply.set_visible = false;
        this.get_approval_get_nimble();
      }
    },
    //快捷回复设置
    choose_opinion(index, item) {
      this.reply.choose_index = index;
      this.reply.choose_item = item;
      //   this.reply.reply_visible = false
      let all_opinion = "";
      if (this.get_process.opinion) {
        all_opinion =
          this.get_process.opinion + "\n" + this.reply.choose_item.content;
      } else {
        all_opinion = this.reply.choose_item.content;
      }
      this.$store.commit("SET_DOCUMENT_PROCESS_opinion", all_opinion);
      this.reply.choose_index = null;
      this.reply.choose_item = null;
    },
    //快捷回复删除
    reply_del(id) {
      this.$confirm({
        icon: "info-circle",
        title: "提示",
        content: "是否删除该条回复？",
        okText: "确认",
        cancelText: "取消",
        onOk: async function () {
          let { code } = await approval_nimble_delete({ id });
          if (code == 1) {
            this.get_approval_get_nimble();
          }
        }.bind(this),
      });
    },
    //快捷回复编辑
    bianji(item) {
      this.reply.add_reply_value = item.content;
      this.reply.set_visible = true;
      this.reply.that_bianji = item.id;
    },
    //快速回复弹窗关闭
    reply_cancel() {
      this.reply.add_reply_value = "";
      this.reply.that_bianji = null;
    },
    //快速回复弹窗关闭
    add_reply_cancel() {
      this.reply.add_reply_value = "";
      this.reply.that_bianji = null;
    },
    //部门改变
    department_change() {
      this.$bus.$emit("update_approval_data", this.get_process.department);
    },

    //电子签证列表
    async get_ele_index() {
      let { data } = await ele_index({
        name: this.all_val.name,
        type: this.all_val.type,
        status: this.Signature.tab_key,
        limit: 100000,
      });

      this.Signature.signature_list = data.datas;
    },
    //电子签证列表2
    async get_ele_me_list() {
      let { data } = await ele_me_list({
        name: this.all_val.name,
        type: this.all_val.type,
        limit: 100000,
      });
      this.Signature.signature_list = data.datas;
    },
    //电子签章选择
    select_signature(data) {
      this.Signature.select_signature = data;
    },
    //电子签章标签页切换
    Signature_callback() {
      this.all_val = { name: "", type: 3 };
      if ([1, 2, 3].includes(this.Signature.tab_key)) {
        this.get_ele_index();
      } else {
        this.get_ele_me_list();
      }
    },
    //密码确认
    async pwd_handleOk() {
      if (this.form.name.trim().length <= 0) {
        this.pwd_error = true;
        this.tips = "请输入密码";
        return;
      }
      let res = await ele_check({
        id: this.Signature.select_signature.id,
        pwd: btoa(this.form.name),
      });

      if (!res.code) {
        this.tips = "密码错误请重新输入";
        this.pwd_error = true;
        this.form.name = "";
      } else if (res.code && res.code == 1) {
        this.pwd_error = false;
        this.pwd_visible = false;
        this.Signature.list_visible = false;
        this.set_signature_data();
      }
    },

    //设置签章的数据，以及更新正文签章
    set_signature_data() {
      let _signature_arr = [...this.get_process.signature];
      let isok = false;
      var id_arr = _signature_arr.map((x) => x.id);
      var id_arr2 = _signature_arr.map((x) => x.signature_id);

      if (
        id_arr.includes(this.Signature.select_signature.id) ||
        id_arr2.includes(this.Signature.select_signature.id)
      ) {
        this.$message.error("已选择该签章!");
      } else {
        let text_H = document.querySelector(".w-e-text-container").clientHeight;
        _signature_arr.push({
          id: this.Signature.select_signature.id,
          signature_base: this.Signature.select_signature.img_data,
          img_data: this.Signature.select_signature.img_data,
          signature_img: this.Signature.select_signature.img_data,
          signature_id: this.Signature.select_signature.id,
          position: {
            top: text_H - 1.5 * 142 - 132,
            left: 426,
            width: 142,
            zindex: _signature_arr.length + 1,
          },
        });
        this.$store.commit("SET_DOCUMENT_PROCESS_signature", _signature_arr);
      }
    },

    //签章数据更新
    update_data(all_val) {
      if ([1, 2, 3].includes(this.Signature.tab_key)) {
        this.get_ele_index();
      } else {
        this.get_ele_me_list();
      }
    },

    //确认选择电子签章
    async Signature_choice_ok() {
      if (this.Signature.select_signature.is_pwd == 1) {
        this.pwd_visible = true;
      } else {
        this.Signature.list_visible = false;
        this.set_signature_data();
      }
    },

    //发送审核文件
    set_file_approval() {
      this.$store.commit("SET_FILE_APPROVAL", this.file.vuex_percent);
    },
    //通知选项输入验证
    time_set() {
      for (let key in this.get_process.msg_time) {
        if (!parseInt(this.get_process.msg_time[key])) {
          this.get_process.msg_time[key] = 0;
        } else {
          this.get_process.msg_time[key] = parseInt(
            this.get_process.msg_time[key]
          );
        }
      }

      if (this.get_process.msg_time.hour > 24) {
        this.get_process.msg_time.hour = 24;
      }
      if (this.get_process.msg_time.minute > 59) {
        this.get_process.msg_time.minute = 59;
      }
    },
    // 判断上传文件是否符合要求
    beforeUpload(file) {
      let _type = [
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
      return public_data_files(file, _type);
    },
    // 获取上传文件信息以及从后端获取token
    customRequest(files) {
      this.file.false_percent.push(files.file);
      this.file.that_reFresh = false;
      this.file.that_file_size = files.file.size;

      this.file.that_percent.suffix = files.file.type.split("/")[
        files.file.type.split("/").length - 1
      ];

      // 获取随机数
      let nums = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
      let timer = setInterval(() => {
        if (this.file.progress < nums) {
          this.file.progress += 1;
        } else {
          clearInterval(timer);
        }
      }, 100);
      this.file.upload_state = true;
      let { file } = files;

      randomnumber(files, this.saveFile);
    },
    // callback获取七牛云返回的数据
    saveFile(data) {
      this.file.progress = 100;

      this.file.progress = 0;
      setTimeout(() => {
        this.file.upload_state = false;
      }, 200);
      this.file.that_percent = data;
      //设置当前文件的后缀
      let suffix = data.data.key.split(".")[
        data.data.key.split(".").length - 1
      ];
      this.file.that_percent.suffix = suffix;

      if (this.file.quxiao_id !== data.uid) {
        this.file.vuex_percent.push({
          oldname: data.name,
          path: data.url + "/" + data.data.key,
          size: data.size,
          uid: data.uid,
          suffix,
        });
      }

      this.file.that_reFresh = true;
    },
    //查看，删除
    async look(item) {
      let suffix = item.oldname.split(".")[item.oldname.split(".").length - 1];
      this.look_path = item.path;

      if (suffix === "txt") {
        let data = await get_word({
          path: this.look_path,
          file_type: 1,
        });
        this.that_view_file_text = data.data;
        this.visible = true;
      } else if (suffix == "png" || suffix == "jpg") {
        window.open(this.look_path);
      } else {
        window.open(preview_url + "?src=" + this.look_path);
      }
    },
    dele(index) {
      this.$confirm({
        icon: "info-circle",
        title: "提示",
        content: "是否删除该文件？",
        okText: "确认",
        cancelText: "取消",
        onOk: async function () {
          this.file.vuex_percent.splice(index, 1);
        }.bind(this),
        onCancel() {},
      });
    },
    //取消正在上传
    quxiao() {
      //当已经向实际使用的数组中添加了数据的时候
      //那么就删除实际数据的内容
      if (this.file.that_percent.url) {
        let that_url =
          this.file.that_percent.url + "/" + this.file.that_percent.data.key;

        this.file.vuex_percent.forEach((el, inx) => {
          if (el.path == that_url) {
            this.file.vuex_percent.splice(inx, 1);
          }
        });
      }
      //当确实是因为网络等方面的问题，实际数据还没有该文件
      if (this.file.false_percent.length !== this.file.vuex_percent.length) {
        if (this.file.false_percent.length > 0) {
          this.file.quxiao_id = this.file.false_percent[
            this.file.false_percent.length - 1
          ].uid;
        }
      }
      this.file.that_reFresh = true;
      this.file.that_percent = {};
    },

    onChangeend(e) {
      this.invalid = !e.target.checked;
    },
    onChange() {},
    onChecknox(checkedValues) {},
    handleChange(info) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import url("../../../css/footerhandle.less");
.add-reply-spanNum {
  position: absolute;
  right: 30px;
  bottom: 80px;
  color: #c0c6cc;
}
.file-item{
  margin-bottom:0px !important;
  margin-right:0px !important;
  margin-top: 10px;
}
.p-content{
  padding:0 15px !important;
}
</style>