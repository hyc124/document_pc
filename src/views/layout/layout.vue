<template>
  <div class="layout">
    <Header />
    <div class="main minw">
      <ListBox />
      <div class="main_right"
           id="main_bottom">
        <router-view class="main_bottom" />
      </div>
    </div>
    <Footer />
    <router-link to="/footLink"
                 class="Contact-customer-service hand">
      <img src="../../assets/adddraft/service.png"
           alt
           class="Contact-customer-service-img" />
      联系客服
    </router-link>
    <!-- 返回顶部 -->

    <a-back-top>
      <div class="img">
        <span>顶部</span>
      </div>
    </a-back-top>
  </div>
</template>

<script>
import ListBox from './components/listbox.vue'
import Header from './components/header.vue'
import Footer from './components/footer.vue'
export default {
  name: 'layout',
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  components: { ListBox, Header, Footer },
}
</script>

<style scoped lang="less">
.layout {
  padding-top: 61px;
  min-height: calc(100vh);
  .header {
    height: 64px;
    background: #ffffff;
    box-shadow: 0px 3px 8px rgba(30, 31, 33, 0.06);
    position: fixed;
    top: 0px;
    z-index: 13;
  }
  .main {
    margin: 18px auto 0px;
    max-width: 1280px;
    display: flex;
    min-height: calc(100vh - 169px);
    .main_right {
      flex: 1;
      width: 100%;
      .main_bottom {
        width: 100%;
        height: 100%;
      }
    }
  }
  .Contact-customer-service {
    width: 32px;
    height: 128px;
    box-shadow: 0px 2px 4px rgba(00, 00, 00, 0.16);
    position: fixed;
    right: 0px;
    bottom: 206px;
    background: #ffffff;
    text-align: center;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    padding: 0 3px;
    color: #0082ef;
    .Contact-customer-service-img {
      width: 16px;
      height: 16px;
      margin: 10px auto 6px;
    }
  }

  /deep/ .ant-back-top {
    width: 50px;
    height: 50px;

    .img {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      background: url('../../assets/adddraft/totop.png');
      background-size: 50px 50px;
      color: white;
      font-size: 12px;
      span {
        margin-top: 20px;
      }
    }
  }
  .to-top {
    position: fixed;
    width: 50px;
    height: 50px;
    right: 60px;
    bottom: 100px;
    z-index: 99999;
    /deep/ .ant-back-top {
      right: 60px !important;
      bottom: 100px !important;
    }
  }
}
</style>