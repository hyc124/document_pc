<template>
  <div class="not-found">
    <div class="n-left">
      <img src="../../assets/home/not-found.png"
           alt />
    </div>
    <div class="n-right">
      <h2>很抱歉，没有找到相关内容~</h2>
      <p class="tips">请尝试其他查询条件</p>
      <p class="reason">可能原因： 没有查看权限/ 记录为空</p>
    </div>
  </div>
</template>

<script>
export default {
  // view=>传进来的vuex的值
  // show=>弹窗是否显示了
  props: ['view', 'show'],
  data() {
    return {}
  },

  created() {},
  methods: {},
  watch: {},
}
</script>


<style lang="less" scoped>
.not-found {
  display: flex;
  justify-content: space-between;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 334px;
  height: 100px;
  border-radius: 4px;
  text-align: center;
  .n-left {
    width: 72px;
    height: 100px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .n-right {
    color: #909399;
    font-size: 12px;
    text-align: left;
    h2 {
      color: #303133;
      font-size: 16px;
      margin: 0;
    }
    p {
      margin: 0;
    }
    .tips {
      margin-top: 5px;
    }
    .reason {
      margin-top: 16px;
      font-size: 14px;
    }
  }
}
</style>