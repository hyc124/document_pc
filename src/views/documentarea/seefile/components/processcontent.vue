<template>
  <div class="processcontent">
    <div class="process process-title">
      <div class="process-title-box"></div>
      <span>流程处理</span>
    </div>
    <div class="process process-tabs">
      <template v-for="(item, index) in processtabs">
        <div
          :class="['process-tabs-cl hand',index == 0 ?'process-tabs-pd-rt':'process-tabs-pd process-tabs-leftborder',index == tabs_index?'process-tabs-cl-active':'']"
          :key="index"
          @click="processTab(index)"
        >{{item}}</div>

        <!-- <div class="process-tabs-cl process-tabs-pd process-tabs-leftborder hand">流程走向</div>
        <div class="process-tabs-cl process-tabs-pd process-tabs-leftborder hand">流程日志</div>-->
      </template>
    </div>
    <div class="flows">
      <transition :name="active_index>tabs_index?'slidel-fade':'slider-fade'">
        <div v-show="tabs_index==0">
          <Flowstate />
        </div>
      </transition>
      <transition :name="active_index>tabs_index?'slidel-fade':'slider-fade'">
        <div v-show="tabs_index==1">
          <Flowtrend />
        </div>
      </transition>
      <transition :name="active_index>tabs_index?'slidel-fade':'slider-fade'">
        <div v-show="tabs_index==2">
          <Flowlog />
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
let processtabs = ["流程处理", "流程走向", "流程日志"];
import Flowstate from "../flowcompoents/flowstate.vue";
import Flowtrend from "../flowcompoents/flowtrend.vue";
import Flowlog from "../flowcompoents/flowlog.vue";
export default {
  name: "Processcontent",
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
@import url("../compoentscss/index.less");

.flows {
  width: 100%;
  padding: 30px 0;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slider-fade-enter-active {
  transition: all 0.3s ease;
}
.slider-fade-leave-active {
  // transition: all 0.8s ease;
}
.slider-fade-enter, .slider-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(100%);
  opacity: 0;
}

.slidel-fade-enter-active {
  transition: all 0.3s ease;
}
.slidel-fade-leave-active {
  // transition: all 0.8s ease;
}
.slidel-fade-enter, .slidel-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(-100%);
  opacity: 0;
}
</style>