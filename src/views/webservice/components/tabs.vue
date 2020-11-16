<template>
  <div class="tabs">
    <a-tabs :default-active-key="tabsarry.data[0].value" @change="tabsKey">
      <template v-for="item in tabsarry.data">
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
  components: {
    SvgIcon
  },
  methods: {
    tabsKey(key) {
      this.$bus.$emit("distributePostIsget", key);
    }
  }
};
</script>
<style lang="less" scoped>
.tabs {
  height: 45px;
}
/deep/.ant-tabs-nav-scroll {
  line-height: 21px;
  color: #909499;
}
/deep/.ant-tabs {
  height: 45px;
}
</style>