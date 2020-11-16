<template>
  <div class="filesets">
    <div class="filesets-line">
      <div>{{percent.name}}</div>
      <div class="right">{{percent.status|onstatus}}</div>
    </div>
    <div class="filesets-line">
      <a-progress :percent="percent.num" />
    </div>
  </div>
</template>
<script>
export default {
  name: "Filesets",
  data() {
    return {
      //   percent: 40
    };
  },
  props: ["percent"],
  watch: {
    percent(v, i) {
      console.log(v);
      console.log(i);
    }
  },
  created() {},
  methods: {},
  filters:{
    onstatus(status){
      let text = ''
      if(status==1){
        text = '文件上传中。。。'
      }else if(status==2){
        text = '文件上传成功'
      }else{
        text = '文件上传失败'
      }
      return text
    }
  }
};
</script>
<style lang="less" scoped>
.filesets {
  margin: 10px 0;
  margin-right: 20px;
  .filesets-line {
    display: flex;
    line-height: 20px;
  }
  .right{
    margin-left: 20px;
  }
}
/deep/ .ant-progress-bg {
  transition: all linear 0.1s !important;
}
</style>