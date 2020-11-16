
<template>
  <div class="dataJurisdiction">
    <div class="box">
      <div class="title">数据权限 (设置该角色的用户可以操作的数据的范围)</div>
      <div class="content">
        <a-radio-group :disabled="grade==1" @change="data_change" v-model="value">
          <div class="radio">
            <a-radio :style="radioStyle" :value="4">个人</a-radio>
            <span>只能操作自己的数据和查看下属的数据</span>
          </div>
          <div class="radio">
            <a-radio :style="radioStyle" :value="3">所属部门</a-radio>
            <span>只能操作自己的数据和查看下属和自己所属部门的数据</span>
          </div>
          <div class="radio">
            <a-radio :style="radioStyle" :value="2">所属部门及下属部门</a-radio>
            <span>只能操作自己的数据和查看下属和自己所属部门及其子部门的数据</span>
          </div>
          <div class="radio">
            <a-radio :style="radioStyle" :value="1">全公司</a-radio>
            <span>能操作全公司的数据</span>
          </div>
        </a-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["dataJurisdiction", "grade"],
  data() {
    return {
      value: 1,
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px"
      }
    };
  },
  methods: {
    data_change(e) {
      this.$emit("data_node_ids", this.value);
    }
  },
  created() {},
  watch: {
    dataJurisdiction() {
      this.value = this.dataJurisdiction;
    }
  }
};
</script>

<style lang="less" scoped>
.dataJurisdiction {
  .box {
    margin-bottom: 30px;
    .title {
      height: 48px;
      background: rgba(245, 247, 250, 1);
      border: 1px solid rgba(235, 238, 245, 1);
      padding: 14px 20px;
      color: #909399ff;
      font-size: 14px;
    }
    .content {
      border: 1px solid rgba(235, 238, 245, 1);
      padding: 20px;

      flex-wrap: wrap;

      .radio {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        /deep/ .ant-radio-wrapper {
          width: 200px;
        }
      }

      /deep/ .active {
        color: #0082efff;
      }
      /deep/ .ant-checkbox-wrapper {
        width: 150px;
        margin-right: 60px;
        margin-left: 0;
        margin-bottom: 20px;
      }
    }
  }
}
</style>