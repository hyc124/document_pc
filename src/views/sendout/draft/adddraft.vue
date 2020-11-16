<template>
  <div>
    <a-affix style="z-index: 12; position: relative" :offset-top="64">
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
        @reset_data="reset_data"
        :data="data"
        :head_need_data="head_need_data"
        :isok_word_no.sync="isok_word_no"
        class="mb"
        @SettingNotice="SettingNotice"
      />
      <!----------- 正文内容 ------------>
      <Maintop :data="data" class="mb" />
      <Enclosure class="mb" />
      <Footer :all_data="data" class="mb" />
      <Setting
        v-show="is_show"
        :all_data="data"
        class="mb"
        @SettingNotice="SettingNotice"
      />
      <a-modal
        class="preview-modal"
        @ok="ViewDocument.vis2 = false"
        v-model="ViewDocument.vis2"
        footer
      >
        <div id="print" ref="print">
          <ViewDocument
            :ViewDocument="ViewDocument"
            :datas="$store.state.document_all"
            v-if="ViewDocument.vis2"
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
            @click="referto"
            >{{ $route.query.can_edit ? "重新提交" : "提交" }}</a-button
          >
          <a-dropdown placement="topCenter">
            <a-button style="margin-left: 20px">
              <a-icon class="more" type="unordered-list" />更多
            </a-button>
            <a-menu slot="overlay">
              <a-menu-item v-if="powers('post_scrap')" @click="scrap"
                >报废</a-menu-item
              >
              <a-menu-item @click="preservation">存为草稿</a-menu-item>
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
  document_add,
  templete_information,
  document_information,
  document_wordno_manager,
  approval_scrap,
  check_word_wo_re,
} from "@/api/draft";
import ViewDocument from "@/views/components/viewDocument.vue";

//页面传参

//type值：1发文，2收文，3签报，5转发文，6转收文

//发文收文签报 id:发文模板id

//草稿：d_id:草稿发文的id，（草稿传过来的type类型还是1,2,3代表发文收文签报s
//驳回重新发：传过来的type类型还是1,2,3代表发文收文签报，d_id为驳回文章id  can_edit代表是否驳回

//只有驳回才会传&can_edit

//转发文：file_id：发过来的签报id，id:选择的模板id，类型默认为发文

