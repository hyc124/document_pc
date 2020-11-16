<template>
  <div>
    <div class="flex-col">
      <template v-for="(item, index) in processtabs">
        <div
          :class="['tabs-col hand',index+1 == tabs_index ?'tabs-Select':'']"
          :key="index"
          @click="processTab(index+1,item)"
        >{{item.title}}</div>
        <div class="solids" :key="index+100"></div>
      </template>
    </div>
    <div class="flex-col tabs-centen">
      <a-input-search
        placeholder="请输入关键字"
        v-model="Searchterms"
        enter-button
        style="width: 260px"
        @search="onSearch"
      />
      <div class="flex-col-bd"></div>
      <div>
        <a-radio-group default-value="0" button-style="solid" @change="radioChange">
          <a-radio-button value="0">全部</a-radio-button>
          <a-radio-button value="1">近一周</a-radio-button>
          <a-radio-button value="2">近一月</a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <div :style="{height:`${height + 54}px`}">
      <a-table
        :columns="columns"
        :scroll="{ y: height }"
        :row-key="itme=>itme.inx"
        :data-source="data"
        :pagination="false"
      ></a-table>
    </div>
    <Pagetion
      @pageChange="pagechangegetwork"
      @currentchange="currentchangegetwork"
      :paging="paging"
      class="Page"
    />
  </div>
</template>
<script>
import { file_count } from "@/api/incoming.js";
import Pagetion from "@/views/components/Pagination.vue";
import { Calculatedaltitude } from "@/js/public.js";
let processtabs = [
  { title: "阅读记录", text: "阅读" },
  { title: "打印记录", text: "打印" },
  { title: "下载记录", text: "下载" },
  { title: "分发记录", text: "分发" },
  { title: "传阅记录", text: "传阅" }
];
export default {
  name: "Conductstatis",
  data() {
    return {
      processtabs,
      // 记录类型选择记录
      tabs_index: 1,
      // 输入框内容
      Searchterms: "",
      // 表格内容分类
      columns: [],
      // 时间状态选择
      time: 0,
      // 分页器页数
      page: 1,
      // 传送给分页的数据
      paging: {
        total: null,
        current: 1,
        pageSize: 10
      },
      // 列表数据
      data: [],
      // 点击的状态文字记录
      text: "阅读",
      // 表格高度计算
      height: 0
    };
  },
  components: {
    Pagetion
  },
  created() {
    this.height = Calculatedaltitude(47, 51, 60, 60, 60);
    this.onTable();
    this.addList();
    this.$bus.$off("incomingexamineXiaZai"); //先解绑，不然会多次出发
    this.$bus.$on("incomingexamineXiaZai", () => {
      this.addList();
    });
  },
  methods: {
    // 点击切换记录事件
    processTab(e, item) {
      this.tabs_index = e;
      this.text = item.text;
      if (e == 4 || e == 5) {
        this.onTableTwo();
      } else {
        this.onTable();
      }
      this.addList();
    },
    // 翻页的时候触发
    pagechangegetwork(val) {
      this.paging.current = val;
      this.addList();
    },
    // 选择一页多少条数据时触发
    currentchangegetwork(val) {
      this.paging.current = 1;
      this.paging.pageSize = val;
      this.addList();
    },
    // input输入框事件
    onSearch() {
      this.addList();
    },
    // 重置数据
    resetting() {},
    // 事件状态选择事件
    radioChange(time) {
      this.time = time.target.value;
      this.addList();
    },
    // tab表单赋值
    onTable() {
      this.columns = [
        // 表单格式
        {
          title: "序号",
          dataIndex: "inx",
          key: "inx",
          ellipsis: true,
          width: 100
        },
        {
          title: `${this.text}人`,
          dataIndex: "name",
          key: "name",
          scopedSlots: { customRender: "temp_name" },
          ellipsis: true,
          width: 150
        },
        {
          title: "部门",
          dataIndex: "dep_name",
          key: "dep_name",
          ellipsis: true
        },
        {
          title: `${this.text}时间`,
          dataIndex: "create_time",
          key: "create_time",
          ellipsis: true,
          width: 200
        },
        {
          title: `${this.text}阶段`,
          dataIndex: "type",
          key: "type",
          ellipsis: true,
          width: 150,
          customRender: item => {
            return item == null ? "未记录" : item;
          }
        }
      ];
    },
    // tab表单赋值
    onTableTwo() {
      this.columns = [
        // 表单格式
        {
          title: "序号",
          dataIndex: "inx",
          key: "inx",
          ellipsis: true,
          width: 100
        },
        {
          title: `${this.text}人`,
          dataIndex: "name",
          key: "name",
          scopedSlots: { customRender: "temp_name" },
          ellipsis: true,
          width: 150
        },
        {
          title: "部门",
          dataIndex: "dep_name",
          key: "dep_name",
          ellipsis: true
        },
        {
          title: `${this.text}时间`,
          dataIndex: "create_time",
          key: "create_time",
          ellipsis: true,
          width: 200
        },
        {
          title: `${this.text}对象`,
          dataIndex: "receive",
          key: "receive",
          ellipsis: true,
          width: 150
        }
      ];
    },
    // 获取行为统计数据列表
    addList() {
      let _this = this;
      file_count({
        id: this.$route.query.id, // 公文id
        type: this.tabs_index, // 记录类型（1阅读，2打印，3下载，4分发，5传阅）
        keyword: this.Searchterms, // 搜索关键词
        month: this.time, // 时间范围（0全部，1近一周，2近一个月 ）
        page: this.paging.current, // 页数
        limit: this.paging.pageSize // 一页多少条
      }).then(data => {
        data.data.res.forEach(
          (itme, index) => (itme.inx = (_this.page - 1) * 10 + index + 1)
        );
        this.data = data.data.res;
        this.paging.total = data.data.count;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.tabs-col {
  width: 68px;
  line-height: 24px;
  color: #606266;
  text-align: center;
  margin: 7px 0px 16px;
  transition: all 0.3s linear;
}
.solids {
  height: 15px;
  width: 1px;
  background: #606266;
  margin: 7px 10px 16px;
  &:last-child {
    width: 0px;
  }
}
.tabs-Select {
  background: #0082ef;
  color: #ffffff;
}
.tabs-centen {
  margin-bottom: 16px;
  /deep/.ant-input-wrapper.ant-input-group .ant-btn-primary {
    color: #dadadb;
    background-color: #fff;
    border-color: #dadadb;
  }
  /deep/.ant-radio-button-wrapper {
    line-height: 26px;
    height: 28px;
    padding: 0 10px;
  }
}
</style>