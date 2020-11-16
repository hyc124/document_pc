<template>
  <div class="addInpostrafts-footer-journal">
    <a-table :columns="columns" :data-source="data" :pagination="false">
      <span slot="operation" slot-scope="item,record">
        <div class="flex-col operation">
          <div :data-info="record">催办</div>
        </div>
      </span>
    </a-table>
  </div>
</template>
<script>
export default {
  name: "Journal",
  data() {
    return {
      data: null,
      columns: null
    };
  },
  components: {},
  created() {
    this.columns = [
      // 表单格式
      {
        title: "节点名称",
        dataIndex: "title",
        key: "title",
        scopedSlots: { customRender: "title" }
      },
      {
        title: "操作者",
        dataIndex: "people",
        key: "people"
      },
      {
        title: "接收时间",
        dataIndex: "time1",
        key: "time1",
        ellipsis: true,
        width: 331
      },
      {
        title: "操作时间",
        dataIndex: "time",
        key: "time",
        width: 345
      },
      {
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        scopedSlots: { customRender: "operation" },
        width: 110
      }
    ];
    // this.data = [
    //   {
    //     key: "1",
    //     title: "关于xxx处理",
    //     fontsize: 20203456,
    //     company: "总主办",
    //     people: "杨浩",
    //     time: "2020-03-31",
    //     time1: "2020-03-31",
    //     tounit: "普通",
    //     state: "未查看"
    //   },
    //   {
    //     key: "2",
    //     title: "关于xxx处理",
    //     fontsize: 20203456,
    //     company: "总主办",
    //     people: "杨浩",
    //     time: "2020-03-31",
    //     time1: "2020-03-31",
    //     tounit: "普通",
    //     state: "未查看"
    //   },
    //   {
    //     key: "3",
    //     title: "关于xxx处理",
    //     fontsize: 20203456,
    //     company: "总主办",
    //     people: "杨浩",
    //     time: "2020-03-31",
    //     time1: "2020-03-31",
    //     tounit: "紧急",
    //     state: "未查看"
    //   },
    //   {
    //     key: "4",
    //     title: "关于xxx处理",
    //     fontsize: 20203456,
    //     company: "总主办",
    //     people: "杨浩",
    //     time: "2020-03-31",
    //     time1: "2020-03-31",
    //     tounit: "紧急",
    //     state: "未查看"
    //   },
    //   {
    //     key: "5",
    //     title: "关于xxx处理",
    //     fontsize: 20203456,
    //     company: "总主办",
    //     people: "杨浩",
    //     time: "2020-03-31",
    //     time1: "2020-03-31",
    //     tounit: "加急",
    //     state: "未查看"
    //   },
    //   {
    //     key: "6",
    //     title: "关于xxx处理",
    //     fontsize: 20203456,
    //     company: "总主办",
    //     people: "杨浩",
    //     time: "2020-03-31",
    //     time1: "2020-03-31",
    //     tounit: "普通",
    //     state: "未查看"
    //   },
    //   {
    //     key: "7",
    //     title: "关于xxx处理",
    //     fontsize: 20203456,
    //     company: "总主办",
    //     people: "杨浩",
    //     time: "2020-03-31",
    //     time1: "2020-03-31",
    //     tounit: "普通",
    //     state: "未查看"
    //   },
    //   {
    //     key: "8",
    //     title: "关于xxx处理",
    //     fontsize: 20203456,
    //     company: "总主办",
    //     people: "杨浩",
    //     time: "2020-03-31",
    //     time1: "2020-03-31",
    //     tounit: "普通",
    //     state: "未查看"
    //   }
    // ];
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.addInpostrafts-footer-journal {
  min-height: 789px;
}
</style>