<template>
  <div class="main">
    <div class="main table-content-at" :style="{height:`${height + 54+12}px`}">
      <a-table
        :columns="columns"
        :data-source="data"
        @change="ChangeSort"
        :pagination="false"
        :scroll="{ y: height }"
        :row-key="item=>item.id"
      >
        <span slot="name" slot-scope="item,record">
          <div class="flex-col">
            <div>{{item}}</div>
            <div class="commonlyUsed" v-if="record.is_default==1">常用</div>
          </div>
        </span>
        <span slot="operation" slot-scope="item,record">
          <div class="flex-col operation">
            <div @click="editclick(record,1)" style="color:#0082ef;">编辑</div>
            <div style="color:#fa5555" @click="editclick(record,2)">删除</div>
          </div>
        </span>
      </a-table>
    </div>
    <Pagetion
      @pageChange="pagechangegetleset"
      @currentchange="currentchangegetleset"
      :paging="paging"
      class="Page"
    />
  </div>
</template>
<script>
import {
  Addpostrulese,
  Delpostrulese,
  Getpostrulese
} from "@/api/postruleset.js";
import Pagetion from "@/views/components/Pagination.vue";
import { Calculatedaltitude } from "@/js/public.js";
export default {
  name: "Main",
  data() {
    return {
      data: null,
      columns: null,
      visible: "",
      visibles: false,
      height: 0,
      rules: {
        // 修改发文分类名称内容判断
        name: [
          {
            required: true,
            message: "请输入发文分类名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 15,
            message: "请输入不超过15个字符",
            trigger: ["change", "blur"]
          }
        ]
      },
      form: {
        //修改紧级名称内容
        name: ""
      },
      row: {},
      // 传送给分页的数据
      paging: {
        total: null,
        current: 1,
        pageSize: 10
      },
      getpostList: false, //分页改变的时候判断获取查询的数据还是列表数据
      table_data: {} //排序,
    };
  },
  components: {
    Pagetion
  },
  created() {
    // 获取发文编号规则列表
    this.getdataList();
    // 获取查询之后的表单格式
    this.onList();
    // 发送页数和显示条数给其他组件
    this.$bus.$emit("getrulesetSendpage", {
      defaultCurrent: this.paging.current,
      defaultPageSize: this.paging.pageSize
    });
    this.columns = [
      {
        title: "规则名称",
        dataIndex: "name",
        key: "name",
        scopedSlots: { customRender: "name" }
      },
      {
        title: "创建账号",
        dataIndex: "username",
        key: "username"
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        key: "create_time",
        ellipsis: true,
        sorter: (a, b) => a.create_time.length - b.create_time.length
      },
      {
        title: "示例",
        dataIndex: "word_no",
        key: "word_no",
        ellipsis: true
      },
      {
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        scopedSlots: { customRender: "operation" },
        width: 110
      }
    ];
  },
  mounted() {
    this.height = Calculatedaltitude(10, 60, 54, 12, 59);
  },
  methods: {
    editclick(el, num) {
      if (num == 1) {
        this.$router.push({
          path: "/getruleset/getruleSetEdit",
          query: { id: el.id }
        });
      } else {
        this.row = el;
        this.showModal();
      }
    },
    // 点击删除按钮，打开弹窗
    showModal() {
      this.visible = this.$confirm({
        title: "提示",
        content: "删除后数据不可恢复，是否继续？",
        okText: "确认",
        cancelText: "取消",
        icon: "info-circle",
        onOk: this.handleOk
      });
    },
    // 判断是否在使用，不然不能删除
    handleOk() {
      let _this = this;
      this.delpostrulese();
    },
    // 排序变化
    ChangeSort(p, f, s) {
      if (s.order) {
        let order = "";
        switch (s.order) {
          case "ascend":
            order = "asc";
            break;
          case "descend":
            order = "desc";
            break;
        }
        this.table_data.sort_field = s.columnKey;
        this.table_data.sort_type = order;
        this.$bus.$emit("getrulesetsort", {
          sort_field: s.columnKey,
          sort: order
        });
        if (this.getpostList) {
          this.onList();
        } else {
          this.getdataList();
        }
      }
    },
    // 页码改变
    pagechangegetleset(val) {
      this.paging.current = val;
      if (this.getpostList) {
        this.onList();
        // 让查询的数据也改变
        this.$bus.$emit("getrulesetSetpostList", {
          current: val,
          page: this.paging.pageSize
        });
      } else {
        this.getdataList();
      }
    },
    // 每页条数改变
    currentchangegetleset(val) {
      this.paging.current = 1;
      this.paging.pageSize = val;
      if (this.getpostList) {
        this.onList();
        // 发送页数和显示条数给其他组件
        this.$bus.$emit("getrulesetSetpostList", {
          current: this.paging.current,
          page: val
        });
      } else {
        this.getdataList();
      }
    },
    // 获取列表
    getdataList() {
      Getpostrulese({
        type: 2,
        page: this.paging.current,
        limit: this.paging.pageSize,
        order_field: this.table_data.sort_field,
        sort: this.table_data.sort_type
      }).then(res => {
        if (res.code == 1) {
          this.paging.total = res.count;
          this.data = res.data;
        }
      });
    },
    // 接到查询之后的列表
    onList() {
      this.$bus.$on("getrulesetGetpostList", val => {
        this.data = val.data;
        this.paging.total = val.total;
        this.getpostList = val.getpostList;
      });
    },
    // 删除字号
    delpostrulese() {
      Delpostrulese({ id: this.row.id }).then(res => {
        if (res.code == 1) {
          this.getdataList();
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.commonlyUsed {
  margin-left: 8px;
  padding: 0px 5px;
  background: #eaf0fc;
  color: #839ccf;
}
.main {
  padding-top: 0;
  .operation {
    justify-content: space-between;
    div {
      cursor: pointer;
    }
  }
}
</style>