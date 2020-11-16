<template>
  <div>
    <a-affix :offset-top="64">
      <Maintitle :titleObj="titleObj" @go_back="back">
        <div class="flex-col head2">
          <div class="preview-tit" @click="preview_document">
            <i></i>
            <span>预览公文</span>
          </div>
        </div>
      </Maintitle>
    </a-affix>
    <Maincontent>
      <Header
        :verification_flag="verification_flag"
        :data="data"
        :head_need_data="head_need_data"
        class="mb"
        @SettingNotice="SettingNotice"
      />
      <Maintop class="mb" />
      <Enclosure class="mb" />
      <Footer class="mb" />
      <Setting
        :obj="data"
        v-show="is_show"
        class="mb"
        @GetRedTemplet="GetRedTemplet"
        @SettingNotice="SettingNotice"
      />
      <a-modal
        class="preview-modal"
        @cancel="onClose"
        v-model="ViewDocument.vis2"
        footer
      >
        <div id="print" ref="print">
          <ViewDocument
            :Popup="Popup"
            :ViewDocument="ViewDocument"
            :datas="$store.state.quick_draft"
            v-if="ViewDocument.vis2"
          />
        </div>
      </a-modal>
      <!-- 选择人员弹窗 -->
      <a-modal
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="preview_document(1)"
        @cancel="visible = false"
        title="人员选单"
        class="circulation"
        cancelText="取消"
        okText="确认"
      >
        <div>
          <Framelist
            :show_data_flag="show_data_flag"
            :range="visiblerange"
            :tag="tag"
            :restype="4"
          />
        </div>
      </a-modal>
      <a-affix :offset-bottom="0">
        <div class="btn-bg flex-col">
          <div class="set" :class="{ active: is_show }" @click="show_setting">
            规则设置
          </div>
          <div class="flex-col-bd"></div>
          <a-button
            class="postformworkset-herder-btn"
            type="primary"
            @click="preview_document(2)"
            >呈送</a-button
          >
          <a-button
            class="postformworkset-herder-btn"
            type="primary"
            @click="fenfa"
            >分发</a-button
          >
          <a-button
            class="postformworkset-herder-btn"
            type="primary"
            @click="release"
            >发布</a-button
          >
          <a-button
            class="postformworkset-herder-btn"
            type="primary"
            @click="chuanyue"
            >传阅</a-button
          >
          <a-button
            class="postformworkset-herder-btn"
            type="primary"
            v-show="get_all.process.approval_where.length > 0"
            @click="referto"
            >{{ $route.query.can_edit ? "重新提交" : "提交" }}</a-button
          >
          <a-dropdown placement="topCenter">
            <a-button style="margin-left: 20px">
              <a-icon class="more" type="unordered-list" />更多
            </a-button>
            <a-menu slot="overlay">
              <a-menu-item @click="preservation">存为草稿</a-menu-item>
              <a-menu-item @click="print">打印</a-menu-item>
              <a-menu-item @click="onDownload">下载</a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-affix>
    </Maincontent>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import Header from "./addcompoents/header.vue";
