<template>
  <div class="publicPage">
    <template v-if="type!=0">
      <Jurisdiction :type="type" />
    </template>
  </div>
</template>
<script>
import Jurisdiction from "@/views/publicPage/Jurisdiction/Jurisdiction.vue";
export default {
  name: "publicPage",
  data() {
    return {
      type: 0 // 展示类型 1 等于无操作权限，2等于无可见权限
    };
  },
  components: {
    Jurisdiction
  },
  created() {
    this.type = this.$route.query.type;
  },
  methods: {}
};
</script>
<style lang="less" scoped>
body,
html {
  width: 100%;
  height: 100%;
}
.publicPage {
  background: #fafafa;
  padding: 1px;
  height: 100%;
}
</style>