<template>
  <div class="getrulesetadd">
    <Add :type='2'/>
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
.getrulesetadd {
  height: 100%;
}
</style>