<template>
  <div>
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1">
          <span slot="tab">
            <SvgIcon item="拟稿" />收文模板
          </span>
          <InPostRaft />
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <SvgIcon item="草稿" />草稿箱
          </span>
          <DraftBox/>
        </a-tab-pane>
      </a-tabs>
    </Maincontent>
  </div>
</template>
<script>
import SvgIcon from "@/views/components/svgicon.vue";
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import InPostRaft from "./components/inpostraft.vue";
import { GetselectList } from "@/api/draft.js";
import { libraryList } from "@/api/library.js";
import DraftBox from "./components/draftbox.vue";
export default {
  name: "Draft",
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: false // 返回开关
      },
    };
  },
  components: {
    // Header,
    DraftBox,
    InPostRaft,
    Maintitle,
    Maincontent,
    SvgIcon
  },
  mounted() {
  },
  methods: {
    callback(key) {
      if (key !== 0) {
        // 当tab选项值为2的时候告诉子组件获取列表
        this.$bus.$emit("getBoxList");
      }
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.ant-tabs {
  width: 1030px !important;
}
</style>