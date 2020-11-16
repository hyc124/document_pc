<template>
  <div>
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <Header />
      <Main class="Main" />
    </Maincontent>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import Header from "./components/header.vue";
import Main from "./components/main.vue";
export default {
  name: "Accept",
  data() {
    return {
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
    Maincontent
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