<template>
  <div>
    <Maintitle :titleObj="titleObj" @go_back="reverts">
      <div>
        <a-button type="primary" class="bcbtn" @click="keep" v-if="!Edit">保存</a-button>
      </div>
    </Maintitle>
    <Maincontent>
      <div class="addformwork">
        <a-tabs default-active-key="1" @change="nums">
          <a-tab-pane key="1">
            <span slot="tab">
              <SvgIcon item="basicInfo" />
              <span class="addformwork-title">基本信息</span>
            </span>
            <newBasicinfo
              @compilename="onName"
              @compileonGenre="onGenre"
              @compileonRule="onRule"
              @compileonProcedure="onProcedure"
              @compileonCrimson="onCrimson"
              @compileonCrimsonName="onCrimsonName"
              :Listdata="Listdata"
            />
          </a-tab-pane>
          <a-tab-pane key="2">
            <span slot="tab">
              <SvgIcon item="分发发文" />
              <span class="addformwork-title">发文信息</span>
            </span>
            <PostInfo :PostInfo="PostInfo" />
          </a-tab-pane>
          <a-tab-pane key="3">
            <span slot="tab">
              <SvgIcon item="分发收文" />
              <span class="addformwork-title">正文内容</span>
            </span>
            <CenterText @compileonChangeMain="onChangeMain" :Listdata="Listdata" />
          </a-tab-pane>
          <a-tab-pane key="4">
            <span slot="tab">
              <SvgIcon item="linkIcon" />
              <span class="addformwork-title">附件内容</span>
            </span>
            <Enclosure :Listdata="Listdata" @compileonFujian="onFujian" />
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
import newBasicinfo from "./compilecomponents/newBasicinfo.vue";
import PostInfo from "@/views/applicationset/components/templateset/postinfo.vue";
import CenterText from "./compilecomponents/centertext.vue";
import Enclosure from "./compilecomponents/enclosure.vue";
import { Addpostinfo, Postinfo } from "@/api/applicationset.js";
export default {
  name: "AddFormWork",
  components: {
    newBasicinfo,
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
      num: 1,
      data: {
        temp_name: "", //用户名
        type: 1, //公文类别 公文类别id
        type_id: null,
        word_no: null, //字号id
        technological_process: null, //流程id
        red_template: null, //是否红头
        content_type: null, //正文类型
        document_arr: [], //发文字段信息
        custem_arr: [], //新增的自定义发文字段信息
        id: null,
        is_red: null,
        fujian: null, //附件
      },
      arr: [],
      Listdata: null, //模板详情
      setInfo: false, //判断用户是否修改了数据
      setdata: {
        //如果用户没有做任何修改 就发送这个数据
        temp_name: "", //用户名
        type: 1, //公文类别 公文类别id
        type_id: null,
        word_no: null, //字号id
        technological_process: null, //流程id
        red_template: null, //是否红头
        content_type: null, //正文类型
        document_arr: [], //发文字段信息
        custem_arr: [], //新增的自定义发文字段信息
        id: null,
        is_red: null,
        fujian: null, //附件
      },
      PostInfo: {
        bus: "compilesetworkdocument",
        type:1
      },
    };
  },
  created() {
    this.data.id = this.$route.query.id;
    this.getcompileList();
    this.oncustem();
    this.onbasicinfo();
    this.oncentertext();
    this.onenclosure();
    if (this.$route.query.edit && this.$route.query.edit == 1) {
      this.$route.meta.name = "预览发文模板";
    }
  },
  methods: {
    // 点击取消，返回上一页
    reverts() {
      this.$router.go(-1);
    },
    keep() {
      if (this.setInfo) {
        //修改的
        this.$bus.$emit("compileworksetgetdocument");
        this.$bus.$emit("worksetgetdocument");
        Addpostinfo(this.data).then((res) => {
          if (res.code == 1) {
            this.$router.go(-1);
          }
        });
      } else {
        //没有修改的
        Addpostinfo(this.setdata).then((res) => {
          if (res.code == 1) {
            this.$router.go(-1);
          }
        });
      }
    },
    // 点击tabs切换回调函数，表示在第几个tab表
    nums(el) {
      this.num = el;
      if (el !== 0) {
        this.$bus.$emit("compileworksetgetdocument");
      }
    },
    // 获取基本信息传来的数据
    // 姓名
    onName(val) {
      this.data.temp_name = val;
      this.setdata.temp_name = val;
    },
    // 字号规则
    onRule(val) {
      this.data.word_no = val;
      this.setdata.word_no = val;
    },
    // 发文类别名称
    onGenre(val) {
      this.data.type_id = val;
      this.setdata.type_id = val;
    },
    // 流程处理
    onProcedure(val) {
      this.data.technological_process = val;
      this.setdata.technological_process = val;
    },
    // 是否套红
    onCrimson(val) {
      this.data.is_red = val;
      this.setdata.is_red = val;
    },
    // 正文编辑方式
    onChangeMain(val) {
      this.setdata.content_type = val;
      this.data.content_type = val;
    },
    // 套红模板名称
    onCrimsonName(val) {
      this.data.red_template = val;
      this.setdata.red_template = val;
    },
    //附件
    onFujian(val) {
      this.data.fujian = val;
      this.setdata.fujian = val;
    },
    // 传来的字段信息
    oncustem() {
      this.$bus.$on("compilesetworkdocument", (val) => {
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
    //  传来的选择的东西
    onbasicinfo() {
      this.$bus.$on("compileworksetgetbasicinfo", (val) => {
        this.data.word_no = val.word_no_id;
        this.data.technological_process = val.process_id;
        this.data.is_red = val.is_red;
        this.data.type_id = val.type_id;
        this.data.temp_name = val.temp_name;
        this.data.red_template = val.red_template;
      });
    },
    //监听正文内容
    oncentertext() {
      this.$bus.$on("compileworksetgetcentertext", (val) => {
        this.data.content_type = val;
      });
    },
    //监听附件内容
    onenclosure() {
      this.$bus.$on("compileworksetgetonenclosure", (val) => {
        this.data.fujian = val;
      });
    },

    // 获取公文模板详情
    getcompileList() {
      Postinfo({ id: this.$route.query.id }).then((res) => {
        this.setdata.id = res.data.id;
        this.setdata.word_no = res.data.word_no_id;
        this.setdata.technological_process = res.data.technological_process_id;
        this.setdata.is_red = res.data.is_red;
        this.setdata.type_id = res.data.type_id;
        this.setdata.temp_name = res.data.temp_name;
        this.setdata.content_type = res.data.content_type;
        this.setdata.red_template = res.data.red_template_id;
        this.setdata.fujian = res.data.fujian;
        res.data.fields.map((v) => {
          if (v.is_system == 1) {
            let obj = {};
            obj.field_id = v.field_id;
            obj.is_must = v.is_must;
            this.setdata.document_arr.push(obj);
          } else {
            this.setdata.custem_arr.push({
              name: v.c_name,
              is_must: v.is_must,
            });
          }
        });
        this.Listdata = res.data;
      });
    },
  },
  computed: {
    Num() {
      return this.num;
    },
    Edit() {
      return this.$route.query.edit != undefined;
    },
  },
  watch: {
    Num(v) {
      return (this.setInfo = true);
    },
  },
};
</script>

<style lang="less" scoped>
.addformwork-title {
  font-weight: 900;
}
.addformwork {
  max-width: 1280px;
  position: relative;
}
.bcbtn {
  margin-left: 20px;
}
</style>