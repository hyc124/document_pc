<template>
  <div class="main">
    <Header class="Header" />
    <div class="title flex-col hand" @click="onGo_back">
      <img src="../../../assets/left.png" class="retuLeft" alt />联系我们
    </div>
    <div class="content">
      <div class="code-content">
        <div class="left-img">
          <img src="../../../assets/bottomlink/1.jpg" alt />
        </div>
        <div class="right-content" style="width:50%">
          <p style="width:80%" class="describe">
            感谢您对我们的信任和支持，如果系统有BUG、或者您有好的功能建议，欢迎反馈！
            我们会及时进行处理，对系统进行优化和升级，让您有更好的使用体验！
            客服电话：
            <span
              class="phone"
            >4000-2828-80</span>
          </p>
          <div>
            <img src="../../../assets/bottomlink/2.jpg" alt width="30%" />
            <p class="hint">联系客服,请微信扫码添加</p>
          </div>
        </div>
      </div>
    </div>
    <Footer class="Footer" />
  </div>
</template>

<script>
import Header from "@/views/layout/components/header.vue";
import Footer from "@/views/layout/components/footer.vue";
export default {
  components: {
    Header,
    Footer
  },
  methods: {
    onGo_back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.retuLeft {
  width: 16px;
  height: 12px;
  margin-right: 5px;
}
.main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(233, 234, 235);
}
.title {
  color: #333;
  width: 1280px;
  padding: 0px 20px;
  line-height: 60px;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  background: #ffffff;
  margin: 20px auto 15px;
}
.content {
  background: #fff;
  width: 1280px;
  margin: 0px auto;
  height: calc(100vh - 64px - 60px - 35px - 144px);
  display: flex;
  align-items: center;
  .code-content {
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .hint {
    font-size: 13px;
    color: #333;
    margin-top: 15px;
    padding-left: 8px;
  }
  .describe {
    margin: 0 0 10px 6px;
    .phone {
      font-weight: bold;
      color: #0183f0;
    }
  }
}
</style>