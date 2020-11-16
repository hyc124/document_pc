<template>
  <div class="maintitle">
    <span>{{title}}</span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Maintitle",
  data() {
    return {
      title: ""
    };
  },
  methods: {},
  created() {
    this.title = this.$route.meta.name;
  },
  watch: {
    $route(to, from) {
      this.title = to.meta.name;
    }
  },
  computed: {}
};
</script>

<style lang="less">
.maintitle {
  padding: 0 20px;
  height: 60px;
  background: white;
  margin-bottom: 15px;
  font-size: 18px;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
}
</style>