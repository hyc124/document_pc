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
    <a-modal v-model="visible" cancelText="取消" okText="确定" title="新建签报分类" @ok="handleOk">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item ref="name" label="分类名称" prop="name">
          <a-input v-model="form.name"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
// 引入ajax
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
    // 接收到传来的页数和码数
    this.$bus.$on("signoffclassifysetSendpage", val => {
      this.defaultCurrent = val.defaultCurrent;
      this.defaultPageSize = val.defaultPageSize;
    });
    // 刷新页面
    this.$bus.$on("signoffclassifysetSetpostList", val => {
      this.defaultCurrent = val.current;
      this.defaultPageSize = val.page;
      this.getpost();
    });
    // 排序查询
    this.$bus.$on("signoffifyset", val => {
      this.order_field = val.sort_field;
      this.sort = val.sort;
      this.getpost();
    });
  },
  methods: {
    // 点击导出事件
    onAddDocumentExcelout() {
      this.$bus.$emit("signoffclassifysetExcelout");
    },
    onSearch() {
      this.defaultCurrent = 1;
      this.$bus.$emit("signoffclassifysetclasspage", 1);
      this.getpost();
    },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      if (this.form.name.length < 16 && this.form.name.length != 0) {
        this.addpost();
        this.visible = false;
        this.form.name = "";
      }
    },
    // 查询发文列表
    getpost() {
      // 点击点查询获取发文列表
      Getpost({
        type: 3,
        kwd: this.Searchterms,
        limit: this.defaultPageSize,
        page: this.defaultCurrent,
        order_field: this.order_field,
        sort: this.sort
      }).then(res => {
        if (res.code == 1) {
          this.$bus.$emit("signoffclassifysetGetpostList", {
            data: res.data,
            getpostList: true,
            total: res.count
          });
        }
      });
    },
    // 新建发文类别
    addpost() {
      // 点击确定发送新建发文分类请求
      Addpost({ name: this.form.name, type: 3 }).then(res => {
        if (res.code == 1) {
          // 通知重新渲染页面
          this.$bus.$emit("signoffclassifysetReloadList");
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
/deep/.ant-form-item-control{
  width: 322px;
}
/deep/.ant-form-item-control-wrapper{
width: 322px;
display: inline-block;
}
/deep/.ant-form-item-label{
  vertical-align: top;
  margin-right: 10px;
}
</style>