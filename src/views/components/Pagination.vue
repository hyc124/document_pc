<template>
  <div class="page">
    <a-pagination
      @showSizeChange="onShowSizeChange"
      show-size-changer
      v-model="paging.current"
      :total="paging.total"
      @change="pageChange"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      current: 1
    };
  },
  props: ["paging"],
  methods: {
    // 页数发生变化是
    pageChange(page) {
      this.$emit("pageChange", page);
    },
    // 每页条数发生变化的时候
    onShowSizeChange(current, size) {
      this.$emit("currentchange", size);
    }
  }
};
</script>

<style lang="less" scoped>
.page {
  border-top: 1px solid #e6edf5;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 13px 0px;
}
</style>