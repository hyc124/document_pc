<template>
  <div class="addInpostrafts-footer-state" v-if="datas">
    <div class="flowstate-tabs flex-col">
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
      <a-table :columns="columns" :data-source="data" :pagination="false">
        <span slot="operation" slot-scope="item,record">
          <div class="flex-col operation">
            <div :data-info="record">提交</div>
          </div>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "State",
  props: {
    datas: {
      default: null,
    },
  },
  data() {
    return {
      tabs_index: 0,
      data: null,
      flowstatetabs: [
        {
          name: "总人次",
          num: 190,
          img: "file_Totalperson",
          bgc: "#71b9f5",
        },
        {
          name: "未查看",
          num: 0,
          img: "file_Notviewed",
          bgc: "#f27474",
        },
        {
          name: "已查看",
          num: 0,
          img: "file_Viewed",
          bgc: "#8ce7ee",
        },
        {
          name: "暂放",
          num: 0,
          img: "file_Notsubmitted",
          bgc: "#fbbd62",
        },
        {
          name: "已提交",
          num: 0,
          img: "file_Submitted",
          bgc: "#99e67e",
        },
        {
          name: "总催办次",
          num: 0,
          img: "file_General",
          bgc: "#b697d9",
        },
      ],
      columns: [
        // 表单格式
        {
          title: "节点名称",
          dataIndex: "title",
          key: "title",
          scopedSlots: { customRender: "title" },
        },
        {
          title: "操作者",
          dataIndex: "operator",
          key: "operator",
        },
        {
          title: "接收时间",
          dataIndex: "time1",
          key: "time1",
          ellipsis: true,
          width: 288,
        },
        {
          title: "操作时间",
          dataIndex: "time",
          key: "time",
          width: 273,
        },
        {
          title: "操作状态",
          dataIndex: "state",
          key: "state",
        },
        {
          title: "操作",
          key: "operation",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
          width: 110,
        },
      ],
    };
  },
  components: {},
  created() {
    this.list_data = this.datas;
    if (this.datas && this.datas.count) {
      this.get_data();
    }
  },
  methods: {
    // 数据设置
    get_data() {
      this.flowstatetabs[0].num = this.datas.count;
      var date = new Date();

      this.datas.data.forEach((el, index) => {
        let all_name = "";
        el.key = index;
        el.time1 = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        if (el.info) {
          el.info.forEach((el2, index2) => {
            all_name += el2.name + ",";
          });
          el.operator = all_name;
        }
      });

      this.data = this.datas.data;
    },
    tabsclick(e) {
      this.tabs_index = e;
    },
  },
  watch: {
    datas() {
      this.get_data();
    },
  },
};
</script>
<style lang="less" scoped>
.addInpostrafts-footer-state {
  min-height: 789px;
}
.flowstate-tabs {
  .flowstate-tabs-cl {
    width: 130px;
    height: 63px;
    background-color: #f5f7fa;
    padding: 10px;
    display: flex;
    align-items: center;
    margin-right: 15px;
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
  margin: 30px 0;
}
</style>