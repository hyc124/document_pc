<template>
  <div class="bodycontent">
    <div class="ruleform">
      <div class="form-inline twoform">
        <div class="form-inline-title">
          <span class="title-name">正文内容</span>
        </div>
        <div class="form-inline-box">
        </div>
      </div>
      <div class="twoform-inline twoformh">
        <a-textarea v-model="text" class="twoform-textarea"></a-textarea>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Bodycontent",
  data() {
    return {
      // formarr
      text:''
    };
  },
  created() {
    this.$bus.$on('SendContent',val=>{
      this.ONchange()
    })
  },
  methods: {
    ONchange(){
      this.$bus.$emit('examineSendText',this.text)
    }
  },
};
</script>
<style lang="less" scoped>
@import url("../compoentscss/index.less");
</style>