<template>
  <div class="flowstate">
    <div class="flowstate-tabs flex-db">
      <template v-for="(item, index) in flowstatetabs">
        <div
          class="flowstate-tabs-cl hand"
          :style="tabs_index == item.inx ? `background-color:${item.bgc}` : ''"
          :key="index"
          @click="tabsclick(item.inx)"
        >
          <div class="flowstate-tabs-cl-lf">
            <svg-icon
              :iconClass="
                tabs_index == item.inx ? item.img + '_active' : item.img
              "
            />
          </div>
          <div class="flowstate-tabs-cl-rt">
            <span class="flowstate-tabs-cl-rt-num">{{ item.num }}</span>
            <span>{{ item.c_name }}</span>
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
let columnsone = [
  // 表单格式
  {
    title: "节点名称",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    width: 130,
  },
  {
    title: "操作者",
    key: "operation",
    dataIndex: "operation",
    ellipsis: true,
    width: 100,
  },
  {
    title: "接收时间",
    key: "create_time",
    dataIndex: "create_time",
    sorter: (a, b) => a.create_time.length - b.create_time.length,
    ellipsis: true,
  },
  {
    title: "操作时间",
    key: "update_time",
    dataIndex: "update_time",
    sorter: (a, b) => a.update_time.length - b.update_time.length,
    ellipsis: true,
  },
  {
    title: "操作状态",
    key: "handle",
    dataIndex: "handle",
    ellipsis: true,
    customRender: (item) => {
      let arrys = {
        1: "未查看",
        2: "已查看",
        3: "暂放",
        4: "已提交",
      };
      return arrys[item] == undefined ? "未记录" : arrys[item];
    },
    width: 120,
  },
  {
    title: "操作",
    key: "operations",
    dataIndex: "operations",
    scopedSlots: { customRender: "operations" },
    ellipsis: true,
    width: 80,
  },
];
let columnstwo = [
  // 表单格式
  {
    title: "催办人",
    dataIndex: "fromuser",
    key: "fromuser",
    ellipsis: true,
  },
  {
    title: "催办时间",
    key: "create_time",
    dataIndex: "create_time",
    ellipsis: true,
    sorter: (a, b) => a.create_time.length - b.create_time.length,
  },
  {
    title: "被催办人",
    key: "touser",
    dataIndex: "touser",
    ellipsis: true,
  },
  {
    title: "催办总次数",
    key: "num",
    dataIndex: "num",
    ellipsis: true,
  },
];
import Main from "./main.vue";
import { procedure_journal, urge_list } from "@/api/incoming.js";
export default {
  name: "Flowstate",
  data() {
    return {
      flowstatetabs: [
        {
          name: "count",
          c_name: "总人次",
          num: 190,
          inx: 6,
          img: "file_Totalperson",
          bgc: "#71b9f5",
        },
        {
          name: "weikan",
          c_name: "未查看",
          num: 195,
          inx: 1,
          img: "file_Notviewed",
          bgc: "#f27474",
        },
        {
          name: "yikan",
          c_name: "已查看",
          num: 193,
          inx: 2,
          img: "file_Viewed",
          bgc: "#8ce7ee",
        },
        {
          name: "zanfang",
          c_name: "暂放",
          num: 196,
          inx: 3,
          img: "file_Notsubmitted",
          bgc: "#fbbd62",
        },
        {
          name: "yijiao",
          c_name: "已提交",
          num: 194,
          inx: 4,
          img: "file_Submitted",
          bgc: "#99e67e",
        },
        {
          name: "urge",
          c_name: "总催办次",
          num: 198,
          inx: 5,
          img: "file_General",
          bgc: "#b697d9",
        },
      ],
      tabs_index: 6,
      tabs: {
        columns: columnsone,
        data: null,
      },
    };
  },
  mounted() {},
  components: {
    Main,
  },
  watch: {
    flowstate(nval) {
      this.data_processing();
    },
  },
  created() {
    this.data_processing();
  },
  methods: {
    //数据获取、处理
    async data_processing() {
      let { data } = await procedure_journal({
        data_id: this.$route.query.id,
        type: this.tabs_index,
      });
      for (let key in data.topdata) {
        this.flowstatetabs.forEach((el) => {
          if (el.name == key) {
            el.num = data.topdata[key];
          }
        });
      }
      if (data.data) {
        data.data.forEach((el, index) => {
          el.key = index;
        });
        this.tabs.data = data.data;
      }
    },
    async apiUrge_list() {
      let { data } = await urge_list({
        document_id: this.$route.query.id,
      });
      this.tabs.data = data;
    },
    tabsclick(e) {
      this.tabs_index = e;
      if (e == 5) {
        this.tabs.columns = columnstwo;
        this.apiUrge_list();
      } else {
        this.tabs.columns = columnsone;
        this.data_processing();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.flowstate {
  max-height: 560px;
  overflow-y: scroll;
}
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
  margin: 15px 0 0px;
  .main {
    max-height: 600px;
  }
}
</style>