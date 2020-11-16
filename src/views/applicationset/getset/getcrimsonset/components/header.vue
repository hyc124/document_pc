<template>
  <div class="header flex-col">
    <div>
      <a-input-search
        placeholder="请输入关键字"
        v-model="Searchterms"
        enter-button
        style="width: 260px"
        @search="onInquire"
        :maxLength="20"
      />
    </div>
    <div>
      <a-button @click="onSearch" type="primary">新建</a-button>
    </div>
  </div>
</template>
<script>
import { Inquireloadcrims, Getloadcrims } from "@/api/postcrimsonset.js";
export default {
  name: "Header",
  data() {
    return {
      Searchterms: "", // 搜索词
      defaultCurrent: 1,
      defaultPageSize: 0,
      sort: null,
      field: null
    };
  },
  created() {
    // 接收到传来的页数和码数
    this.$bus.$on("getsendpage", val => {
      this.defaultCurrent = val.defaultCurrent;
      this.defaultPageSize = val.defaultPageSize;
    });
    // 刷新页面
    this.$bus.$on("getsetpostList", val => {
      this.defaultCurrent = val.current;
      this.defaultPageSize = val.page;
      this.getpost();
    });
    // 接收排序顺序
    this.$bus.$on("getcrimsonset", val => {
      this.sort = val.sort;
      this.field = val.field;
    });
  },
  methods: {
    onSearch() {
      this.$router.push({
        path: "/getcrimsonset/getcrimsonadd",
        query: { type: 1 }
      });
    },
    // 查询
    onInquire() {
      this.defaultCurrent = 1;
      this.$bus.$emit("getcrimsonset", 1);
      this.inquireloadcrimss();
    },
    // 查询套红模板
    inquireloadcrimss() {
      Inquireloadcrims({
        keyword: this.Searchterms,
        page: 1,
        type: 2,
        sort: this.sort,
        order_field: this.field
      }).then(res => {
        if (res.code == 1) {
          this.$bus.$emit("getloadList", {
            res: res.data.data,
            getpostList: true,
            total: res.data.count
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
  /deep/ .ant-input {
    border-radius: 4px 0px 0px 4px;
  }
  /deep/.ant-input-wrapper.ant-input-group .ant-btn-primary {
    color: #dadadb;
    background-color: #fff;
    border-color: #dadadb;
  }
}
</style>