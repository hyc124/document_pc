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
      <a-button type="primary" @click="goDetailPage(1)">新建</a-button>
    </div>
  </div>
</template>
<script>
import { Addsecrecy } from "@/api/secrecy.js";

export default {
  name: "Header",
  data() {
    return {
      // 搜索词
      keyword: "", // 新建密级名称输入框关键字
    };
  },
  created() {},
  methods: {
    goDetailPage(type) {
      this.$router.push(`/company/companyadd?type=${type}`);
    },
    onSearch() {
      this.$bus.$emit("CompanyPage", this.keyword);
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  justify-content: space-between;
  height: 60px;
  /deep/ .ant-input-wrapper.ant-input-group .ant-btn-primary {
    color: #dadadb;
    background-color: #fff;
    border-color: #dadadb;
  }
}
</style>