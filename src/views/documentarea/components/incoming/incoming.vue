<template>
  <div>
    <Incoming v-if="all_data" :all_data="all_data" />
  </div>
</template>

<script>
import Incoming from "@/views/components/incoming/incomingexamine.vue";
import { manage_detail, del_manage } from "@/api/file_management.js";
import { get_approval } from "@/api/incoming.js";
export default {
  components: {
    Incoming
  },
  data() {
    return {
      title_list: ["发文模板", "收文模板", "签报模板", "发文审核"],
      title: "发文审核",
      nav_list: [
        ["发文信息", "正文内容", "发文附件", "流程信息"],
        ["收文信息", "正文内容", "收文附件", "流程信息"],
        ["签报信息", "正文内容", "签报附件", "流程信息"]
      ],
      nav: [],

      //file_type判断是1发文/2收文/3签报

      //发送给子级的类别(主要是给发文、收文信息用)1发文，2收文，3签报
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

      all_data: null
    };
  },
  created() {
    this.init();
    this.get_detail();
  },
  methods: {
    //请求数据
    async get_detail() {
      let { code, data } = await manage_detail({ id: this.id });

      this.all_data = {
        data: {
          title: this.title,
          nav: this.nav,
          son_type: this.$route.file_type - 1,
          id: this.id,
          fields: data.fields,
          content: data.content,
          file_path: data.files_all.enclosure_file,
          iswastetank: this.$route.query.iswastetank
        },
        methods: {
          get_detail: this.get_detail,
          init: this.init,
          dele: this.dele,
          handleOk: this.handleOk,
          onSearch: this.onSearch
        }
      };
    },
    //初始化
    init() {
      this.type = parseInt(this.$route.query.type);
      this.id = parseInt(this.$route.query.id);
      // 5
      this.nav = this.nav_list[this.$route.query.file_type - 1];
      this.title = this.title_list[this.$route.query.file_type - 1];
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
        onOk: async function() {
          let { code } = await del_manage({ id: this.id });
          this.$router.go(-1);
        }.bind(this),
        onCancel() {}
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
  }
};
</script>

<style lang="less" scoped>
</style>