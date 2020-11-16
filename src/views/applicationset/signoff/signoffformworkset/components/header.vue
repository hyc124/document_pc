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
    <div>
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
    this.$bus.$on("signoffformworksetSendpage", val => {
      this.defaultCurrent = val.defaultCurrent;
      this.defaultPageSize = val.defaultPageSize;
    });
    // 刷新页面
    this.$bus.$on("signoffformworksetSetpostList", val => {
      this.defaultCurrent = val.current;
      this.defaultPageSize = val.page;
      this.getpost();
    });
    // 接收到排序
    this.$bus.$on("signoffformworkset", val => {
      this.order_field = val.sort_field;
      this.sort = val.sort;
      this.getpost();
    });
  },
  methods: {
    showModal() {
      this.$router.push({ name: "signoffaddformwork" });
    },
    onSearch() {
      this.defaultCurrent = 1;
      this.$bus.$emit("signoffformworksetPage", 1);
      this.getpost();
    },
    // 查询发文列表
    getpost() {
      // 点击点查询获取发文列表
      GetpostinfoList({
        type: 3,
        kwd: this.Searchterms,
        limit: this.defaultPageSize,
        page: this.defaultCurrent,
        order_field: this.order_field,
        sort: this.sort
      }).then(res => {
        if (res.code == 1) {
          this.$bus.$emit("signoffformworksetsetGetpostList", {
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
  border-radius: 4px 0px 0px 4px;
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
</style>