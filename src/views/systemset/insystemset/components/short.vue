<template>
  <div class="main">
    <Maincontent>
      <div class="short-content">
        <!-- 是否开启短信验证 -->
        <div class="item">
          <span>是否开启短信验证:</span>
          <a-radio-group value='1' style="margin-bottom: 0">
          <a-radio value='1'>开启</a-radio>
          <a-radio value='2'>关闭</a-radio>
          </a-radio-group>
        </div>
        <!-- input框 -->
        <div class="item">
          <span style="margin-left: 58px;">短信appid:</span>
          <a-input placeholder v-model="appid" />
        </div>
        <div class="item">
          <span style="margin-left: 47px;">短信appkey:</span>
          <a-input placeholder v-model="appkey" />
        </div>
        <div class="item">
          <span style="margin-left: 49px;">短信签名ID:</span>
          <a-input placeholder v-model="signid" />
        </div>
        <div class="item">
          <span style="margin-left: 8px;">短信验证码模板ID:</span>
          <a-input placeholder v-model="codeid" />
        </div>
        <div class="item">
          <span style="margin-left: 8px;">短信通知类模板ID:</span>
          <a-input placeholder v-model="informid" />
        </div>
        <div class="item">
          <span>短信验证码过期时间:</span>
          <a-input placeholder="设置短信验证码多少分钟过期" v-model="codepast" />
        </div>
        <div class="item">
          <span style="margin-left: 36px;">短信发送频率:</span>
          <a-input placeholder="设置多少分钟发送一次" v-model="shortfreq" />
        </div>
        <!-- 提交按钮 -->
        <div>
          <a-button type="primary" @click="submit">保存设置</a-button>
        </div>
      </div>
    </Maincontent>
  </div>
</template>

<script>
import Maincontent from "@/views/components/maincontent.vue";
export default {
  components: {
    Maincontent
  },
  data() {
    return {
      appid: null, //短信appid
      appkey: null, //短信appkey
      signid: null, //短信签名id
      codeid: null, //短信验证码id
      informid: null, //短信通知类模板id
      codepast: null, //短信验证码过期时间
      shortfreq: null //短信发送频率
    };
  },
  methods: {
    //   保存设置
    submit(){}
  }
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 20px;
  .short-content {
      .ant-radio-group{
          width: auto;
      }
    /deep/.item {
      width: 535px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      &:nth-child(1) {
        width: 266px;
      }
      .ant-input {
        width: 400px;
      }
      input::-webkit-input-placeholder {
        text-align: right;
      }
    .ant-btn{
        margin-left: 135px;
        width: 125px;
        text-align: center;
    }
    }
  }
}
</style>