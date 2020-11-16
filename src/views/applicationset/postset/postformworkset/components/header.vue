<template>
  <div class="header">
    <div class="header-box flex-col">
      <a-input-search
        placeholder="请输入关键字"
        v-model="Searchterms"
        enter-button
        style="width: 260px"
        @search="onSearch"
        :maxLength="20"
      />
      <div class="flex-col-bd"></div>
      <a-button @click="showModal" type="primary">新建</a-button>
    </div>
  </div>
</template>
<script>
import { GetpostinfoList } from "@/api/applicationset.js";
export default {
  name: "Header",
  data() {
    return {
      Searchterms: "", // 搜索词,
      defaultCurrent: 1,
      defaultPageSize: 0,
      order_field: null,
      sort: null
    };
  },
  created() {
    // 接收到传来的页数和码数
    this.$bus.$on("postformworksetSendpage", val => {
      this.defaultCurrent = val.defaultCurrent;
      this.defaultPageSize = val.defaultPageSize;
    });
    // 刷新页面
    this.$bus.$on("postformworksetSetpostList", val => {
      this.defaultCurrent = val.current;
      this.defaultPageSize = val.page;
      this.getpost();
    });
    // 接收到排序
    this.$bus.$on("postformworkset", val => {
      this.order_field = val.sort_field;
      this.sort = val.sort;
      this.getpost();
    });
  },
  methods: {
    showModal() {
      this.$router.push({ name: "addformwork" });
    },
    onSearch() {
      this.defaultCurrent = 1;
      this.$bus.$emit("postformPage", 1);
      this.getpost();
    },
    // 查询发文列表
    getpost() {
      // 点击点查询获取发文列表
      GetpostinfoList({
        type: 1,
        kwd: this.Searchterms,
        limit: this.defaultPageSize,
        page: this.defaultCurrent,
        order_field: this.order_field,
        sort: this.sort
      }).then(res => {
        if (res.code == 1) {
          this.$bus.$emit("postformworksetGetpostList", {
            data: res.data,
            getpostList: true,
            total: res.count
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  padding: 1px;
  box-sizing: border-box;
  .header-box {
    height: 32px;
    margin: 23px 0px 15px;
  }
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
.inleft {
  color: #f33636;
}
/deep/ .ant-input {
  border-radius: 4px 0px 0px 4px;
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
</style>