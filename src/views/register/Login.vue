<template>
  <div id="main">
    <!-- logo -->
    <div class="logo">
      <div class="left-logo">
        <img src="../../assets/login/logo.png" alt />
        <div class="logo-text">名冠天下公文管理系统</div>
      </div>
    </div>
    <!-- 右侧背景图 -->
    <div class="right-background">
      <!-- <img src="../../assets/login/bag3.png" alt width="1000" /> -->
    </div>
    <!-- 左下背景图 -->
    <div class="left-bottom">
      <!-- <img src="../../assets/login/bag1.png" alt width="700" /> -->
    </div>
    <!-- 右下背景图 -->
    <div class="right-bottom">
      <!-- <img src="../../assets/login/bag2.png" alt width="450" /> -->
    </div>
    <!-- 登录页面 -->
    <div class="login">
      <!-- 左侧内容 -->
      <div class="loginLeft-content">
        <!-- 图标 -->
        <div class="left-icon">
          <img src="../../assets/login/info.png" alt width="71" height="85" />
        </div>
        <div>名冠天下公文管理系统</div>
        <!-- 左边图片 -->
        <div>
          <img
            src="../../assets/login/login1.png"
            alt
            width="270"
            height="265"
          />
        </div>
      </div>
      <!-- 右侧登录表单 -->
      <div class="loginRight-content">
        <!-- 账号密码登录 -->
        <div v-show="!visible">
          <h1>账号登录</h1>
          <a-form-model
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            v-bind="layout"
          >
            <a-form-model-item prop="username" ref="username">
              <div class="inp-title">账号</div>
              <a-input
                v-model="ruleForm.username"
                type="text"
                autocomplete="off"
                placeholder="请输入你的用户名"
                @keyup.enter="submitForm('ruleForm')"
              />
            </a-form-model-item>
            <a-form-model-item prop="password">
              <div class="inp-title">密码</div>
              <a-input
                v-model="ruleForm.password"
                type="password"
                autocomplete="off"
                placeholder="请输入你的密码"
                @keyup.enter="submitForm('ruleForm')"
              />
            </a-form-model-item>
            <a-form-model-item prop="code" class="proof-input">
              <div style="position: relative; margin-left: 2px; width: 265px">
                <div class="inp-title">验证码</div>
                <a-input
                  v-model.number="ruleForm.code"
                  class="inputs"
                  type="text"
                  placeholder="请输入验证码"
                  @keyup.enter="submitForm('ruleForm')"
                />
                <!-- 验证图 -->
                <img class="proof" @click="onImgSrc" :src="imgSrc" alt />
              </div>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-button
                style="width: 265px; height: 40px; margin-left: -46px"
                type="primary"
                @click="submitForm('ruleForm')"
                >登录</a-button
              >
            </a-form-model-item>
          </a-form-model>
          <!-- 企业微信扫码登录 -->
          <div class="sacn-code flex-col hand" @click="cutcode">
            <span class="code-bor-left"></span>
            <div class="flex-col-bd center">
              <img src="../../assets/login/wx.png" alt width="17" height="14" />
              企业微信扫码登录
            </div>
            <span class="code-bor-left"></span>
          </div>
        </div>
        <!-- 扫码 -->
        <div class="login-code" v-show="visible">
          <!-- 二维码 -->
          <div class="code-img" id="wx_reg"></div>
          <!-- 切换账号密码登录 -->
          <div @click="cutcode" class="cut flex-col">
            <span class="code-left-bor"></span>
            <div class="flex-col-bd center">账号密码登录</div>
            <span class="code-left-bor"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 页脚 -->
    <Footer class="footers" />
    <Listbox v-show="false" />
  </div>
