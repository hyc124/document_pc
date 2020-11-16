<template>
  <!-- <div class="custom-icons-list"> -->
  <div>
    <time-icon />
  </div>
  <!-- </div> -->
</template>
<script>
// 发文拟稿
const Time = {
  template: `
  <svg xmlns="http://www.w3.org/2000/svg" width="16.002" height="16.501" viewBox="0 0 16.002 16.501">
  <path id="联合_88" data-name="联合 88" class="cls-1" d="M3938.482,9247.591v-9h0v-5h4v-1.5h1v1.5h5v-1.5h1v1.5h4v14Zm1-1h13v-8h-13Zm0-9h13v-3h-3v1.5h-1v-1.5h-5v1.5h-1v-1.5h-3Zm1.5,7v-1h4v1Zm0-3v-1h10v1Z" transform="translate(-3937.979 -9231.59)"/>
</svg>
  `
};
const TimeIcon = {
  template: `
    <a-icon :component="Time" />
  `,
  data() {
    return {
      Time
    };
  }
};

export default {
  name: "SvgIcon",
  components: {
    TimeIcon,
  },
  created(){
  }
};
</script>
<style scoped>
.custom-icons-list >>> .anticon {
  margin-right: 6px;
}
</style>
