<template>
  <div class="tabs">
    <a-tabs :default-active-key="tabsarry[0].value" @change="changeTab">
      <template v-for="item in tabsarry">
        <a-tab-pane :key="item.value">
          <span slot="tab">
            <SvgIcon :item="item.icon" />
            {{item.name}}
          </span>
        </a-tab-pane>
      </template>
    </a-tabs>
  </div>
</template>
<script>
import SvgIcon from "@/views/components/svgicon.vue";
export default {
  name: "Tabs",
  data() {
    return {};
  },
  props: ["tabsarry"],
  components: { SvgIcon },
  created() {},
  methods: {
    changeTab(e) {
      this.$emit("changeTab", e);
      this.$bus.$emit('DocumentareaTabs');
    }
  }
};
</script>
<style lang="less" scoped>
.tabs {
  height: 45px;
}
/deep/.ant-tabs-bar {
  margin: 0;
}
</style>