import Maintop from "./addcompoents/maintop.vue";
import Enclosure from "./addcompoents/enclosure.vue";
import Footer from "./addcompoents/footer.vue";
import Setting from "./addcompoents/setting.vue";
import {
  templete_information,
  document_information,
  check_word_wo_re,
} from "@/api/draft";
import {
  document_add_fast,
  urgent_type_list,
  secret_type_list,
} from "@/api/quick_post.js";
import Framelist from "@/views/sendout/draft/addcompoents/components/organization/framelist.vue";
import ViewDocument from "@/views/components/viewDocument.vue";
export default {
  name: "quickPost",
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: true, // 返回开关
      },
      visible: "",
      ViewDocument: {
        // 预览
        vis2: false,
        condition: false, // 是否是打印，如果是的话就要打开分页
        type: 1,
      },
      titleTxt: "", // 预览头部的分发/呈送/传阅的当前状态
      //传过来的id
      all_val: {
        id: null, //模板id
        d_id: null, //草稿箱id
      },
      test: null,
      //总数据
      data: {
        content_type: null,
        degree: null,
        fields: null,
        technological_process_id: null,
      },
      // 套红模板内容
      redTemplet: "",
      //紧急程度、密级程度数据
      radio_data: {
        urgent_level: "",
        secret_level: "",
      },
      //头部需要的数据
      head_need_data: null,
      //规则设置是否显示
      is_show: false,
      //传阅
      visible: false,
      confirmLoading: false,
      radio: 1,
      //传阅
      circulation: {
        tab: 1,
      },
      visiblerange: {
        visible: false, // 可见范围弹窗
        visual: [], // 弹窗
        visuals: [], // 不是弹框
      },
      btn_type: 1, // 哪个按钮打开了弹窗 1传阅 2分发
      tag: {
        tab: true,
        bm: true,
        pe: true,
        company: true,
        label: true,
        role: true,
        lately: true,
      },
      // 验证
      verification_flag: false,
      usernames: "", // 人员名字集合
      show_data_flag: false,
      // 跳转流程页面弹窗控制
      jumpPopup: {
        visible: false, // 弹窗开关
        centenText: "", // 打开的按钮
      },
      isok_word_no: false,

      Popup: {
        usernames: "",
        titleTxt: "",
        onSendOut: this.onSendOut,
        onClose: this.onClose,
        vis3: false,
      },
    };
  },
  components: {
    Maincontent,
    Maintitle,
    Header,
    Maintop,
    Enclosure,
    Footer,
    Setting,
    Framelist,
    ViewDocument,
  },
  created() {
    //销毁vuex里的内容
    this.$store.commit("SET_QUICK_DOCUMENT_ALL", {
      //头部值为后台传的每一个e_name
      header: {},
      //正文(内容，附件)
      content: {
        text: "",
        file: [],
      },
      //附件内容
      files: [],
      //流程
      process: {
        urgency: 1,
        department: "",
        liucheng_id: "null", //流程id
        red_template_model: {
          content: "",
          id: "",
          name: "",
        },
        opinion: "", //处理意见
        approval_file: [], //审批附件
        approval_where: [], //审批流程
        approval_copy: [], //抄送人员
        signature: [], //签章
        //指定下一个审批节点需要的数据
        approval_way: 2, //审批方式
        notice_way: [1, 4], //通知方式
      },
    });

    this.all_val = this.$route.query;
    if (this.all_val && this.all_val.d_id) {
      this.get_document_information();
    }
    //获取紧急程度密级程度
    this.get_urgent_type_list();
    this.get_secret_type_list();

    //意外退出保存草稿
    this.$bus.$on("SettingNotice", this.preservation);
  },
  mounted() {
    window.scrollTo(0, 0);
  },

  destroyed() {},
  computed: {
    //提交时获取vuex的数据
    get_all() {
      return this.$store.state.quick_draft;
    },

    get_now_time() {
      var date = new Date();
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    },
    get_miao() {
      let day_m = this.get_all.process.msg_time.day * 24 * 60 * 60;
      let hour_m = this.get_all.process.msg_time.hour * 60 * 60;
      let minute_m = this.get_all.process.msg_time.minute * 60;
      let all_time = day_m + hour_m + minute_m;
      return all_time;
    },
    // 获取权限
    jurisdiction() {
      let num;
      if (this.$route.query.type == 1) {
        num = 1;
      } else if (this.$route.query.type == 2) {
        num = 2;
      } else if (this.$route.query.type == 3) {
        num = 3;
      }
      return this.$store.state.jurisdiction[num];
    },

    //判断是否有流程
    // true=>有流程
    // false=>没流程
    has_process() {
      let approval_where_length = null;
      let approval_copy_length = null;
      if (this.get_all.process.approval_where) {
        approval_where_length = parseInt(
          this.get_all.process.approval_where.length
        );
      }
      if (this.get_all.process.approval_copy) {
        approval_copy_length = parseInt(
          this.get_all.process.approval_copy.length
        );
      }

      if (approval_where_length || approval_copy_length) {
        if (approval_where_length > 0 || approval_copy_length > 0) {
          return true; //选了流程
        } else {
          return false; //没选流程
        }
      }
      return false; //没选流程
    },

    //判断发文信息是否有值
    has_head_data() {
      let document_arr = [];
      for (let key in this.get_all.header) {
        document_arr.push({
          value: this.get_all.header[key].value,
          c_name: this.get_all.header[key].c_name,
          e_name: this.get_all.header[key].e_name,
        });
      }

      let judge = [];

      document_arr.forEach((el) => {
        if (el.value) {
          if (el.value.select) {
            if (el.value.select.length > 0 || el.value.text.length > 0) {
              judge.push({
                flag: true,
                c_name: el.c_name,
                e_name: el.e_name,
              });
            } else {
              judge.push({
                flag: false,
                c_name: el.c_name,
                e_name: el.e_name,
              });
            }
          } else if (el.e_name == "word_no") {
            if (el.value.id || el.value.name) {
              judge.push({
                flag: true,
                c_name: el.c_name,
                e_name: el.e_name,
              });
            } else {
              judge.push({
                flag: false,
                c_name: el.c_name,
                e_name: el.e_name,
              });
            }
          } else {
            judge.push({
              flag: true,
              c_name: el.c_name,
              e_name: el.e_name,
            });
          }
        } else {
          judge.push({
            flag: false,
            c_name: el.c_name,
            e_name: el.e_name,
          });
        }
      });

      let no = judge.filter((el) => !el.flag);

      if (no.length <= 0) {
        if (!/\p{Unified_Ideograph}/u.test(this.get_all.content.text)) {
          this.$message.error(`请完善正文内容,且正文内容应包含中文`);
          return false;
        }
        return true;
      } else {
        this.$message.error(`请完善${no[0].c_name}的内容`);
        return false;
      }
    },
  },
  methods: {
    // 关闭预览文件开关
    onClose() {
      this.ViewDocument.vis2 = false;
      this.Popup.vis3 = false;
      this.titleTxt = "";
    },
    //展示规则设置
    show_setting() {
      this.is_show = !this.is_show;
      if (this.is_show) {
        setTimeout(() => {
          document.getElementById("show_setting").scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    },
    //获取套红模板
    GetRedTemplet(text) {
      this.redTemplet = text;
    },
    //添加接口
    async go_document_add(status = "", button = "", NoJump = "111") {
      this.remind();

      //转时间
      let all_time = this.get_all.process.msg_time;

      //发文信息数据转换
      let document_arr = {};
      for (let key in this.get_all.header) {
        document_arr[key] = this.get_all.header[key].value || "";
      }

      document_arr.word_no = this.get_all.header.word_no.value.id;

      let approval_where = null;
      let users_ids = [];

      this.get_all.process.approval_where.forEach((el) => {
        users_ids.push(el.users[0].id);
      });

      if (this.get_all.process.liucheng_id == "next") {
        approval_where = [
          {
            users: [{ flag: 3, id: users_ids.join() }],
            approver_type: this.get_all.process.approval_way,
          },
        ];
      } else {
        approval_where = this.get_all.process.approval_where;
      }

      let process_id = "";
      if (
        this.get_all.process.liucheng_id &&
        this.get_all.process.liucheng_id != "next" &&
        this.get_all.process.liucheng_id != "null"
      ) {
        process_id = this.get_all.process.liucheng_id;
      }

      let red_templete_id = (red_templete_id =
        this.get_all?.process?.red_template_model?.id || "");

      //签章
      let signature_arr = [];
      this.get_all.process.signature.forEach((el) => {
        signature_arr.push({
          id:'',
          signature_base: el.signature_base,
          signature_img: el.signature_img,
          signature_id: el.signature_id,
          position: el.position,
        });
      });
      signature_arr.sort(function (a, b) {
        return a.position.zindex - b.position.zindex;
      });
      signature_arr.forEach((el, index) => {
        el.position.zindex = index;
      });
      let data = await document_add_fast({
        document_arr,
        content: this.get_all.content.text,
        content_file: JSON.stringify(this.get_all.content.file),
        enclosure_file: JSON.stringify(this.get_all.files),
        approval_where,
        approval_copy: this.get_all.process.approval_copy,
        status,
        button,
        arr: this.visiblerange.visual || "",
        handles: {
          opinion: this.get_all.process.opinion,
          files: JSON.stringify(this.get_all.process.approval_file),
          notice: 2,
          process_urgent_level: this.get_all.process.urgency,
          where_id: 0,
          way: this.get_all.process.notice_way.join(),
        },
        red_templete_id,
        deptid: this.get_all.process.department,
        process_id,
        signature_arr,
        word_no: this.get_all.header.word_no.value,
      });

      if (NoJump != "NoJump") {
        if (data.code == 1) {
          let _obj = {
            8: "/library",
            3: "/library",
            2: "/pending",
          };
          setTimeout(() => {
            this.$router.push({
              path: _obj[data.status],
            });
          }, 1000);
          this.visible = false;
        }
      }
    },
    
    
    //当是草稿的时候
    async get_document_information() {
      let { data } = await document_information({
        id: this.all_val.d_id,
      });

      //遍历设置头部在vuex的数据
      let head = {}; //发文模板头部字段
      this.test = JSON.parse(JSON.stringify(data.fields));
      data.fields.forEach((el) => {
        if (el.e_name == "secret_level") {
          el.child = data.degree;
        }
        if (el.e_name == "urgent_level") {
          el.child = data.urgen_level;
        }
        if (el.e_name == "word_no") {
          el.value = { id: data.word_no_id, name: data.word_no };
        }

        head[el.e_name] = el;
      });

      this.head_need_data = head;

      //设置vuex的数据（用于渲染发文原有的数据）
      //设置头部数据
      this.$store.commit("SET_QUICK_DOCUMENT_HEADER", head);

      //正文
      this.$store.commit("SET_QUICK_DOCUMENT_CONTENT", {
        text: data.content,
      });

      //设置签章
      this.$store.commit(
        "SET_QUICK_DOCUMENT_PROCESS_signature",
        data.signature
      );

      if (data.process.id == "") {
        this.$store.commit("SET_QUICK_DOCUMENT_PROCESS_liucheng", "next");
        data._approved = data.process.info[0].cc_info.map((el) => {
          el.type = 3;
          el.users = [
            {
              flag: 3,
              avatar: el.avatar,
              id: el.userid,
              name: el.name,
              dname: el.dname,
            },
          ];
          el.info = [
            {
              flag: 3,
              avatar: el.avatar,
              id: el.userid,
              name: el.name,
              dname: el.dname,
            },
          ];

          return el;
        });
        data._CCroved = data.process.info[0].cc_list;
      } else {
        //设置流程id
        this.$store.commit(
          "SET_QUICK_DOCUMENT_PROCESS_liucheng",
          data.technological_process_id
        );
      }

      //附件
      data.files_all.enclosure_file.forEach((el) => {
        el.oldname = el.old_name;
        el.suffix = el.old_name.split(".")[el.old_name.split(".").length - 1];
      });
      this.$store.commit(
        "SET_QUICK_DOCUMENT_FILES",
        data.files_all.enclosure_file
      );
      this.data = data;
    },
    //清空数据
    reset_data() {},
    //获取紧急程度密级程度
    async get_urgent_type_list() {
      let { data } = await urgent_type_list();
      this.radio_data.urgent_level = data.data;
    },
    async get_secret_type_list() {
      let { data } = await secret_type_list();
      this.radio_data.secret_level = data.data;
    },
    //下载、
    onDownload() {
      this.remind();
      this.ViewDocument.condition = false;
      this.ViewDocument.vis2 = true;
      setTimeout(() => {
        let data = this.getPdf("#print");
      }, 500);
      setTimeout(() => {
        this.ViewDocument.vis2 = false;
      }, 1000);
    },
    // 点击删除按钮，弹窗
    scrap() {
      this.visible = this.$confirm({
        title: "提示",
        content: "报废后数据不可恢复,是否继续？",
        okText: "确认",
        cancelText: "取消",
        icon: "info-circle",
        onOk: this.handleOk,
      });
    },
    // 删除弹窗确定按钮
    handleOk() {
      this.visible.destroy();
    },
    //预览公文
    preview_document(onOff) {
      this.ViewDocument.condition = false;
      let _text = "";
      if (onOff == 1) {
        this.visiblerange.visual.forEach((info) => {
          if (_text == "") {
            _text += info.title;
          } else {
            _text += "," + info.title;
          }
        });
        this.Popup.usernames = _text;
        this.Popup.vis3 = true;
      }
      if (onOff == 2) {
        this.ViewDocument.condition = false;
        this.Popup.titleTxt = "呈送";
        this.$store.state.quick_draft.header?.reviewer?.value?.select.forEach(
          (info) => {
            _text += info.name + ",";
          }
        );
        if (
          this.$store.state.quick_draft.header?.reviewer?.value?.text !=
            undefined &&
          this.$store.state.quick_draft.header?.reviewer?.value?.text != ""
        ) {
          _text +=
            "," + this.$store.state.quick_draft.header?.reviewer?.value?.text;
        }
        this.Popup.usernames = _text;
        this.Popup.vis3 = true;
      }
      this.visible = false;
      this.ViewDocument.vis2 = true;
      this.remind();
    },

    //发布
    release() {
      this.ViewDocument.condition = false;
      this.remind();
      if (this.has_head_data) {
        this.visiblerange = {
          visible: false, // 可见范围弹窗
          visual: [], // 弹窗
          visuals: [], // 不是弹框
        };
        this.go_document_add(2, 2);
      } else {
        this.verification_flag = true;
      }
    },
    // 预览头部确定按钮，呈送/分发/传阅
    onSendOut() {
      this.ViewDocument.vis2 = false;
      this.Popup.vis3 = false;
      if (this.Popup.titleTxt == "呈送") {
        this.forward_send();
      } else {
        this.handleOk_ren();
      }
    },
    //呈送
    forward_send() {
      this.ViewDocument.condition = false;
      this.remind();
      if (this.has_head_data) {
        this.visiblerange = {
          visible: false, // 可见范围弹窗
          visual: [], // 弹窗
          visuals: [], // 不是弹框
        };
        this.go_document_add(12, 4);
      } else {
        this.verification_flag = true;
      }
    },
    //提交传阅/分发
    handleOk_ren() {
      this.ViewDocument.condition = false;
      this.remind();
      if (this.has_head_data) {
        this.visiblerange.visual.forEach((el) => {
          switch (el.type) {
            //部门
            case 1:
              el.flag = 1;
              el.id = el.value;
              break;
            //人
            case 2:
              el.flag = 4;
              el.id = el.value;
              break;
            //标签
            case 4:
              el.flag = 2;
              el.id = el.value;
              break;
            //角色
            case 5:
              el.flag = 3;
              el.id = el.value;
              break;
            //发文收文单位
            case 3:
              el.flag = 5;
              el.id = el.value;
              break;
            //最近选择
            case 6:
              el.flag = 4;
              el.id = el.value;
              break;
          }
        });
        if (this.btn_type == 1) {
          this.go_document_add("", 5);
        }
        if (this.btn_type == 2) {
          this.go_document_add(3, 3);
        }
      } else {
        this.verification_flag = true;
      }
      this.visible = false;
    },
    //传阅
    chuanyue() {
      this.ViewDocument.condition = false;
      this.Popup.titleTxt = "传阅";
      this.visiblerange = {
        visible: false, // 可见范围弹窗
        visual: [], // 弹窗
        visuals: [], // 不是弹框
      };
      this.tag = {
        tab: true,
        bm: true,
        pe: true,
        company: true,
        label: true,
        role: true,
        lately: true,
      };
      this.btn_type = 1;
      this.visible = true;
    },

    // 分发按钮
    fenfa() {
      this.ViewDocument.condition = false;
      this.Popup.titleTxt = "分发";
      this.visiblerange = {
        visible: false, // 可见范围弹窗
        visual: [], // 弹窗
        visuals: [], // 不是弹框
      };
      this.btn_type = 2;
      this.tag = {
        tab: true,
        bm: true,
        pe: true,
        company: true,
        label: true,
        role: true,
        lately: true,
      };
      this.visible = true;
    },
    // 打印
    print() {
      this.ViewDocument.condition = true;
      this.ViewDocument.vis2 = true;
      this.remind();
      this.$nextTick(() => {
        this.$print(this.$refs.print);
      });
    },
    // 子组件通知父组件保存草稿
    SettingNotice() {
      this.go_document_add(8, 1, "NoJump");
    },
    // 保存草稿按钮
    preservation() {
      this.go_document_add(8, 1);
    },
    // 提交按钮
    referto() {
      this.remind();
      if (this.has_process) {
        this.verification_flag = true;
        if (this.has_head_data) {
          this.go_document_add("", 1);
        }
      } else {
        if (!/\p{Unified_Ideograph}/u.test(this.get_all.content.text)) {
          this.$message.error(`请完善正文内容,且正文内容应包含中文`);
        } else {
          this.go_document_add("", 1);
        }
      }
    },
    //叫组件提交数据到vuex
    remind() {
      this.$bus.$emit("document_header_quick");
      this.$bus.$emit("document_content_quick");
      this.$bus.$emit("document_files_quick");
      this.$bus.$emit("file_approval_quick");
      this.$bus.$emit("updata_approval_quick");
    },
    //返回
    back() {
      let _that = this;
      this.$confirm({
        title: "即将退出当前页面，是否需要保存本页面内容为草稿",
        okText: "保存草稿并跳转",
        onOk() {
          //叫发文保存草稿
          _that.preservation();
          _that.$router.go(-1);
        },
        onCancel() {
          _that.$router.go(-1);
        },
        class: "test",
      });
    },
  },
  watch: {
    visible() {
      this.show_data_flag = !this.show_data_flag;
    },
  },
};
</script>
<style lang="less" scoped>
.preview-title-box {
  display: flex;
  width: 0px;
  height: 30px;
  background: #ffffff;
  position: fixed;
  transform: translateX(50%);
  border-radius: 4px;
  top: 40px;
  z-index: 1001;
  right: 20%;
  overflow: hidden;
  opacity: 0;
  transition: all 0.1s;
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
.preview-modal {
  /deep/ .ant-modal-body {
    min-height: 800px;
    padding: 0;
  }
  /deep/ .ant-modal-content {
    width: 798px;
  }
}
.circulation {
  .ant-radio-group {
    .ant-radio-wrapper {
      margin-bottom: 20px;
    }
  }
  .nav {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 110px;
      height: 32px;
      background: rgba(245, 247, 250, 1);
      border: 1px solid rgba(220, 223, 230, 1);
      border-radius: 0px 2px 2px 0px;
      font-size: 16px;
      cursor: pointer;
    }
    .active {
      background: rgba(0, 130, 239, 1);
      border: none;
      color: white;
    }
  }
}
.view {
  position: fixed;
  top: 170px;
  right: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 59px;
  height: 59px;
  background: rgba(131, 156, 207, 1);
  box-shadow: 0px 0px 6px rgba(131, 156, 207, 0.5);
  border-radius: 50%;
  color: white;
}
.postformworkset-herder-btn {
  margin-left: 20px;
}

.maincontent {
  padding: 0px;
  background: rgba(246, 246, 246, 1);
}
.mb {
  padding: 20px 30px;
  margin-bottom: 15px;
}
.preview-tit {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  color: #3498db;
  border: 1px solid #3498db;
  width: 92px;
  height: 32px;
  font-size: 14px;
  cursor: pointer;
  i {
    width: 14px;
    height: 10px;
    background: url("../../../assets/adddraft/view.png");
    background-size: 14px 10px;
    margin-right: 5px;
  }
  span {
    display: flex;
    align-items: center;
    height: 32px;
    line-height: 0;
  }
}
.scrap {
  border-color: #e74c3c;
  color: #e74c3c;
}
.draft {
  border-color: #3498db;
  color: #3498db;
}
.title {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  background: rgba(246, 246, 246, 1);
  font-size: 18px;
  color: #303133;
  border-left: 3px solid rgba(0, 130, 239, 1);
  padding-left: 10px;
  margin-bottom: 20px;
}
.btn-bg {
  position: sticky;
  bottom: 0px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  width: 100%;
  height: 56px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  .set {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88px;
    height: 40px;
    opacity: 1;
    border-radius: 4px;
    background: #1890ff;
    color: white;
    cursor: pointer;
  }
}
.active {
  background: rgba(220, 223, 230, 1) !important;
  color: #606266 !important;
}
/deep/ .ant-modal {
  width: 793px !important;
}
/deep/#print {
  width: 750px;
  margin: 0 auto;
}

/deep/ .ant-affix {
  z-index: 999 !important;
}
</style>