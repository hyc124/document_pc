<template>
  <div class="signoffRilesetendit">
    <Add :type='3'/>
  </div>
</template>

<script>
import Add from "@/views/applicationset/components/ruleAdd/ruleAdd.vue";
export default {
  components: {
    Add
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.signoffRilesetendit {
  height: 100%;
}
</style>