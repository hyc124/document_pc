<template>
  <div class="footer flex-col">
    <div class="flex-col-bd"></div>
    <a-pagination :default-current="1" :total="500" />
  </div>
</template>
<script>
export default {
  name: "Footer",
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style lang="less" scoped>
.footer {
  height: 60px;
  padding: 0 20px;
}
</style>