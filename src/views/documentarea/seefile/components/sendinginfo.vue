<template>
  <div class="sendinginfo">
    <div class="ruleform">
      <template v-for="(item, index) in formarry">
        <div class="form-inline" :key="index">
          <div class="form-inline-title">
            <span class="title-name">{{item.name}}</span>
          </div>
          <div class="form-inline-box form-inline-input">
            <span class="title-input">{{item.name}}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
let formarry = [
  {
    name: "收文标题"
  },
  {
    name: "收文字号"
  },
  {
    name: "密级程度"
  },
  {
    name: "紧急程度"
  },
  {
    name: "主送单位"
  },
  {
    name: "抄送人/单位"
  },
  {
    name: "核稿人"
  },
  {
    name: "拟送单位"
  }
];
export default {
  name: "Sendinginfo",
  data() {
    return {
      formarry
    };
  },
  created() {
  },
  methods: {
    
  }
};
</script>
<style lang="less" scoped>
@import url("../compoentscss/index.less");
</style>