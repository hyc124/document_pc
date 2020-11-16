<template>
  <div class="processcontent">
    <div class="process process-tabs flex-col">
      <template v-for="(item, index) in processtabs">
        <div
          :class="['process-tabs-cl hand process-tabs-pd-rt',index == tabs_index?'process-tabs-cl-active':'']"
          :key="index"
          @click="processTab(index)"
        >{{item}}</div>
      </template>
    </div>
    <div class="flows">
      <transition-group :name="active_index>tabs_index?'slidel-fade':'slider-fade'">
        <div v-show="tabs_index==0" key="a">
          <Flowstate />
        </div>
      </transition-group>
      <transition-group :name="active_index>tabs_index?'slidel-fade':'slider-fade'">
        <div v-show="tabs_index==1" key="b">
          <Flowtrend />
        </div>
      </transition-group>
      <transition-group :name="active_index>tabs_index?'slidel-fade':'slider-fade'">
        <div v-show="tabs_index==2" key="c">
          <Flowlog />
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
let processtabs = ["流程状态", "流程走向", "流程日志"];
import Flowstate from "../other/flowstate.vue";
import Flowtrend from "../other/flowtrend.vue";
import Flowlog from "../other/flowlog.vue";
export default {
  name: "Processcontent",
  props: {},
  data() {
    return {
      // formarry
      processtabs,
      tabs_index: 0,
      active_index: 0
    };
  },
  components: {
    Flowstate,
    Flowtrend,
    Flowlog
  },
  created() {},
  methods: {
    processTab(e) {
      this.active_index = this.tabs_index;
      this.tabs_index = e;
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../../../getmanage/pendingtrial/compoentscss/index");
</style>