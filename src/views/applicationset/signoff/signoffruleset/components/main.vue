<template>
  <div>
    <div class="main table-content-at" :style="{height:`${height + 54+12}px`}">
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :scroll="{ y: height }"
        @change="ChangeSort"
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
        <!-- <span v-else>无权限</span> -->
      </a-table>
    </div>
    <Pagetion
      @pageChange="pagechangeleset"
      @currentchange="currentchangeleset"
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
import { Calculatedaltitude } from "@/js/public.js";
import Pagetion from "@/views/components/Pagination.vue";
export default {
  name: "Main",
  data() {
    return {
      data: null,
      columns: null,
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
  created() {
    // 获取发文编号规则列表
    this.getdataList();
    // 获取查询之后的表单格式
    this.onList();
    // 发送页数和显示条数给其他组件
    this.$bus.$emit("signoffrulesetsetSendpage", {
      defaultCurrent: this.paging.current,
      defaultPageSize: this.paging.pageSize
    });
    // 查询之后页码改变
    this.$bus.$on("signoffrulesetrulesetpage", val => {
      this.paging.current = val;
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
  components: {
    Pagetion
  },
  mounted() {
    this.height = Calculatedaltitude(10, 60, 54, 12, 59);
    // 获取发文流程设置列表
    this.getdataList();
  },
  methods: {
    editclick(el, num) {
      if (num == 1) {
        this.$router.push({
          path: "/signoffruleset/signoffRilesetendit",
          query: { id: el.id }
        });
      } else {
        this.row = el;
        this.showModal();
      }
    },
    // 判断是否在使用，不然不能删除
    handleOk() {
      let _this = this;
      this.delpostrulese();
    },
    // 页码改变
    pagechangeleset(val) {
      this.paging.current = val;
      if (this.getpostList) {
        this.onList();
        // 让查询的数据也改变
        this.$bus.$emit("signoffrulesetsetSetpostList", {
          current: val,
          page: this.paging.pageSize
        });
      } else {
        this.getdataList();
      }
    },
    // 每页条数改变
    currentchangeleset(val) {
      this.paging.pageSize = val;
      this.paging.current = 1;
      if (this.getpostList) {
        this.onList();
        // 发送页数和显示条数给其他组件
        this.$bus.$emit("signoffrulesetsetSetpostList", {
          current: this.paging.current,
          page: val
        });
      } else {
        this.getdataList();
      }

      this.getdataList();
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
    // 获取列表
    getdataList() {
      Getpostrulese({
        type: 3,
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
    // 查询列表
    onList() {
      this.$bus.$on("signoffrulesetsetGetpostList", val => {
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
        this.$bus.$emit("signrulesetsort", {
          sort_field: s.columnKey,
          sort: order
        });
        if (this.getpostList) {
          this.onList();
        } else {
          this.getdataList();
        }
      }
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