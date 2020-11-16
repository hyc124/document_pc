<template>
  <div class="header flex-col">
    <div>
      <a-input-search
        placeholder="请输入关键字"
        v-model="Searchterms"
        enter-button
        style="width: 260px"
        @search="onSearch"
        :maxLength="20"
      />
    </div>
    <div class="flex-col">
      <a-button @click="showModal" type="primary">新建</a-button>
    </div>
    <a-modal v-model="visible" cancelText="取消" okText="确定" title="新建收文分类名称" @ok="handleOk">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item ref="name" label="分类名称" prop="name">
          <a-input v-model="form.name"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { Addpost, Getpost } from "@/api/postclassifyset.js";
export default {
  name: "Header",

  data() {
    return {
      Searchterms: "", // 搜索词
      visible: false,
      keyword: "", // 新建发文名称输入框关键字
      rules: {
        name: [
          {
            required: true,
            message: "请输入正确的分类名称",
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
        name: ""
      },
      defaultCurrent: 1,
      defaultPageSize: 0,
      order_field: null,
      sort: null
    };
  },
  created() {
    this.$bus.$off("getclassifysetSendpage"); //先解绑，不然会多次出发
    // 接收到传来的页数和码数
    this.$bus.$on("getclassifysetSendpage", val => {
      this.defaultCurrent = val.defaultCurrent;
      this.defaultPageSize = val.defaultPageSize;
    });
    this.$bus.$off("getclassifysetSetpostList"); //先解绑，不然会多次出发
    // 刷新页面
    this.$bus.$on("getclassifysetSetpostList", val => {
      this.defaultCurrent = val.current;
      this.defaultPageSize = val.page;
      this.getpost();
    });
    this.$bus.$off("getiyset"); //先解绑，不然会多次出发
    // 排序查询
    this.$bus.$on("getiyset", val => {
      this.order_field = val.sort_field;
      this.sort = val.sort;
      this.getpost();
    });
  },
  methods: {
    // 点击导出事件
    onAddDocumentExcelout() {
      this.$bus.$emit("getclassifysetExcelout");
    },
    onSearch() {
      this.defaultCurrent = 1;
      this.$bus.$emit("getclassifysetPage", 1);
      this.getpost();
    },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      if (this.form.name.length < 16 && this.form.name.length != 0) {
        if (this.form.name == " ") {
          this.$message.error(`请输入分类名称`);
        } else {
          this.addpost();
          this.visible = false;
          this.form.name = "";
        }
      }
    },
    // 新建收文类别
    addpost() {
      // 点击确定发送新建发文分类请求
      Addpost({ name: this.form.name, type: 2 }).then(res => {
        if (res.code == 1) {
          // 通知重新渲染页面
          this.$bus.$emit("getclassifysetReloadList");
        }
      });
    },
    // 查询发文列表
    getpost() {
      // 点击点查询获取发文列表
      Getpost({
        type: 2,
        kwd: this.Searchterms,
        limit: this.defaultPageSize,
        page: 1,
        order_field: this.order_field,
        sort: this.sor
      }).then(res => {
        if (res.code == 1) {
          this.$bus.$emit("getclassifysetGetpostList", {
            data: res.data,
            getpostList: true,
            current: res.count
          });
        }
      });
    }
  }
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
.Dottedline {
  height: 20px;
  border-right: 1px dashed #ababab;
  margin: 0px 14px 0px 16px;
}
.Printing {
  margin-right: 8px;
}
/deep/.ant-form-item-control {
  width: 322px;
}
/deep/.ant-form-item-control-wrapper {
  width: 322px;
  display: inline-block;
}
/deep/.ant-form-item-label {
  vertical-align: top;
  margin-right: 10px;
}
</style>