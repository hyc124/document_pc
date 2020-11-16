<template>
  <div>
    <div class="main table-content-at" :style="{height:`${height+ 54 + 12}px`}">
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :scroll="{ y: height }"
        :row-key="itme=>itme.id"
        @change="ChangeSort"
      >
        <span slot="name" slot-scope="item,record">
          <div class="flex-col">
            <div>{{item}}</div>
            <div class="commonlyUsed" v-if="record.allways_use==1">常用</div>
          </div>
        </span>
        <span slot="operation" slot-scope="item,record">
          <div class="flex-db operation">
            <span style="color:#0082EF" @click="editclick(record,1)">编辑</span>
            <span style="color:#fa5555" @click="editclick(record,2)">删除</span>
          </div>
        </span>
      </a-table>
    </div>
    <Pagetion
      @pageChange="pagechangepathset"
      @currentchange="currentchangepathset"
      :paging="paging"
      class="Page"
    />
    <a-modal v-model="visibles" cancelText="取消" okText="确定" title="修改发文类别名称" @ok="handleOks">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item ref="name" label="类别名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import {
  DelpathsetList,
  SetpathsetList,
  GetpathsetList
} from "@/api/postflowpathset.js";
import Pagetion from "@/views/components/Pagination.vue";
import { Calculatedaltitude } from "@/js/public.js";
export default {
  name: "Main",
  data() {
    return {
      height: 0,
      data: null,
      columns: null,
      visible: "",
      visibles: false,
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
      // 每一行的数据
      row: {},
      kwd: "",
      // 编辑请求发送之后返回的数据
      approval: {},
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
  mounted() {
    this.height = Calculatedaltitude(10, 60, 12, 54, 59);
    // 获取发文流程设置列表
    this.getdataList();
    // 查询
    this.$bus.$on("postflowpathsetGetdatakwd", val => {
      this.kwd = val;
      this.getdataList();
    });
  },
  created() {
    this.columns = [
      {
        title: "流程名称",
        dataIndex: "name",
        key: "name",
        scopedSlots: { customRender: "name" }
      },
      {
        title: "创建账号",
        dataIndex: "uname",
        key: "uname",
        align: "center"
      },
      {
        title: "创建时间",
        dataIndex: "time",
        key: "time",
        ellipsis: true,
        sorter: (a, b) => a.time.length - b.time.length
      },
      {
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        width: 110,
        scopedSlots: { customRender: "operation" },
        align: "center"
      }
    ];
  },
  methods: {
    editclick(el, num) {
      if (num == 1) {
        this.row = el;
        this.setpathsetList(el.id);
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
      this.deldataList();
    },
    // 点击编辑弹窗的确定按钮
    handleOks(e) {
      if (this.form.name.length < 16 && this.form.name.length != 0) {
        this.savepathsetList();
        this.visibles = false;
      }
    },
    // 页数发生变化
    pagechangepathset(val) {
      this.paging.current = val;
      this.getdataList();
    },
    // 每页条数发生变化
    currentchangepathset(val) {
      this.paging.pageSize = val;
      this.paging.current = 1;
      this.getdataList();
    },
    // 获取列表
    getdataList() {
      GetpathsetList({
        type: 2,
        page: this.paging.current,
        limit: this.paging.pageSize,
        kwd: this.kwd,
        sort: this.table_data?.sort_type,
        order_field: this.table_data?.sort_field
      }).then(res => {
        if (res.code == 1) {
          res.data.data.map(v => {
            v.key = v.id;
          });
          this.paging.total = res.data.count;
          this.data = res.data.data;
        }
      });
    },
    // 删除列表
    deldataList() {
      DelpathsetList({ approval_id: this.row.id }).then(res => {
        this.getdataList();
      });
    },
    // 编辑流程模板
    setpathsetList(id) {
      this.$router.push({
        path: "/postflowpathset/postflowpathadd",
        query: { id }
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
        this.getdataList();
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
    * {
      cursor: pointer;
    }
  }
}
/deep/ .maincontent {
  position: relative;
  .Page {
    position: absolute;
    bottom: 0px;
  }
}
</style>