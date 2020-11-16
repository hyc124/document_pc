<template>
  <div>
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <Header />
      <Main class="Main" />
      <Footer />
    </Maincontent>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import Header from "./components/header.vue";
import Footer from "./components/footer.vue";
import Main from "./components/main.vue";
export default {
  components: {
    Header,
    Main,
    Footer,
    Maintitle,
    Maincontent
  },
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: false // 返回开关
      }
    };
  }
};
</script>
<style lang="less" scoped>
.Main {
  height: calc(100% - 120px);
}
</style>