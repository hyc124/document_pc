
<template>
  <div>
    <Maintitle :titleObj="titleObj" @go_back="reverts">
      <div>
        <a-button type="primary" class="bcbtn" @click="keep">保存</a-button>
      </div>
    </Maintitle>
    <Maincontent>
      <div class="addgetformworkset">
        <a-tabs default-active-key="1" @change="nums">
          <a-tab-pane key="1">
            <span slot="tab">
              <SvgIcon item="basicInfo" />
              <span class="addformwork-title">基本信息</span>
            </span>
            <BasicInfo
              @getformaddname="onName"
              @getformaddonGenre="onGenre"
              @getformaddonRule="onRule"
              @getformaddonProcedure="onProcedure"
              @getformaddonCrimson="onCrimson"
              @getformaddonCrimsonName="onCrimsonName"
            />
          </a-tab-pane>
          <a-tab-pane key="2">
            <span slot="tab">
              <SvgIcon item="分发发文" />
              <span class="addformwork-title">收文信息</span>
            </span>
            <PostInfo :PostInfo="PostInfo" />
          </a-tab-pane>
          <a-tab-pane key="3">
            <span slot="tab">
              <SvgIcon item="分发收文" />
              <span class="addformwork-title">正文内容</span>
            </span>
            <CenterText @getformaddonChangeMain="onChangeMain" />
          </a-tab-pane>
          <a-tab-pane key="4">
            <span slot="tab">
              <SvgIcon item="linkIcon" />
              <span class="addformwork-title">附件内容</span>
            </span>
            <Enclosure @onChangeEnclosure="onEnclosure" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </Maincontent>
  </div>
</template>

<script>
import SvgIcon from "@/views/components/svgicon.vue";
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import BasicInfo from "./addgetformworkset/basicinfo.vue";
import PostInfo from "@/views/applicationset/components/templateset/postinfo.vue";
import CenterText from "./addgetformworkset/centertext.vue";
import { Addpostinfo } from "@/api/applicationset.js";
import Enclosure from "./addgetformworkset/enclosure.vue";
export default {
  name: "AddGetFormWorkSet",
  components: {
    BasicInfo,
    PostInfo,
    CenterText,
    Enclosure,
    Maintitle,
    Maincontent,
    SvgIcon,
  },
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: true, // 返回开关
      },
      num: 0,
      data: {
        temp_name: "", //用户名
        type: 2, //公文类别 公文类别id
        type_id: null,
        word_no: null, //字号id
        technological_process: null, //流程id
        red_template: null, //是否红头
        content_type: null, //正文类型
        custem_arr: null, //新增的自定义字段信息
        document_arr: [], //发文字段信息
        custem_arr: [], //新增的自定义发文字段信息
        fujian: 1, // 附件的内容
      },
      arr: [],
      PostInfo: {
        type: 2,
        bus: "getformaddsetworkdocument",
      },
      templateId: "", // 当前设置成功的模板id
    };
  },
  created() {
    this.oncustem();
    // 接收传来的正文编辑方式
    this.$bus.$on("getformaddworksetgetcontentvalue", (val) => {
      this.data.content_type = val;
    });
  },
  methods: {
    // 点击取消，返回上一页
    reverts() {
      this.$router.go(-1);
    },
    // 保存按钮
    keep() {
      this.$bus.$emit("worksetgetdocument");
      this.$bus.$emit("getformaddworksetgetdocument");
      Addpostinfo(this.data).then((res) => {
        if (res.code == 1) {
          this.templateId = res.id;
          this.visible = this.$confirm({
            title: "提示",
            content: "保存成功，是否立即使用模板拟稿？",
            okText: "确认",
            cancelText: "取消",
            icon: "info-circle",
            onOk: this.onHandleOk,
            onCancel: this.onHandleNo,
          });
        }
      });
    },
    // 是否立即使用弹窗 取消按钮
    onHandleNo() {
      this.visible = false;
      this.$router.go(-1);
    },
    // 是否立即使用弹窗 取消按钮
    onHandleOk() {
      this.$router.push({
        path: "/draft/addDraft",
        query: { type: 2, id: this.templateId },
      });
    },
    // 点击tabs切换回调函数，表示在第几个tab表
    nums(el) {
      this.num = el;
      if (el !== 0) {
        this.$bus.$emit("getformaddworksetgetdocument");
        this.$bus.$emit("worksetgetdocument");
      }
    },
    // 获取基本信息传来的数据
    // 姓名
    onName(val) {
      this.data.temp_name = val;
    },
    // 字号规则
    onRule(val) {
      this.data.word_no = val;
    },
    // 发文类别名称
    onGenre(val) {
      // this.data.type = val;
      this.data.type_id = val;
    },
    // 流程处理
    onProcedure(val) {
      this.data.technological_process = val;
    },
    // 是否套红
    onCrimson(val) {
      this.data.is_red = val;
    },
    // 正文编辑方式
    onChangeMain(val) {
      this.data.content_type = val;
    },
    // 套红模板名称
    onCrimsonName(val) {
      this.data.red_template = val;
    },
    //附件内容修改方式
    onEnclosure(val) {
      this.data.fujian = val;
    },
    // 传来的字段信息
    oncustem() {
      this.$bus.$on("getformaddsetworkdocument", (val) => {
        val.document_arr.map((v) => {
          if (v.is_must) {
            v.is_must = 1;
          } else {
            v.is_must = 0;
          }
        });
        this.data.document_arr = val.document_arr;
        this.data.custem_arr = val.custem_arr;
      });
    },
  },
  computed: {
    Num() {
      return this.num;
    },
  },
  watch: {
    Num(v) {
      this.oncustem();
      this.$bus.$emit("getformaddworksetgetdocument");
      this.$bus.$emit("getformaddworksetgetcontent");
    },
  },
};
</script>

<style lang="less" scoped>
.addformwork-title {
  font-weight: 900;
}
.addgetformworkset {
  max-width: 1280px;
  position: relative;
}
.bcbtn {
  margin-left: 20px;
}
</style>