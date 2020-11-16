<template>
  <div>
    <Main :tabs="tabs" class="main" />
  </div>
</template>
<script>
let columnsone = [
  // 表单格式
  {
    title: "操作者",
    key: "people",
    dataIndex: "people"
  },
  {
    title: "接收时间",
    key: "time",
    dataIndex: "time",
    sorter: (a, b) => a.time.length - b.time.length
  },
  {
    title: "操作状态",
    key: "state",
    dataIndex: "state"
  },
  {
    title: "是否修改",
    key: "isstate",
    dataIndex: "isstate"
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
    state: "未查看",
    isstate: "否"
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
    state: "未查看",
    isstate: "否"
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
    state: "未查看",
    isstate: "否"
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
    state: "未查看",
    isstate: "否"
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
    state: "未查看",
    isstate: "否"
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
    state: "未查看",
    isstate: "否"
  }
];
import Main from "../../components/main.vue";
export default {
  name: "Flowlog",
  data() {
    return {
      tabs: {
        columns: columnsone,
        data
      }
    };
  },
  components: { Main },
  created() {},
  methods: {}
};
</script>
<style lang="less" scoped>
</style>