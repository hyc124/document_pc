
<template>
  <div class="enclosure">
    <div class="flex-col">
      <span class="left">附件方式</span>
      <a-checkbox @change="onChange" v-model="value">上传附件</a-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  name: "Enclosure",
  components: {},
  data() {
    return {
      value: true,
    };
  },
  methods: {
    onChange(e) {
      if (e.target.checked) {
        this.$emit("onChangeEnclosure", 1);
      } else {
        this.$emit("onChangeEnclosure", 0);
      }
      // if(e.target.value){
      //   this.$bus.$emit('worksetgetdocument')
      //   this.$bus.$emit('postsetcentertext')
      // }
    },
  },
};
</script>

<style lang="less" scoped>
.enclosure {
  padding-top: 14px;
  width: 1200px;

  .flex-col {
    width: 100%;
    height: 46px;
    line-height: 46px;
    background-color: #fff;
    border: 1px solid #ccc;
  }
  .left {
    text-align: center;
    display: inline-block;
    color: #303133;
    font-size: 14px;
    background-color: #f9f9f9;
    width: 150px;
    height: 100%;
    border-right: 1px solid #ccc;
    margin-right: 31px;
  }
  .radioleft {
    margin-right: 40px;
  }
}
</style>