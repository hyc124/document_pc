<template>
  <div class="attachment">
    <div class="ruleform">
      <div class="form-inline twoform">
        <div class="form-inline-title">
          <span class="title-name">附件内容</span>
        </div>
        <div class="form-inline-box">
          <div class="form-inline-input-group">
            <a-button class="seefile-link" type="link">上传附件</a-button>
            <a-button class="seefile-link" type="link">全部下载</a-button>
          </div>
        </div>
      </div>
      <div class="threeform-inline twoformh">
        <template v-for="(item, index) in 10">
          <div class="threeform-inline-row" :key="index">
            <div class="threeform-inline-row-c threeform-inline-row-left">
              <a-icon class="threeform-inline-row-left-icon" type="file-word" />
              <span class="threeform-inline-row-name">公文{{item}}。docx</span>
            </div>
            <div class="threeform-inline-row-c threeform-inline-row-right">
              <a-icon class="threeform-inline-row-right-icon hand" type="eye" title="查看" />
              <a-icon
                class="threeform-inline-row-right-icon hand"
                type="cloud-download"
                title="下载"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Attachment",
  data() {
    return {
      // formarry
    };
  },
  created() {},
  methods: {}
};
</script>
<style lang="less" scoped>
@import url("../compoentscss/index.less");
</style>