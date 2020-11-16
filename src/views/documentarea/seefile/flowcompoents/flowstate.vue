<template>
  <div>
    <div class="flowstate-tabs flex-db">
      <template v-for="(item, index) in flowstatetabs">
        <div
          class="flowstate-tabs-cl hand"
          :style="tabs_index==index?`background-color:${item.bgc}`:''"
          :key="index"
          @click="tabsclick(index)"
        >
          <div class="flowstate-tabs-cl-lf">
            <svg-icon :iconClass="tabs_index==index?item.img+'_active':item.img" />
          </div>
          <div class="flowstate-tabs-cl-rt">
            <span class="flowstate-tabs-cl-rt-num">{{item.num}}</span>
            <span>{{item.name}}</span>
          </div>
        </div>
      </template>
    </div>
    <div class="flows-table">
      <Main :tabs="tabs" class="main" />
    </div>
  </div>
</template>
<script>
let flowstatetabs = [
  {
    name: "总人次",
    num: 190,
    img: "file_Totalperson",
    bgc: "#71b9f5"
  },
  {
    name: "未查看",
    num: 198,
    img: "file_Notviewed",
    bgc: "#f27474"
  },
  {
    name: "已查看",
    num: 196,
    img: "file_Viewed",
    bgc: "#8ce7ee"
  },
  {
    name: "暂放",
    num: 195,
    img: "file_Notsubmitted",
    bgc: "#fbbd62"
  },
  {
    name: "已提交",
    num: 194,
    img: "file_Submitted",
    bgc: "#99e67e"
  },
  {
    name: "总催办次",
    num: 193,
    img: "file_General",
    bgc: "#b697d9"
  }
];
let columnsone = [
  // 表单格式
  {
    title: "节点名称",
    dataIndex: "title",
    key: "title",
    width: 180,
    ellipsis: true
  },
  {
    title: "操作者",
    key: "people",
    dataIndex: "people",
    width: 90
  },
  {
    title: "接收时间",
    key: "time",
    dataIndex: "time",
    width: 110,
    sorter: (a, b) => a.time.length - b.time.length
  },
  {
    title: "操作时间",
    key: "time1",
    dataIndex: "time1",
    width: 110,
    sorter: (a, b) => a.time.length - b.time.length
  },
  {
    title: "操作状态",
    key: "state",
    dataIndex: "state",
    width: 90
  }
];
let columnstwo = [
  // 表单格式
  {
    title: "公文标题",
    dataIndex: "title",
    key: "title",
    width: 180,
    ellipsis: true
  },
  {
    title: "收文字号",
    dataIndex: "fontsize",
    key: "fontsize",
    width: 110,
    sorter: (a, b) => a.time.length - b.time.length
  },
  {
    title: "来文单位",
    dataIndex: "company",
    key: "company",
    width: 150,
    ellipsis: true
  },
  {
    title: "收文日期",
    key: "time",
    dataIndex: "time",
    width: 110,
    sorter: (a, b) => a.time.length - b.time.length
  },
  {
    title: "紧急程度",
    key: "tounit",
    dataIndex: "tounit",
    width: 110
  },
  {
    title: "发文状态",
    key: "state",
    dataIndex: "state",
    width: 90
  }
];
let columnsthr = [
  // 表单格式
  {
    title: "公文标题",
    dataIndex: "title",
    key: "title",
    width: 180,
    ellipsis: true
  },
  {
    title: "签报字号",
    dataIndex: "fontsize",
    key: "fontsize",
    width: 110,
    sorter: (a, b) => a.time.length - b.time.length
  },
  {
    title: "拟稿人",
    key: "people",
    dataIndex: "people",
    width: 90
  },
  {
    title: "签报日期",
    key: "time",
    dataIndex: "time",
    width: 110,
    sorter: (a, b) => a.time.length - b.time.length
  },
  {
    title: "紧急程度",
    key: "tounit",
    dataIndex: "tounit",
    width: 110
  },
  {
    title: "收文状态",
    key: "state",
    dataIndex: "state",
    width: 90
  }
];
let data = [
  {
    key: "1",
    title: "关于xxx处理",
    fontsize: 20203456,
    company: "总主办",
    people: "杨浩",
    time: "2020-03-31",
    time1: "2020-03-31",
    tounit: "普通",
    state: "未查看"
  },
  {
    key: "2",
    title: "关于xxx处理",
    fontsize: 20203456,
    company: "总主办",
    people: "杨浩",
    time: "2020-03-31",
    time1: "2020-03-31",
    tounit: "普通",
    state: "未查看"
  },
  {
    key: "3",
    title: "关于xxx处理",
    fontsize: 20203456,
    company: "总主办",
    people: "杨浩",
    time: "2020-03-31",
    time1: "2020-03-31",
    tounit: "紧急",
    state: "未查看"
  },
  {
    key: "4",
    title: "关于xxx处理",
    fontsize: 20203456,
    company: "总主办",
    people: "杨浩",
    time: "2020-03-31",
    time1: "2020-03-31",
    tounit: "紧急",
    state: "未查看"
  },
  {
    key: "5",
    title: "关于xxx处理",
    fontsize: 20203456,
    company: "总主办",
    people: "杨浩",
    time: "2020-03-31",
    time1: "2020-03-31",
    tounit: "加急",
    state: "未查看"
  },
  {
    key: "6",
    title: "关于xxx处理",
    fontsize: 20203456,
    company: "总主办",
    people: "杨浩",
    time: "2020-03-31",
    time1: "2020-03-31",
    tounit: "普通",
    state: "未查看"
  },
  {
    key: "7",
    title: "关于xxx处理",
    fontsize: 20203456,
    company: "总主办",
    people: "杨浩",
    time: "2020-03-31",
    time1: "2020-03-31",
    tounit: "普通",
    state: "未查看"
  },
  {
    key: "8",
    title: "关于xxx处理",
    fontsize: 20203456,
    company: "总主办",
    people: "杨浩",
    time: "2020-03-31",
    time1: "2020-03-31",
    tounit: "普通",
    state: "未查看"
  }
];
import Main from "../../components/main.vue";
export default {
  name: "Flowstate",
  data() {
    return {
      flowstatetabs,
      tabs_index: 0,
      tabs: {
        columns: columnsone,
        data
      }
    };
  },
  components: {
    Main
  },
  created() {},
  methods: {
    tabsclick(e) {
      this.tabs_index = e;
    }
  }
};
</script>
<style lang="less" scoped>
.flowstate-tabs {
  .flowstate-tabs-cl {
    // flex: 1;
    width: 130px;
    height: 63px;
    background-color: #f5f7fa;
    padding: 10px;
    display: flex;
    align-items: center;
    .flowstate-tabs-cl-lf {
      font-size: 42px;
      line-height: 1;
    }
    .flowstate-tabs-cl-rt {
      height: 100%;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .flowstate-tabs-cl-rt-num {
        font-size: 18px;
        line-height: 1;
      }
    }
  }
}
.flows-table {
  margin: 15px 0;
}
</style>