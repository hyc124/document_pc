<template>
  <div class="header flex-col">
    <div>
      <a-input-search
        placeholder="请输入流程名称关键字查询"
        v-model="Searchterms"
        enter-button
        style="width: 260px"
        @search="onSearch"
        :maxLength="20"
      />
    </div>
    <div>
      <a-button type="primary" @click="onInquire">新建</a-button>
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
    // 查询
    onSearch() {
      this.$bus.$emit("postflowpathsetGetdatakwd", this.Searchterms);
    },
    // 新建
    onInquire() {
      this.$router.push({ path: "/postflowpathset/postflowpathadd" });
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