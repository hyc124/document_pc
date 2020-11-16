<template>
  <div>
    <div class="main table-content-at" :style="{height:`${height + 54 + 12}px`}">
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :scroll="{ y: height }"
        @change="ChangeSort"
        :row-key="item=>item.id"
      >
        <span slot="operation" slot-scope="item,record">
          <div class="flex-col operation">
            <div style="color:#0082EF" @click="editclick(record,1)">编辑</div>
            <div style="color:#fa5555" @click="editclick(record,2)">删除</div>
          </div>
        </span>
      </a-table>
    </div>
    <Pagetion
      @pageChange="pagechangeGetifyset"
      @currentchange="currentchangeGetifyset"
      :paging="paging"
      class="Page"
    />
    <a-modal v-model="visibles" cancelText="取消" okText="确定" title="修改收文分类名称" @ok="handleOks">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item ref="name" label="分类名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { Setpost, Delpost, GetdataList } from "@/api/postclassifyset.js";
import Pagetion from "@/views/components/Pagination.vue";
import { documentExcelout } from "@/api/public.js";
import {
  Calculatedaltitude,
  checkBoxSelect,
  filldownload
} from "@/js/public.js";
export default {
  name: "Main",
  data() {
    return {
      checkBoxSelect,
      ids: {
        // 嵌套是因为引用类型，函数里改了数据外面就可以直接使用
        ids: "" // 多选按钮选中文件id
      },
      data: null,
      columns: null,
      visible: "",
      height: 0,
      visibles: false,
      rules: {
        // 修改发文分类名称内容判断
        name: [
          {
            required: true,
            message: "请输入收文分类名称",
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
      table_data: {} //排序
    };
  },
  components: {
    Pagetion
  },
  created() {
    // 获取列表
    this.getdataList();
    // 获取查询列表
    this.onList();
    // 发送给头部页面页数和条数
    this.$bus.$emit("getclassifysetSendpage", {
      defaultCurrent: this.paging.current,
      defaultPageSize: this.paging.pageSize
    });
    // 新建之后刷新页面
    this.$bus.$on("getclassifysetReloadList", val => {
      this.getdataList();
    });
    // 查询之后修改页码
    this.$bus.$on("getclassifysetPage", val => {
      this.paging.current = val;
    });
    this.columns = [
      // 表单格式
      {
        title: "分类名称",
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
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        scopedSlots: { customRender: "operation" },
        width: 110,
        align: "center"
      }
    ];
  },
  mounted() {
    this.height = Calculatedaltitude(10, 60, 12, 54, 59);
    this.$bus.$off("getclassifysetExcelout"); //先解绑，不然会多次出发
    // 接收点击导出事件
    this.$bus.$on("getclassifysetExcelout", () => {
      this.addDocumentExcelout();
    });
  },
  methods: {
    editclick(el, num) {
      if (num == 1) {
        this.amend();
        this.row = el;
        this.form.name = this.row.name;
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
      this.delpost();
    },
    // 打开修改紧级名称弹窗
    amend() {
      this.visibles = true;
    },
    // 点击编辑弹窗的确定按钮
    handleOks(e) {
      if (this.form.name.length < 16 && this.form.name.length != 0) {
        this.setpost();
        this.visibles = false;
        this.form.name = "";
      }
    },
    // 页数发生变化
    pagechangeGetifyset(val) {
      this.paging.current = val;
      if (this.getpostList) {
        this.onList();
        this.$bus.$emit("getclassifysetSetpostList", {
          current: val,
          page: this.paging.pageSize
        });
      } else {
        this.getdataList();
      }
    },
    // 每页条数发生变化
    currentchangeGetifyset(val) {
      this.paging.pageSize = val;
      this.paging.current = 1;
      if (this.getpostList) {
        this.onList();
        this.$bus.$emit("getclassifysetSetpostList", {
          current: this.paging.current,
          page: val
        });
      } else {
        this.getdataList();
      }
    },
    // 导出数据
    addDocumentExcelout() {
      if (this.data.length == 0) {
        this.$message.error(`没有可以导出的数据`);
        return false;
      }
      documentExcelout({
        flag: 5,
        type: 2, // 1发文，2收文，3签报
        page: this.paging.current,
        limit: this.paging.pageSize,
        kwd: this.form.name,
        order_field: this.table_data.sort_field,
        sort: this.table_data.sort_type,
        ids: this.ids.ids
      }).then(data => {
        filldownload(data);
      });
    },
    // 获取列表
    getdataList() {
      GetdataList({
        type: 2,
        page: this.paging.current,
        limit: this.paging.pageSize,
        kwd: this.form.name,
        order_field: this.table_data.sort_field,
        sort: this.table_data.sort_type
      }).then(res => {
        if (res.code == 1) {
          this.paging.total = res.count;
          this.data = res.data;
        }
      });
    },
    // 接收到查询以后的列表数据
    onList() {
      this.$bus.$on("getclassifysetGetpostList", val => {
        this.data = val.data;
        this.paging.total = val.total;
        this.getpostList = val.getpostList;
      });
    },
    // 删除收文类型
    delpost() {
      Delpost({ id: this.row.id }).then(res => {
        if (res.code == 1) {
          this.getdataList();
        }
      });
    },
    // 编辑收文
    setpost() {
      // 点击确定按钮发送ajax请求
      Setpost({ name: this.form.name, id: this.row.id, type: 2 }).then(res => {
        // 修改成功之后更新列表
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
        this.table_data.sort_type = order;
        this.paging.current = 1;
        this.getdataList();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.main {
  padding-top: 0;
  .operation {
    justify-content: space-between;
    div {
      cursor: pointer;
    }
  }
}
/deep/ .maincontent {
  position: relative;
  /deep/.Page {
    position: absolute;
    bottom: 0px;
  }
}
</style>