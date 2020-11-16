<template>
  <div class="header flex-col">
    <div>
      <a-input-search
        placeholder="请输入关键字"
        v-model="Searchterms"
        style="width: 422px"
      />
      <a-button type="primary" class="headerbtn">查询</a-button>
    </div>
    <div>
      <a-button  class="bnt_architecture">批量同步组织架构</a-button>
      <a-button type="primary" @click="onSearch">添加应用</a-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Header",
  data() {
    return {
      Searchterms: "" // 搜索词
    };
  },
  created() {},
  methods: {
    onSearch() {
      this.$router.push({ name: "addapplication", params: { id: 1 } });
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  justify-content: space-between;
  height: 60px;
  // margin-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid #e4e7ed;
  .headerbtn {
    margin-left: 20px;
  }
  .bnt_architecture{
      margin-right: 20px;
  }
}
</style>