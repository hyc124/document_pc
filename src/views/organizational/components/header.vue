<template>
  <div class="header">
    <span>{{title}}</span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {

    };
  },
  props: ["title"],
  methods: {},
  mounted() {},
};
</script>

<style lang="less" scoped>
.header {
  height: 60px;
  background: white;
  margin-bottom: 15px;
  font-size: 18px;
  line-height: 60px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;
}
</style>