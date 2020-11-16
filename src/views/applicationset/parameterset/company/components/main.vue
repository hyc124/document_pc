<template>
  <div>
    <div class="main table-content-at" :style="{height:`${height + 54+12}px`}">
      <a-table
        :scroll="{ y: height }"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        @change="onChangeSort"
        :row-key="item=>item.id"
      >
        <span slot="operation" slot-scope="item,record">
          <div class="flex-col operation">
            <div style="color:#0082EF" @click="editclick(record,1)">编辑</div>
            <div style="color:#fa5555" @click="editclick(record,2)">删除</div>
          </div>
        </span>
        <!-- <span >无权限</span> -->
      </a-table>
    </div>
    <Pagination
      class="Page"
      :paging="paging"
      @pageChange="pageChange"
      @currentchange="currentchangepathset"
    />
  </div>
</template>
<script>
// 引入ajax
import { Calculatedaltitude } from "@/js/public.js";
import Pagination from "@/views/components/Pagination.vue";
import { companyList, delCompany } from "@/api/company.js";
export default {
  name: "Main",
  data() {
    return {
      data: null,
      columns: null,
      visible: "",
      height: 0,
      table_data: {
        sort_type: null
      },
      // 搜索的关键词
      keyword: "",
      // 分页数据集合
      paging: {
        total: null, // 数据总条数
        current: 1, // 当前页数
        pageSize: 10 // 一页展示多少条
      },
      // 储存删除文件的id
      id: ""
    };
  },
  created() {
    this.$bus.$on("CompanyPage", val => {
      this.paging.current = 1;
      this.keyword = val;
      this.getCompanyList();
    });
    // 获取列表
    this.getCompanyList();
    this.columns = [
      // 表单格式
      {
        title: "单位名称  ",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "创建账号",
        dataIndex: "name",
        key: "name"
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
        width: 110
      }
    ];
  },
  components: {
    Pagination
  },
  mounted() {
    this.height = Calculatedaltitude(22, 60, 54, 59);
  },
  methods: {
    editclick(el, num) {
      if (num == 1) {
        //编辑
        this.$router.push(`/company/companyadd?id=${el.id}`);
      } else if (num == 2) {
        //删除
        this.delModel(el.id);
      }
    },
    // 点击删除按钮，打开弹窗
    delModel(id) {
      this.id = id;
      this.visible = this.$confirm({
        title: "提示",
        content: "删除后数据不可恢复，是否继续？",
        okText: "确认",
        cancelText: "取消",
        icon: "info-circle",
        onOk: this.adddelCompany
      });
    },
    // 删除收发文单位
    adddelCompany() {
      let _this = this;
      delCompany({ id: _this.id }).then(res => {
        clearInterval(_this.visible);
        this.getCompanyList();
      });
    },
    // 获取收发文单位列表
    getCompanyList() {
      companyList({
        page: this.paging.current,
        limit: this.paging.pageSize,
        sort: this.table_data.sort_type,
        keyword: this.keyword
      }).then(res => {
        this.paging.total = res.data.count;
        this.data = res.data.data;
      });
    },
    // 分页
    pageChange(val) {
      this.paging.current = val;
      this.getCompanyList();
    },
    // 每页条数发生变化
    currentchangepathset(val) {
      this.paging.pageSize = val;
      this.paging.current = 1;
      this.getCompanyList();
    },
    // 排序变化
    onChangeSort(p, f, s) {
      let _order = "";
      switch (s.order) {
        case "ascend":
          _order = "asc";
          break;
        case "descend":
          _order = "desc";
          break;
      }
      // 排序方式
      this.table_data.sort_type = _order;
      this.getCompanyList();
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

  .ant-pagination {
    text-align: right;
    margin-top: -35px;
  }

  /deep/ .ant-spin-nested-loading {
    height: 90% !important;
  }
}

/deep/ .ant-input {
  border-radius: 4px 0px 0px 4px;
}

/deep/ .ant-form {
  width: 100%;

  .ant-row {
    display: flex;
    margin-bottom: 0;

    .ant-form-item-label {
      flex: 0 0 80px !important;
    }

    .ant-form-item-control-wrapper {
      flex: 1;
    }
  }
}
</style>