<template>
  <div>
    <Incoming v-if="all_data" :all_data="all_data" />
  </div>
</template>

<script>
import Incoming from "@/views/components/incoming/incomingexamine.vue";
import { manage_detail, del_manage } from "@/api/file_management.js";
import { procedure_journal } from "@/api/incoming.js";
export default {
  components: {
    Incoming,
  },
  data() {
    return {
      title_list: ["发文模板", "收文模板", "签报模板", "发文审核"],
      title: "发文审核",
      nav_list: [
        ["发文信息", "正文内容", "发文附件", "流程信息", "行为统计"],
        ["收文信息", "正文内容", "收文附件", "流程信息", "行为统计"],
        ["签报信息", "正文内容", "签报附件", "流程信息", "行为统计"],
      ],
      nav: [],
      //file_type判断是1发文/2收文/3签报
      //发送给子级的类别(主要是给发文、收文信息用)1发文，2收文，3签报

      //文件管理区类型area_type   1归档，2废弃，3传阅，4抄送
      son_type: null,
      //当前文的id
      id: null,

      manager: null,
      //发文信息
      fields: null,
      //正文
      content: "",
      //附件
      file_path: null,
      //传阅
      visible: false,
      confirmLoading: false,
      radio: 1,
      all_data: null,
    };
  },
  created() {
    this.$store.commit("RESET_Vuex_TOEXAMINE");
    this.$store.commit("SET_LEFTDATA_other_zhang", []);
    this.$store.commit("SET_LEFTDATA_use_signature", []);
    this.$store.commit("SET_FILE_percent", []);
    this.init();
    this.get_detail();

    //初始化使用的签章
    this.$store.commit("SET_LEFTDATA_use_signature", []);
  },
  methods: {
    //请求数据
    async get_detail() {
      let { code, data } = await manage_detail({
        id: this.id,
        cut: Number(this.$route.query.cut),
      });
      if (this.$route.query.file_type == 1) {
        this.title = "发文审核";
      } else if (this.$route.query.file_type == 2) {
        this.title = "收文审核";
      } else if (this.$route.query.file_type == 3) {
        this.title = "签报审核";
      }
      this.all_data = {
        data: {
          title: this.title,
          nav: this.nav,
          son_type: this.$route.file_type - 1,
          id: this.id,
          fields: data.fields,
          content: data.content,
          file_path: data.files_all.enclosure_file,
          create_time: data.create_time,
          signature: data.signature,
          process_urgent_level: data.process_urgent_level,
          status: data.status,
          template_info: data.template_info,
        },
        methods: {
          get_detail: this.get_detail,
          init: this.init,
          dele: this.dele,
          handleOk: this.handleOk,
          onSearch: this.onSearch,
        },
      };

      //处理发文信息数据
      let fields = {};
      //判断是下拉框还是输入框...（用于发文信息数据渲染）
      // form_type:1(输入框),2(下拉),3(不可修改)

      data.fields.forEach((el) => {
        fields[el.e_name] = el;
        if (el.e_name == "secret_level") {
          el.child = data.degree;
        }
        if (el.e_name == "urgent_level") {
          el.child = data.urgen_level;
        }
      });

      //设置签章（别人签的 ）
      this.$store.commit("SET_LEFTDATA_other_zhang", data.signature);
      this.status = data.status;
      // 设置vuex的is_fast快不快速发文
      this.$store.state.leftdata.is_fast = data.is_fast;
      // 设置vuex的process_id 流程id
      this.$store.state.leftdata.process_id = data.process_id;
      // 设置vuex的 审核 status
      this.$store.commit("SET_TOEXAMINE_status", data.status);

      // 设置vuex的 审核 auth
      this.$store.commit("SET_TOEXAMINE_auth", data.auth);
      // 设置vuex的 审核 btn 状态
      this.$store.commit("SET_TOEXAMINE_btn", data.button);
      // 设置vuex的 审核 where_id
      this.$store.commit("SET_TOEXAMINE_where_id", data.where_id);
      // 设置vuex的 发文信息数据
      this.$store.commit("SET_LEFTDATA_fields", fields);
      if (data.distribute_time) {
        this.$store.commit(
          "SET_LEFTDATA_FIELDS_distribute_time",
          data.distribute_time
        );
      }

      //设置套红模板内容
      this.$store.commit(
        "SET_TOEXAMINE_red_templete_content",
        data.red_templete_content
      );
      // 设置vuex的 正文内容数据
      this.$store.commit("SET_LEFTDATA_content", data.content);
      // 设置vuex的 模板id
      this.$store.commit("SET_LEFTDATA_templete_id", data.templete_id);
      // 设置vuex的 当前选择的部门id
      this.$store.commit("SET_LEFTDATA_deptid", data.dept_id);
      // 设置vuex的 公文的id 修改必填
      this.$store.commit("SET_LEFTDATA_id", data.id);
      // 设置vuex的 公文的id 修改必填
      this.$store.commit("SET_LEFTDATA_type", data.type);
      // 设置vuex的 公文分发记录id，如果是转收文，则必填
      this.$store.commit(
        "SET_LEFTDATA_distribute_id",
        data.distribute_id == null ? "" : data.distribute_id
      );
      //设置套红模板
      this.$store.commit("SET_LEFTDATA_red_template", data.redtemplete_list);
      this.$store.state.leftdata.word_no = {
        name: data.word_name,
        word_no: data.word_no,
        id: data.word_no_id,
      };
      // 向flowstate=>main=>里面传值(权限)
      this.$bus.$emit("set_flowstate_data", data.button);
    },

    //初始化
    init() {
      this.type = parseInt(this.$route.query.type);
      this.id = parseInt(this.$route.query.id);

      this.nav = this.nav_list[this.$route.query.file_type - 1];

      this.son_type = this.$route.query.file_type - 1;
    },
    // 点击取消，返回上一页
    reverts() {
      this.$router.go(-1);
    },

    //删除
    dele() {
      this.$confirm({
        icon: "info-circle",
        title: "提示",
        content: "是否删除该发文？",
        okText: "确认",
        cancelText: "取消",
        onOk: async function () {
          let { code } = await del_manage({ id: this.id });
          this.$router.go(-1);
        }.bind(this),
        onCancel() {},
      });
    },

    //传阅确定
    handleOk(e) {
      this.ModalText = "The modal will be closed after two seconds";
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
    },
  },
};
</script>

<style lang="less" scoped>
</style>