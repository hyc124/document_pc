<template>
  <div class="postrulesetedit">
    <Add :type='1'/>
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
.postrulesetedit {
  height: 100%;
}
</style>