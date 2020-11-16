<template>
  <div>
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>6666666666</Maincontent>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
export default {
  components: {
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
</style>