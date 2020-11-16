<template>
  <div>
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <Tabs :tabsarry="tabsarry"></Tabs>
      <Header />
      <Main class="Main" />
    </Maincontent>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import Tabs from "../components/tabs.vue";
import Header from "./components/header.vue";
import Main from "./components/main.vue";
export default {
  name: "Accept",
  data() {
    return {
      tabsarry: {
        type: 1,
        data: [
          { name: "全部", value: "", icon: "分发全部" },
          { name: "发文", value: 1, icon: "分发发文" },
          { name: "收文", value: 2, icon: "分发收文" }
        ]
      },
      // 头部需要的开关集合
      titleObj: {
        retu: false // 返回开关
      }
    };
  },
  components: {
    Header,
    Main,
    Maintitle,
    Maincontent,
    Tabs
  },
  created() {},
  methods: {}
};
</script>
<style lang="less" scoped>
.Main {
  padding: 4px 0px 0px;
}
</style>