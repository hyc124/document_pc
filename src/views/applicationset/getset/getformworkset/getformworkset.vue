<template>
  <div>
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <Header />
      <Main />
    </Maincontent>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import Header from "./components/header.vue";
import Main from "./components/main.vue";
export default {
  name: "GetFormWorkSet",
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
  mounted() {},
  methods: {}
};
</script>
<style lang="less" scoped>
/deep/.maincontent {
  padding-top: 10px;
}
</style>