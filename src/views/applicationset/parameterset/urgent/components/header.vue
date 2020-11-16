<template>
  <div class="header flex-col">
    <div>
      <a-input-search
        placeholder="请输入关键字"
        v-model="keyword"
        enter-button
        style="width: 260px"
        @search="onSearch"
        :maxLength="20"
      />
    </div>
    <div>
      <a-button @click="showModal" type="primary">新建</a-button>
    </div>
    <a-modal
      v-model="visible"
      cancelText="取消"
      okText="确定"
      title="新建紧急名称"
      @ok="handleOk"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item
          style="margin-bottom: 30px; letter-spacing: 3.5px"
          ref="name"
          label="紧急名称"
          prop="name"
        >
          <a-input
            style="height: 40px; margin-bottom: 5px"
            placeholder="请输入紧急名称"
            v-model="form.name"
            :maxLength="15"
          />
        </a-form-model-item>

        <a-form-model-item
          style="margin-bottom: 30px"
          ref="weight"
          prop="weight"
        >
          <span slot="label">
            紧急程度
            <a-tooltip title="输入1-50内的整数值，输入值越高代表紧急程度越高">
              <a-icon
                type="info-circle"
                style="color: #b3b3b3; font-size: 12px"
              />
            </a-tooltip>
          </span>
          <a-input
            style="height: 40px; margin-bottom: 5px"
            placeholder="输入1-50内的整数值，输入值越高代表紧急程度越高"
            v-model="form.weight"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { Addurgent, Inquireurgent } from "@/api/urgent";
export default {
  name: "Header",
  data() {
    return {
      visible: false,
      keyword: "", // 新建紧级名称输入框关键字
      rules: {
        name: [
          {
            required: true,
            message: "紧急名称不能为空",
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
            message: "紧急程度不能为空",
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
        name: "",
        weight: 10, //权重
      },
      defaultCurrent: 1,
      defaultPageSize: 0,
      sort_field: null,
      sort_type: null,
    };
  },
  created() {
    this.$bus.$off("urgentSendpage"); //先解绑，不然会多次出发
    // 接收到传来的页数和码数
    this.$bus.$on("urgentSendpage", (val) => {
      this.defaultCurrent = val.defaultCurrent;
    });
    this.$bus.$off("urgentSetpostList"); //先解绑，不然会多次出发
    // 刷新页面
    this.$bus.$on("urgentSetpostList", (val) => {
      this.defaultCurrent = val.current;
      this.inquireurgent();
    });
    this.$bus.$off("urgentsort"); //先解绑，不然会多次出发
    // 接收表格排序
    this.$bus.$on("urgentsort", (val) => {
      this.sort_field = val.sort_field;
      this.sort_type = val.sort_type;
    });
  },
  methods: {
    onSearch() {
      this.defaultCurrent = 1;
      this.$bus.$emit("CurrentPageUrgent", 1);
      this.inquireurgent();
    },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.addurgent();
        } else {
          return false;
        }
      });
    },
    // 添加紧急程度
    addurgent() {
      Addurgent(this.form).then((res) => {
        if (res.code == 1) {
          this.visible = false;
          this.form.name = "";
          this.form.weight = 10;
          this.$message.success(res.msg);
          this.$bus.$emit("urgentAddLoadList");
        }
      });
    },
    // 查询紧急列表
    inquireurgent() {
      Inquireurgent({
        keyword: this.keyword,
        page: this.defaultCurrent,
      }).then((res) => {
        this.$bus.$emit("urgentLoadurgentList", {
          data: res.data.data,
          getpostList: true,
          total: res.data.count,
          sort_field: this.sort_field,
          sort_type: this.sort_type,
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.header {
  justify-content: space-between;
  height: 60px;
  .headerbtn {
    border-radius: 0px 4px 4px 0px;
    margin-left: -2px;
    height: 32px;
  }
  /deep/.ant-input-wrapper.ant-input-group .ant-btn-primary {
    color: #dadadb;
    background-color: #fff;
    border-color: #dadadb;
  }
}
/deep/ .ant-input {
  border-radius: 4px;
}
.inleft {
  color: #f33636;
}
.intitle {
  font-size: 14px;
  color: #303133;
  margin-left: 8px;
}
.input {
  width: 332px;
  margin-left: 10px;
}
/deep/ .ant-input {
  border-radius: 4px;
}

/deep/ .ant-form {
  width: 100%;

  .ant-row {
    display: flex;
    margin-bottom: 0;
    .ant-col {
      width: 100px;
    }
    .ant-modal-footer {
      border: none;
    }
    .ant-form-item-control-wrapper {
      flex: 1;
    }
  }
}
</style>