</template>
<script>
// 引入页脚
import Footer from "@/views/layout/components/footer.vue";
import { login, userinfo } from "@/api/login.js";
import { HttpUrl } from "@/js/public.js";
import { get_roloe_menu } from "@/api/router.js";
import Listbox from "@/views/layout/components/listbox.vue";
export default {
  data() {
    // 验证码为空提示
    let checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入您的验证码"));
      } else {
        callback();
      }
    };
    // 账号为空提示
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入您的账号"));
      } else {
        callback();
      }
    };
    // 密码为空提示
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入您的密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        password: "",
        code: "",
      },
      rules: {
        // 账号和密码的正则表达式
        username: [{ validator: validatePass, trigger: "change" }],
        password: [{ validator: validatePass2, trigger: "change" }],
        code: [{ validator: checkAge, trigger: "change" }],
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
      // 登录页面切换
      visible: true,
      imgSrc: `${HttpUrl}/document_captcha`,
    };
  },
  created() {
    // 引入线上js
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.src =
      "https://rescdn.qqmail.com/node/ww/wwopenmng/js/sso/wwLogin-1.0.0.js";
    document.body.appendChild(s);
    // 获取登录二维码
    setTimeout(() => {
      userinfo().then((res) => {
        let data = res.data;
        let obj = window.WwLogin({
          id: "wx_reg",
          appid: data.corpid,
          agentid: data.app_id,
          redirect_uri: encodeURIComponent(`${HttpUrl}/pchome/#/logintransfer`),
          state: "",
          href: "",
        });
      });
    }, 500);
  },
  methods: {
    // 密码登录正则判断，是否登录
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.launchLogin();
        } else {
          return false;
        }
      });
    },
    // 切换二维码或者账号密码登录
    cutcode() {
      this.visible = !this.visible;
    },
    // 获取用户信息，保存用户信息
    launchLogin() {
      this.ruleForm.password = btoa(this.ruleForm.password);
      login(this.ruleForm).then((data) => {
        if (data.code == 1) {
          this.$store.commit("USERINFO", data.data.userinfo);
          sessionStorage.setItem("token", data.data.login_token);
          this.$store.commit("SET_TOKEN", data.data.login_token);
          this.ruleForm.code = "";
          this.addroloe_menu();
          setTimeout(() => {
            this.$router.push({ path: "/home" });
          }, 500);
        } else {
          this.onImgSrc();
          this.ruleForm.code = "";
          this.ruleForm.password = "";
        }
      });
    },
    // 点击换验证码图片
    onImgSrc() {
      this.imgSrc = `${HttpUrl}/document_captcha?num=${Math.random()}`;
    },
    // 获取用户权限
    addroloe_menu() {
      get_roloe_menu().then((data) => {
        this.$store.commit("SET_LEFTDATA_jurisdiction", data.data);
      });
    },
  },
  components: {
    Footer,
    Listbox,
  },
};
</script>

<style lang="less" scoped>
body,
html {
  height: 100%;
}
#main {
  height: 100vh;
  min-width: 1280px;
  min-height: 750px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(248, 248, 248, 1) 100%
  );
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  .logo {
    width: 100%;
    display: flex;
    padding: 24px 40px;
    justify-content: space-between;
    .left-logo {
      display: flex;
      align-items: center;
      img {
        width: 130px;
        margin-right: 14px;
        height: 29px;
        cursor: pointer;
      }
      .logo-text {
        font-size: 16px;
        color: #0078ef;
        height: 22px;
        border-left: 1px solid #b2b2b2;
        padding-left: 8px;
        font-weight: 400;
      }
    }
  }
  .right-background {
    position: absolute;
    right: 0;
    top: 0;
    background-image: url("../../assets/login/bag3.png");
    width: 800px;
    height: 400px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 254px -500px;
  }
  .left-bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    background-image: url("../../assets/login/bag1.png");
    width: 470px;
    height: 760px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: -300px 50px;
  }
  .right-bottom {
    position: absolute;
    right: 0;
    bottom: 0;
    background-image: url("../../assets/login/bag2.png");
    width: 527px;
    height: 630px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50px 50px;
  }
  .login {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 450px;
    box-shadow: 0px 0px 10px rgba(0, 130, 239, 0.1);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    .loginLeft-content {
      width: 343px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #008bff;
      padding: 0px 40px;
      color: #fff;
      .left-icon {
        margin-top: 58px;
        margin-bottom: 14px;
      }
    }
    .loginRight-content {
      position: relative;
      padding: 40px 0px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 457px;
      height: 100%;
      background: #fff;
      h1 {
        width: 100%;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        line-height: 1em;
      }
      .ant-input {
        border: none;
        border-radius: 0px;
        border-bottom: 1px solid #b2b2b2;
        width: 265px;
        padding: 0px;
        height: 40px;
      }
      .ant-input:focus {
        box-shadow: none;
      }
      /deep/.ant-row.ant-form-item {
        margin-bottom: 20px;
      }
      .inp-title {
        line-height: 20px;
      }
      .inputs {
        width: 125px;
      }
      .proof {
        width: 134px;
        height: 41px;
        background: #fff;
        margin-left: 3px;
      }
      .sacn-code {
        width: 265px;
        margin-left: 2px;
        position: absolute;
        bottom: 22px;
        width: 260px;
        .code-bor-left {
          display: inline-block;
          width: 54px;
          height: 0px;
          border: 1px solid #b2b2b2;
        }
      }
      // 微信扫码
      .login-code {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .code-logo {
          margin-bottom: 20px;
        }
        .code-img {
          height: 330px;
          overflow: hidden;
        }
        .cut {
          width: 260px;
          margin: 0 auto;
          cursor: pointer;
          line-height: 20px;
          margin-top: 38px;
          .code-left-bor {
            display: inline-block;
            width: 54px;
            height: 0px;
            border: 1px solid #b2b2b2;
          }
        }
      }
      .center {
        text-align: center;
      }
    }
  }
  .footers {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
/deep/ .status.status_browser.js_status {
  display: none;
}
/deep/ .ant-row.ant-form-item {
  margin-bottom: 0px !important;
  height: 90px;
}
</style>