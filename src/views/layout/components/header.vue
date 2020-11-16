<template>
  <div class="header">
    <div class="center flex-col">
      <div class="img"></div>
      <div >
        <div class="title">公文管理</div>
        <div class="header-log-img">
          用心为您设计好产品
        </div>
      </div>
      <template v-for="(itme,index) in routes">
        <div v-if="powers[index]!=undefined"
             class="name"
             :key="itme.name"
             @click="topclick(index)">
          <div class="header-name-dian"
               v-if="itme.path=='/webservice'&&remindOnOff"></div>
          <router-link :class="index==headerindex?'bule':''"
                       :to="itme.path">{{itme.meta.name}}</router-link>
        </div>
      </template>
      <div class="flex-col-bd"></div>
      <div class="bell hand"
           @click="information">
        <div class="link-one"></div>
        <span class="box flex-col"
              v-if="num>0">
          {{num>99?'99':num}}
          <span v-if="num>99">+</span>
        </span>
      </div>
      <div class="link hand"
           v-clipboard:copy="copyUrl"
           v-clipboard:success="onCopy"
           v-clipboard:error="onError"
           @click="copy"></div>
      <router-link to="/footLink">
        <div class="link two">联系客服</div>
      </router-link>
      <div class="userimg">
        <img :src="userimg" />
      </div>
    </div>
  </div>
</template>

<script>
import { msg_count } from '@/api/home'
export default {
  name: 'Header',
  data() {
    return {
      userimg: require('../../../assets/addpostset/headImg-nav.png'),
      copyUrl: '',
      num: '',
    }
  },
  created() {
    this.userimg = this.$store.state?.userinfo?.avatar
    if (this.$route.path !== '/messagecenter') {
      this.get_msg_count()
    }
    //当用户进入消息中心时更新数据
    this.$bus.$off('updata_get_msg_count')
    this.$bus.$on('updata_get_msg_count', this.get_msg_count)
  },
  computed: {
    // 获取当前路由的子路由
    routes() {
      let routes = {
        children: this.$router.options.routes,
      }
      return routes.children
    },
    headerindex() {
      return this.$store.state.headerindex
    },
    // 权限数据
    powers() {
      return this.$store.state.jurisdiction
    },
    // 公文交换未读提醒状态
    remindOnOff() {
      return this.$store.state.remindOnOff
    },
  },
  methods: {
    topclick(num) {
      this.$store.commit('CLICKHEADER', { num })
    },
    // 获取消息数量
    async get_msg_count() {
      let { data, new_cir } = await msg_count()
      this.$store.commit('REMINDONOFF', new_cir > 0)
      this.num = data
    },
    // 点击复制本页链接
    copy() {
      this.copyUrl = window.location.href
    },
    onCopy() {
      this.$message.success('页面链接复制成功')
    },
    onError() {
      this.$message.success('页面链接复制失败')
    },
    // 新消息提醒
    information() {
      this.$router.push('/messagecenter')
    },
  },
}
</script>

<style lang="less" scoped>
.header {
  height: 64px;
  background: #ffffff;
  width: 100%;

  .center {
    height: 64px;
    width: 1280px;
    margin: 0 auto;
    .header-icon {
      color: #0082ef;
      font-size: 30px;
      height: 100%;
      padding-top: 10px;
      position: relative;
      &:hover .header-icon-linkbox {
        padding-top: 1px;
        padding-bottom: 16px;
        height: auto;
      }
      .header-icon-linkbox {
        width: 136px;
        box-shadow: 0px 0px 6px rgba(00, 00, 00, 0.16);
        background: #ffffff;
        height: 0px;
        overflow: hidden;
        position: absolute;
        left: -10px;
        top: 60px;
        transition: all 0.1s linear;
        .header-linkbox-text {
          font-size: 14px;
          margin-top: 16px;
          text-align: center;
          font-weight: 900;
          color: #303133;
        }
      }
    }
    .img {
      width: 36px;
      height: 36px;
      background: url('../../../assets/addpostset/logo.png') no-repeat;
      background-size: 34px 34px;
    }
    .title {
      color: #303133;
      font-size: 18px;
      margin: 0px 43px 0px 9px;
      font-weight: 600;
    }
    .header-log-img {
      margin-left: 9px;
      color: #929292;
      font-size: 12px;
      font-family: STKaiti;
    }
    .name {
      font-size: 15px;
      font-weight: 600;
      position: relative;
      .header-name-dian {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: red;
        position: absolute;
        top: 18px;
        right: 10px;
      }
      a {
        display: inline-block;
        padding: 0px 16px;
        color: #303133;
        line-height: 60px;
      }
      .bule {
        color: #0082ef;
        background: #e5f2fe;
      }
    }
    .link {
      width: 17px;
      height: 17px;
      background: url('../../../assets/addpostset/link.png');
      background-size: 17px 17px;
      cursor: pointer;
      margin-right: 15px;
    }
    .bell {
      position: relative;
      display: flex;
      .box {
        position: absolute;
        line-height: 16px;
        min-width: 30px;
        padding: 0 5px;
        top: -9px;
        right: 2px;
        background: #ff0000;
        border-radius: 8px;
        color: white;
        font-size: 12px;
        justify-content: center;
        span {
          position: relative;
          bottom: 1px;
          font-size: 16px;
        }
      }
    }
    .link-one {
      background: url('../../../assets/addpostset/xiaoxi.png') no-repeat;
      background-size: 15px 20px;
      width: 15px;
      height: 20px;
      display: flex;
      justify-content: flex-end;
      margin-right: 18px;
      color: red;
      font-size: 12px;
      font-weight: bold;
    }
    .two {
      font-size: 12px;
      background: none;
      width: 48px;
    }
    .userimg {
      width: 24px;
      height: 24px;
      // background: url("../../../assets/addpostset/headImg-nav.png");
      // background-size: 24px 24px;
      border-radius: 50%;
      cursor: pointer;
      overflow: hidden;
      img {
        display: block;
        height: 100%;
        width: 100%;
      }
    }
  }
}
</style>