//转收文：file_id：发过来的发文id，id:选择的模板id，类型默认为收文
export default {
  name: "AddDraft",
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
        type: this.$route.query.type,
      },
      //传过来的id
      all_id: {
        id: null, //模板id
        d_id: null, //草稿箱id
        type: null, //type类型
      },

      verification_flag: false, //验证
      //总数据
      data: {
        content_type: null,
        degree: null,
        fields: null,
        technological_process_id: null,
        red_templete_content: "",
      },

      //预览借助的数据
      preview: {},

      //头部需要的数据
      head_need_data: null,

      //规则设置是否显示
      is_show: false,

      // 跳转流程页面弹窗控制
      jumpPopup: {
        visible: false, // 弹窗开关
        centenText: "", // 打开的按钮
      },

      //当是草稿/驳回页面的时候需要用到的签章数据
      old_signature: [],

      isok_word_no: false,

      is_back: false,
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
    ViewDocument,
  },
  created() {
    this.reset_all_data();
    // 判断传入的类型改变标题
    if (this.$route.query.type == 1) {
      this.$route.meta.name = "发文拟稿";
    } else if (this.$route.query.type == 2) {
      this.$route.meta.name = "收文拟稿";
    } else if (this.$route.query.type == 3) {
      this.$route.meta.name = "签报拟稿";
    }
    this.all_id = this.$route.query;

    //判定是新建的还是从草稿箱过来的或者说是传阅过来的
    if (!this.all_id.id && !this.all_id.d_id) {
      this.$router.go(-1);
    }

    if ([1, 2, 3].includes(parseInt(this.all_id.type))) {
      if (this.all_id.d_id) {
        //获取草稿数据
        this.get_document_information();
      } else {
        //新建公文
        this.get_templete_information();
      }
    } else if (parseInt(this.all_id.type) == 6) {
      //获取公文交换的数据(收文)
      this.$route.meta.name = "公司收文模板";
      this.get_distribute_file_detail();
    } else if (parseInt(this.all_id.type) == 5) {
      this.get_distribute_file_detail();
      this.$route.meta.name = "公司发文模板";
    }
  },

  computed: {
    //判断是否有流程
    // true=>有流程
    // false=>没流程
    has_process() {
      let approval_where_length = this.get_all.process.approval_where.length;
      let approval_copy_length = this.get_all.process.approval_copy.length;
      if (approval_where_length > 0) {
        return true; //选了流程
      } else {
        return false; //没选流程
      }
    },
    // 获取当前选中模板数据
    Getredtemplat() {
      if (
        this.$store.state.document_all.process.red_template_model == undefined
      ) {
        return {
          content: "",
          id: "",
          name: "",
        };
      } else {
        return this.$store.state.document_all.process.red_template_model;
      }
    },
    SetRedId() {
      return this.$store.state;
    },
    //判断发文信息是否有值
    has_head_data() {
      let document_arr = [];
      for (let key in this.get_all.header) {
        document_arr.push({
          value: this.get_all.header[key].value,
          c_name: this.get_all.header[key].c_name,
          e_name: this.get_all.header[key].e_name,
          is_must: this.get_all.header[key].is_must,
        });
      }

      let judge = [];

      document_arr.forEach((el) => {
        let flag = null;
        if (el.value) {
          if (el.value.select) {
            if (el.value.select.length > 0 || el.value.text.length > 0) {
              flag = true;
            } else {
              if (el.is_must == 1) {
                flag = false;
              } else {
                flag = true;
              }
            }
          } else {
            flag = true;
          }
        } else {
          if (el.is_must == 1) {
            flag = false;
          } else {
            flag = true;
          }
        }
        judge.push({
          flag,
          c_name: el.c_name,
          e_name: el.e_name,
        });
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

    //提交时获取vuex的数据
    get_all() {
      return this.$store.state.document_all;
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
      if ([1, 5].includes(parseInt(this.$route.query.type))) {
        num = 1;
      } else if ([2, 6].includes(parseInt(this.$route.query.type))) {
        num = 2;
      } else if (this.$route.query.type == 3) {
        num = 3;
      }

      return this.$store.state.jurisdiction[num];
    },
    get_model() {
      return this.$store.state.document_all.header;
    },
  },
  destroyed() {},
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    //时间格式设置
    set_time(date) {
      var dt = new Date(date);
      var year = dt.getFullYear();
      var month = dt.getMonth() + 1;
      var day = dt.getUTCDate();

      var hours = dt.getHours();
      var minutes = dt.getMinutes();
      var seconds = dt.getSeconds();

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
    // 权限判断
    powers(text) {
      return this.jurisdiction.includes(text);
    },
    //添加接口
    async go_document_add(status = "", NoJump = "") {
      let templete_id = this.$route.query.id;
      //转时间
      let all_time = this.get_all.process.msg_time;
      //发文信息数据转换
      let document_arr = {};
      for (let key in this.get_all.header) {
        // if (
        //   key == "receiving_time" &&
        //   this.get_all.header[key].value &&
        //   this.get_all.header[key].value != ""
        // ) {
        //   this.get_all.header[key].value = this.set_time(
        //     this.get_all.header[key].value
        //   );
        // }
        if (
          (key == "issuer" || key == "received_delivery") &&
          this.get_all.header[key].input_type == 1
        ) {
          this.get_all.header[key].value = this.get_all.header[key].value.text;
        }
        document_arr[key] = this.get_all.header[key].value || "";
      }
      document_arr.word_no = this.get_all.header.word_no.value.id;
      let type = null;
      if ([1, 2, 3].includes(parseInt(this.$route.query.type))) {
        type = parseInt(this.$route.query.type);
      } else if (parseInt(this.$route.query.type) == 5) {
        type = 1;
      } else if (parseInt(this.$route.query.type) == 6) {
        type = 2;
      }
      // 公文分发记录id，
      let distribute_id = "";
      if (this.$route.query.file_id) {
        distribute_id = this.$route.query.file_id;
      }
      let red_templete_id = "";
      red_templete_id = this.get_all?.process?.red_template_model?.id;

      //签章
      // 当是草稿和驳回发文的时候判断老章的坐标位置是否发生改变
      let process_signature = JSON.parse(
        JSON.stringify(this.get_all.process.signature)
      );
      if (this.$route.query.d_id) {
        for (let i = 0; i < this.old_signature.length; i++) {
          process_signature.forEach((el, index) => {
            if (el.id == this.old_signature[i].id) {
              let _position1 = this.old_signature[i].position;
              let _position2 = el.position;
              if (
                _position1.left == _position2.left &&
                _position1.right == _position2.right &&
                _position1.width == _position2.width
              ) {
                process_signature.splice(index, 1);
              }
            }
          });
        }
      }

      let signature_arr = [];
      process_signature.forEach((el) => {
        if (el.handle) {
          signature_arr.push({
            id: "",
            signature_base: el.signature_base,
            signature_img: el.signature_img,
            signature_id: el.signature_id,
            position: el.position,
          });
        } else {
          signature_arr.push({
            id: "",
            signature_base: el.img_data,
            signature_img: el.img_data,
            signature_id: el.signature_id,
            position: el.position,
          });
        }
      });

      signature_arr.sort(function (a, b) {
        return a.position.zindex - b.position.zindex;
      });
      signature_arr.forEach((el, index) => {
        el.position.zindex = index;
      });
      let data = await document_add({
        templete_id,
        id: this.all_id.d_id || "",
        type,
        deptid: this.get_all.process.department || "",
        document_arr,
        content: this.get_all.content.text,
        content_file: JSON.stringify(this.get_all.content.file),
        enclosure_file: JSON.stringify(this.get_all.files),
        process_urgent_level: this.get_all.process.urgency,
        msg_time: this.get_miao,
        way: this.get_all.process.way.join(),
        approval_file: JSON.stringify(this.get_all.process.approval_file),
        opinion: this.get_all.process.opinion,
        status,
        distribute_id,
        approval_where: 1,
        approval_where: this.get_all.process.approval_where,
        approval_copy: this.get_all.process.approval_copy,
        red_templete_id,
        signature_arr,
        distribute_id: this.$route.query.distribute_id || "",
        word_no: this.get_all.header.word_no.value,
      });
      if (data.code == 1) {
        let url = "";
        if ([7, 8].includes(status)) {
          switch (parseInt(this.all_id.type)) {
            case 1:
              url = "/library";
              break;
            case 2:
              url = "/getlibrary";
              break;
            case 3:
              url = "/signeddraft";
              break;
            default:
              url = "/library";
          }
        } else {
          switch (parseInt(this.all_id.type)) {
            case 1:
              url = "/library";
              break;
            case 2:
              url = "/getlibrary";
              break;
            case 3:
              url = "/signlibrary";
              break;
            case 5:
              url = "/library";
              break;
            case 6:
              url = "/getlibrary";
              break;
            default:
              url = "/library";
          }
        }
        if (NoJump != "NoJump") {
          this.$router.push({
            path: url,
          });
        }
      } else {
        return 1;
      }
    },
    //模板详情
    async get_templete_information() {
      let { data } = await templete_information({
        id: this.all_id.id,
      });
      //遍历设置头部在vuex的数据
      let head = {};
      this.radio_data = {
        urgent_level: data.urgen_level,
        secret_level: data.degree,
      };
      data.fields.forEach((el) => {
        el.value = undefined;

        if (el.e_name == "secret_level") {
          el.child = data.degree;
          if (
            this.radio_data.urgent_level.length != 0 &&
            this.radio_data.urgent_level.length != undefined
          ) {
            el.value = this.radio_data.secret_level[0].id;
          }
        }
        if (el.e_name == "urgent_level") {
          el.child = data.urgen_level;
          if (
            this.radio_data.secret_level.length != 0 &&
            this.radio_data.secret_level.length != undefined
          ) {
            el.value = this.radio_data.urgent_level[0].id;
          }
        }
        if (el.e_name == "word_no") {
          el.value = { id: data.word_no_id, word_no: data.word_no };
        }
        head[el.e_name] = el;
      });
      this.head_need_data = JSON.parse(JSON.stringify(head));

      this.$store.commit("SET_DOCUMENT_HEADER", head);
      if (data.technological_process_id) {
        this.$store.commit(
          "SET_DOCUMENT_PROCESS_liucheng",
          data.technological_process_id
        );
      }

      //设置字号
      this.$store.commit("SET_DOCUMENT_WORD_NO", data.word_no);
      this.$store.commit("SET_DOCUMENT_WORD_NO_ID", data.word_no_id);

      //设置默认套红模板
      data.redtemplete_list.forEach((el) => {
        if (el.id == parseInt(data.red_template_id)) {
          this.$store.commit("SET_REDTEMPLATEDATA", el);
        }
      });

      this.data = data;
    },
    //公文详情(获取草稿箱数据)
    async get_document_information() {
      let { data } = await document_information({
        id: this.all_id.d_id,
      });
      let data2 = await templete_information({
        id: data.templete_id,
      });

      data.content_type = data2.data.content_type;
      data.redtemplete_list.forEach((item) => {
        if (item.id == data.red_templete) {
          this.$store.commit("SET_REDTEMPLATEDATA", item);
        }
      });
      //遍历设置头部在vuex的数据
      let head = {}; //发文模板头部字段

      data.fields.forEach((el) => {
        if (el.e_name == "secret_level") {
          el.child = data.degree;
        }
        if (el.e_name == "urgent_level") {
          el.child = data.urgen_level;
        }
        if (el.e_name == "word_no") {
          el.value = { id: data.word_no_id, name: el.value };
        }

        head[el.e_name] = el;
      });
      this.radio_data = {
        urgent_level: data.urgen_level,
        secret_level: data.degree,
      };

      //设置默认套红模板
      data.redtemplete_list.forEach((el) => {
        if (el.id == parseInt(data.red_template_id)) {
          this.$store.commit("SET_REDTEMPLATEDATA", el);
        }
      });
      this.data = data;

      this.head_need_data = JSON.parse(JSON.stringify(head));

      this.old_signature = JSON.parse(JSON.stringify(data.signature));

      //设置vuex的数据（用于渲染发文原有的数据）
      //设置头部数据
      this.$store.commit("SET_DOCUMENT_HEADER", head);

      //正文
      this.$store.commit("SET_DOCUMENT_CONTENT", {
        text: data.content,
      });
      // 设置流程
      if (data.technological_process_id) {
        this.$store.commit(
          "SET_DOCUMENT_PROCESS_liucheng",
          data.technological_process_id
        );
      }
      //设置默认套红模板
      data.redtemplete_list.forEach((el) => {
        if (el.id == parseInt(data.red_template_id)) {
          this.$store.commit("SET_REDTEMPLATEDATA", el);
        }
      });

      // 设置字号
      this.$store.commit("SET_DOCUMENT_WORD_NO", data.word_no);
      this.$store.commit("SET_DOCUMENT_WORD_NO_ID", data.word_no_id);

      //设置签章
      this.$store.commit("SET_DOCUMENT_PROCESS_signature", data.signature);
      //附件
      data.files_all.enclosure_file.forEach((el) => {
        el.oldname = el.old_name;
        el.suffix = el.old_name.split(".")[el.old_name.split(".").length - 1];
      });
      this.$store.commit("SET_DOCUMENT_FILES", data.files_all.enclosure_file);
    },

    //获取公文交换(转收发文)数据
    async get_distribute_file_detail() {
      let { data } = await document_information({
        id: this.all_id.file_id,
        flag: this.$route.query.distribute_id,
      });
      let data2 = await templete_information({
        id: this.all_id.id,
      });
      let head = {}; //发文模板头部字段

      if (data.technological_process_id) {
        this.$store.commit(
          "SET_DOCUMENT_PROCESS_liucheng",
          data.technological_process_id
        );
      }

      data2.data.fields.forEach((el) => {
        if (el.e_name == "secret_level") {
          el.child = data.degree;
        }
        if (el.e_name == "urgent_level") {
          el.child = data.urgen_level;
        }

        if (el.e_name == "word_no") {
          el.value = { id: data.word_no_id, word_no: data.word_no };
        }
        head[el.e_name] = el;
      });
      this.radio_data = {
        urgent_level: data.urgen_level,
        secret_level: data.degree,
      };

      let head2 = {}; //转收文的数据

      data.fields.forEach((el) => {
        head2[el.e_name] = JSON.parse(JSON.stringify(el));
      });

      data.fields.forEach((el) => {
        if (head[el.e_name]) {
          head[el.e_name].value = el.value;
        }
        if (el.e_name == "secret_level") {
          head[el.e_name].child = data.degree;
        }
        if (el.e_name == "urgent_level") {
          head[el.e_name].child = data.urgen_level;
        }
        if (el.e_name == "word_no") {
          head[el.e_name].value = { id: data.word_no_id, word_no: el.value };
        }
      });
      data.get_document_fields.forEach((el) => {
        if (head[el.e_name]) {
          if (
            ["issuer", "received_delivery"].includes(el.e_name) &&
            this.all_id.type == 6
          ) {
            let _text = [];
            if (typeof el.value == "string") {
              head[el.e_name].value = el.value;
            } else {
              el.value.select.forEach((el) => {
                _text.push(el.name);
              });
              _text = _text.join() + el.value.text;
              head[el.e_name].value = _text;
            }
          } else {
            head[el.e_name].value = el.value;
          }
        }
      });

      this.data = data2.data;

      this.head_need_data = JSON.parse(JSON.stringify(head));

      //设置vuex的数据（用于渲染发文原有的数据）
      //设置头部数据
      this.$store.commit("SET_DOCUMENT_HEADER", head);

      // 设置流程
      if (data.technological_process_id) {
        this.$store.commit(
          "SET_DOCUMENT_PROCESS_liucheng",
          data.technological_process_id
        );
      }

      //设置字号
      this.$store.commit("SET_DOCUMENT_WORD_NO", data.word_no);
      this.$store.commit("SET_DOCUMENT_WORD_NO_ID", data.word_no_id);
      data.signature.forEach((el) => {
        delete el.id;
      });
      //设置签章
      this.$store.commit("SET_DOCUMENT_PROCESS_signature", data.signature);

      //设置默认套红模板
      data.redtemplete_list.forEach((el) => {
        if (el.id == parseInt(data.red_template_id)) {
          this.$store.commit("SET_REDTEMPLATEDATA", el);
        }
      });

      //正文
      this.$store.commit("SET_DOCUMENT_CONTENT", {
        text: data.content,
      });

      if (data.distribute_time) {
        this.$store.commit(
          "SET_DOCUMENT_distribute_time",
          data.distribute_time
        );
      }

      //附件
      data.files_all.enclosure_file.forEach((el) => {
        el.oldname = el.old_name;
        el.suffix = el.old_name.split(".")[el.old_name.split(".").length - 1];
      });
      this.$store.commit("SET_DOCUMENT_FILES", data.files_all.enclosure_file);
    },

    //清空数据
    reset_data() {},

    //清空全部数据
    reset_all_data() {
      this.$store.commit("SET_DOCUMENT_ALL_DATA", {
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
          department: null,
          msg_time: {
            day: null,
            hour: null,
            minute: null,
          },
          way: [1, 4],
          notice: false,
          liucheng_id: null,
          red_template_model: {
            content: "",
            id: "",
            name: "",
          }, //套红模板id
          opinion: null, //处理意见
          approval_file: [], //审批附件
          approval_where: [], //审批流程
          signature: [], //签章
        },
      });
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
    async handleOk() {
      this.visible.destroy();
      this.remind();
      if (this.has_head_data) {
        if (!this.has_process) {
          this.$message.error(`请选择流程节点`);
          return;
        }
        if (this.head_need_data.word_no.is_must == 1) {
          let { code } = await check_word_wo_re({
            word_no: this.get_model.word_no.value.word_no,
            id: this.$route.query.d_id || "",
          });
          if (code == 1) {
            this.isok_word_no = false;
          } else {
            this.isok_word_no = true;
          }
          if (!this.isok_word_no) {
            this.go_document_add(7);
          }
        } else {
          this.go_document_add(7);
        }
      } else {
        this.verification_flag = true;
      }
    },
    //预览公文
    preview_document() {
      this.ViewDocument.vis2 = true;
      this.remind();
    },
    // 打印
    print() {
      this.ViewDocument.vis2 = true;
      this.remind();
      setTimeout(() => {
        this.$print(this.$refs.print);
      });
    },
    // 子组件通知父组件保存草稿
    SettingNotice() {
      this.remind();
      this.go_document_add(8, "NoJump");
    },
    // 保存草稿按钮
    async preservation() {
      this.remind();
      if (this.head_need_data.word_no.is_must == 1) {
        let { code } = await check_word_wo_re({
          word_no: this.get_model.word_no.value.word_no,
          id: this.$route.query.d_id || "",
          type: 2,
        });
        if (code == 1) {
          this.isok_word_no = false;
        } else {
          this.isok_word_no = true;
        }
        if (!this.isok_word_no) {
          let code = this.go_document_add(8);
          if (code == 1) {
            return 1;
          }
        }
      } else {
        let code = this.go_document_add(8);
        if (code == 1) {
          return 1;
        }
      }
    },
    // 提交按钮
    async referto() {
      this.remind();
      if (this.has_head_data) {
        if (!this.has_process) {
          this.$message.error(`请选择流程节点`);
          return;
        }
        if (this.head_need_data.word_no.is_must == 1) {
          let { code } = await check_word_wo_re({
            word_no: this.get_model.word_no.value.word_no,
            id: this.$route.query.d_id || "",
            type: 2,
          });
          if (code == 1) {
            this.isok_word_no = false;
          } else {
            this.isok_word_no = true;
          }
          if (!this.isok_word_no) {
            this.go_document_add();
          }
        } else {
          this.go_document_add();
        }
      } else {
        this.verification_flag = true;
      }
    },
    //叫组件提交数据到vuex
    remind() {
      this.$bus.$emit("document_header");
      this.$bus.$emit("document_content");
      this.$bus.$emit("document_files");
      this.$bus.$emit("file_approval");
      this.$bus.$emit("updata_approvals");
    },

    //返回
    back() {
      let _that = this;
      this.$confirm({
        title: "即将退出当前页面，是否需要保存本页面内容为草稿",
        okText: "保存草稿并跳转",
        onOk() {
          //叫发文保存草稿
          let code = _that.preservation();
          if (!code) {
            _that.$router.go(-1);
          }
        },
        onCancel() {
          _that.$router.go(-1);
        },
        class: "test",
      });
    },
  },
};
</script>
<style lang="less" scoped>
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

/deep/ .ant-modal {
  width: 793px !important;
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
.postformworkset-herder-btn {
  margin-left: 20px;
}

.maincontent {
  position: relative;
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
.postformworkset-bott-btn-box {
  width: 1280px;
  height: 60px;
  background: #ffffff;
  margin-bottom: 15px;
  padding: 0 20px;
}
/deep/#print {
  width: 750px;
  margin: 0 auto;
}
/deep/ .ant-affix {
  z-index: 999 !important;
}
</style>