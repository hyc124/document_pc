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
      :paging="paging"
      @pageChange="pageChange"
      @currentchange="currentchangepathset"
      class="Page"
    />
    <a-modal
      v-model="visibles"
      cancelText="取消"
      okText="确定"
      title="修改紧急名称"
      @ok="handleOks"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        label_align="right"
        :label-col="{ span: 12 }"
      >
        <a-form-model-item
          ref="name"
          style="letter-spacing: 1.5px"
          label="紧急名称"
          prop="name"
        >
          <a-input placeholder="请输入紧急名称" v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item ref="weight" prop="weight" style="letter-spacing: -1.5px">
          <span slot="label">
            紧急程度
            <a-tooltip title="输入1-50内的整数值，输入值越高代表紧急程度越高">
              <a-icon type="info-circle" />
            </a-tooltip>
          </span>
          <a-input placeholder="请输入紧急程度" v-model="form.weight" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import Pagination from "@/views/components/Pagination.vue";
import { Calculatedaltitude } from "@/js/public.js";
import { Geturgent, Seturgent, Delurgent, Addurgent } from "@/api/urgent.js";
export default {
  name: "Main",
  data() {
    return {
      data: null,
      columns: null,
      visible: "",
      visibles: false,
      getpostList: false,
      rules: {
        // 修改紧级名称内容判断
        name: [
          {
            required: true,
            message: "请输入紧急名称",
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
            message: "请输入输入数字，请在1-50内取值 ",
            trigger: ["change", "blur"],
          },
        ],
      },
      form: {
        //修改紧级名称内容
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
        pageSize: 10,
        total: null,
        current: 1,
      },
    };
  },
  components: {
    Pagination,
  },
  created() {
    this.$bus.$off("CurrentPageUrgent"); //先解绑，不然会多次出发
    this.$bus.$on("CurrentPageUrgent", (val) => {
      this.page = val;
    });
    // 获取紧急程度列表
    this.geturgent();
    // 查询之后获取的列表
    this.onList();
    this.$bus.$off("urgentSendpage"); //先解绑，不然会多次出发
    // 发送页数和显示条数给其他组件
    this.$bus.$emit("urgentSendpage", {
      defaultCurrent: this.paging.current,
    });
    this.$bus.$off("urgentAddLoadList"); //先解绑，不然会多次出发
    // 接到新建通知 重新渲染页面
    this.$bus.$on("urgentAddLoadList", (val) => {
      this.geturgent();
    });

    this.columns = [
      // 表单格式
      {
        title: "紧急程度名称",
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
        align: "left",
        sorter: (a, b) => a.create_time.length - b.create_time.length,
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
  mounted() {
    this.height = Calculatedaltitude(22, 60, 54, 59);
  },
  methods: {
    // 分页
    pageChange(val) {
      this.page = val;
      // 发送ajax
      if (this.getpostList) {
        this.onList();
        // 让查询的数据也改变
        this.$bus.$emit("urgentSetpostList", {
          current: this.current,
        });
      } else {
        this.geturgent();
      }
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
        this.$bus.$emit("urgentsort", {
          sort_field: s.columnKey,
          sort_type: order,
        });
        if (this.getpostList) {
          this.onList();
        } else {
          this.geturgent();
        }
      }
    },
    editclick(el, num) {
      if (num == 1) {
        this.row = el;
        this.form.name = el.name;
        this.form.weight = el.weight;
        this.amend();
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
        onOk: this.handleOk,
      });
    },
    // 判断是否在使用，不然不能删除
    handleOk() {
      let _this = this;
      this.visible.destroy();
      this.delurgent();
    },
    // 打开修改紧级名称弹窗
    amend() {
      this.visibles = true;
    },
    // 点击编辑弹窗的确定按钮
    handleOks(e) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.visibles = false;
          this.seturgent();
          this.form.name = "";
          this.form.weight = "";
        } else {
          return false;
        }
      });
    },
    // 获取紧急程度列表
    geturgent() {
      Geturgent({
        page: this.page,
        sort_field: this.table_data.sort_field,
        sort_type: this.table_data.sort_type,
      }).then((res) => {
        this.paging.total = res.data.count;
        res.data.data.forEach((el) => {
          el.key = el.id;
        });
        this.data = res.data.data;
      });
    },
    // 修改紧急程度
    seturgent() {
      Seturgent({
        id: this.row.key,
        name: this.form.name,
        weight: this.form.weight,
      }).then((res) => {
        if (res.code == 1) {
          this.geturgent();
        }
      });
    },
    // 删除紧急程度
    delurgent() {
      Delurgent({ id: this.row.key }).then((res) => {
        if (res.code == 1) {
          this.geturgent();
        }
      });
    },
    // 接收到查询的数据
    onList() {
      this.$bus.$on("urgentLoadurgentList", (val) => {
        this.paging.total = val.total;
        this.getpostList = val.getpostList;
        if (val.data) {
          let arr = [];
          val.data.map((v) => {
            let obj = {};
            obj.key = v.id;
            obj.username = v.username;
            obj.create_time = v.create_time;
            obj.name = v.name;
            obj.weight = v.weight;
            arr.push(obj);
          });
          this.data = arr;
        } else {
          this.data = [];
        }
      });
    },
    // 每页条数发生变化
    currentchangepathset(val) {
      this.paging.pageSize = val;
      this.paging.current = 1;
      this.geturgent();
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
        this.geturgent();
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
.main {
  padding-top: 0;
  /deep/ .ant-spin-nested-loading {
    height: 90%;
  }
  .operation {
    justify-content: space-between;
    div {
      cursor: pointer;
    }
  }
  .ant-pagination {
    margin-top: -35px !important;
  }
}
/deep/.has-error .ant-form-explain,
.has-error .ant-form-split {
  margin-left: 10px;
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