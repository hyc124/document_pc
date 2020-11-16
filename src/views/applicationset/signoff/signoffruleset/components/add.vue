<template>
  <div class="signoffrulesetadd">
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
.signoffrulesetadd {
  height: 100%;
}
</style>