<template>
  <div>
    <div
      class="main table-content-at"
      :style="{ height: `${height + 54 + 12}px` }"
    >
      <a-table
        :scroll="{ y: height }"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        @change="ChangeSort"
        :row-key="(item) => item.id"
      >
        <span slot="operation" slot-scope="item, record">
          <div class="flex-col operation">
            <div style="color: #0082ef" @click="editclick(record, 1)">编辑</div>
            <div style="color: #fa5555" @click="editclick(record, 2)">删除</div>
          </div>
        </span>
      </a-table>
    </div>
    <Pagination
      class="Page"
      :paging="paging"
      @pageChange="pageChange"
      @currentchange="currentchangepathset"
    />
    <a-modal
      v-model="visibles"
      cancelText="取消"
      okText="确定"
      title="修改密集名称"
      @ok="handleOks"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item
          ref="name"
          style="letter-spacing: 1.5px"
          label="密级名称"
          prop="name"
        >
          <a-input placeholder="请输入密集名称" v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item
          ref="weight"
          prop="weight"
          style="letter-spacing: -1.5px"
        >
          <span slot="label">
            密级程度
            <a-tooltip title="输入1-50内的整数值，输入值越高代表密集程度越高">
              <a-icon type="info-circle" />
            </a-tooltip>
          </span>
          <a-input placeholder="请输入权重值" v-model="form.weight" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
// 引入ajax
import { Calculatedaltitude } from "@/js/public.js";
import Pagination from "@/views/components/Pagination.vue";
import { secrecyTypeList, Delsecrecy, Setsecrecy } from "@/api/secrecy.js";
export default {
  name: "Main",
  data() {
    return {
      data: null,
      columns: null,
      visible: "",
      visibles: false,
      // 默认当前页数
      getpostList: false,
      rules: {
        // 修改密级名称内容判断
        name: [
          {
            required: true,
            message: "请输入密级名称",
            trigger: "blur",
          },
          {
            min: 1,
            max: 30,
            message: "请输入不超过30个字符",
            trigger: ["change", "blur"],
          },
        ],
        weight: [
          {
            required: true,
            message: "请输入数字，请在1-50内取值 ",
            trigger: "blur",
          },
          {
            min: 1,
            max: 15,
            pattern: new RegExp(/^(0|[1-9]|[1-4][0-9]|50)$/, "g"),
            message: "请输入数字，请在1-50内取值 ",
            trigger: ["change", "blur"],
          },
        ],
      },
      form: {
        //修改密级名称内容
        name: "",
        weight: "", //权重
      },
      row: {},
      height: 0,
      table_data: {
        sort_field: null,
        sort_type: null,
      },
      paging: {
        total: null,
        current: 1,
      },
    };
  },
  created() {
    this.$bus.$off("CurrentPage"); //先解绑，不然会多次出发
    this.$bus.$on("CurrentPage", (val) => {
      this.current = val;
    });
    // 获取列表
    this.getsecrecyList();
    // 获取查询之后的表单格式
    this.onList();
    // 新建
    this.$bus.$off("secrecyReloadList"); //先解绑，不然会多次出发
    this.$bus.$on("secrecyReloadList", (val) => {
      this.getsecrecyList();
    });
    // 发送页数和显示条数给其他组件
    this.$bus.$emit("secrecysendpage", {
      defaultCurrent: this.paging.current,
    });

    this.columns = [
      // 表单格式
      {
        title: "密级程度名称",
        dataIndex: "name",
        key: "name",
        align: "left",
      },
      // {
      //   title: "权重值",
      //   dataIndex: "weight",
      //   key: "weight",
      //   align: "center",
      // },
      {
        title: "创建账号",
        dataIndex: "username",
        key: "username",
        align: "left",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        key: "create_time",
        ellipsis: true,

        sorter: (a, b) => a.create_time.length - b.create_time.length,
        align: "left",
      },
      {
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        scopedSlots: { customRender: "operation" },
        width: 110,
        align: "center",
      },
    ];
  },
  components: {
    Pagination,
  },
  mounted() {
    this.height = Calculatedaltitude(22, 60, 54, 59);
  },
  methods: {
    editclick(el, num) {
      this.row = el;
      if (num == 1) {
        this.form.name = this.row.name;
        this.form.weight = this.row.weight;
        this.amend();
      } else {
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
        onOk: this.handleOk,
      });
    },
    // 判断是否在使用，不然不能删除
    handleOk() {
      let _this = this;
      this.visible.destroy();
      this.delsecrecy();
    },
    // 打开修改密级名称弹窗
    amend() {
      this.visibles = true;
    },
    // 点击编辑弹窗的确定按钮
    handleOks(e) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.visibles = false;
          this.setsecrecy();
        } else {
          return false;
        }
      });
    },
    // 获取密级程度列表
    getsecrecyList() {
      secrecyTypeList({
        page: this.current,
        sort_field: this.table_data.sort_field,
        sort_type: this.table_data.sort_type,
      }).then((res) => {
        this.paging.total = res.data.count;
        this.data = res.data.data;
      });
    },
    // 删除密级程度
    delsecrecy() {
      Delsecrecy({ id: this.row.id }).then((res) => {
        if (res.code == 1) {
          this.getsecrecyList();
        }
      });
    },
    // 编辑密级程度
    setsecrecy() {
      // 点击确定按钮发送ajax请求
      Setsecrecy({
        name: this.form.name,
        weight: this.form.weight,
        id: this.row.id,
      }).then((res) => {
        // 修改成功之后更新列表
        if (res.code == 1) {
          this.getsecrecyList();
        }
      });
    },
    // 查询之后获取的数据
    onList() {
      this.$bus.$on("secrecyGetpostList", (val) => {
        this.paging.total = val.total;
        this.getpostList = val.getpostList;
        if (val.data) {
          this.paging.total = val.total;
          let arr = [];
          val.data.map((v, i) => {
            let obj = {};
            obj.key = String(i + 1);
            obj.name = v.name;
            obj.create_time = v.create_time;
            obj.username = v.username;
            obj.weight = v.weight;
            arr.push(obj);
          });
          this.data = arr;
        } else {
          this.data = [];
        }
      });
    },
    // 分页
    pageChange(val) {
      this.paging.current = val;
      // 发送ajax
      if (this.getpostList) {
        this.onList();
        // 让查询的数据也改变
        this.$bus.$emit("secrecySetpostList", {
          current: this.paging.current,
        });
      } else {
        this.getsecrecyList();
      }
    },
    // 每页条数发生变化
    currentchangepathset(val) {
      this.paging.pageSize = val;
      this.paging.current = 1;
      this.getsecrecyList();
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
        this.$bus.$emit("secrecysort", {
          sort_field: s.columnKey,
          sort_type: order,
        });
        if (this.getpostList) {
          this.onList();
        } else {
          this.getsecrecyList();
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .ant-input {
  border-radius: 4px;
  width: 332px;
  margin-left: 10px;
  height: 40px;
}
/deep/.ant-modal-body {
  padding-bottom: 0px;
}
/deep/ .ant-form .ant-row {
  margin-bottom: 30px !important;
}
/deep/.has-error .ant-form-explain,
.has-error .ant-form-split {
  margin-left: 10px;
}
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