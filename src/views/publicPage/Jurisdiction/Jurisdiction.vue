<template>
  <div class="Jurisdiction">
    <div class="Jurisdiction-top-img">
      <img class="Jurisdiction-img" src="../../../assets/pulicPage/be-careful.png" alt />
    </div>
    <p class="Jurisdiction-img-title">{{imgTitle}}</p>
    <p class="Jurisdiction-center-title">解决办法：</p>
    <p class="Jurisdiction-center-text" v-if="type!=1">在“登录企业微信-应用管理-可见范围”中可设置员工可见范围</p>
    <div class="Jurisdiction-bott-img" v-if="type!=1">
      <img src="../../../assets/pulicPage/role_range.png" alt />
    </div>
    <p class="Jurisdiction-center-textTwo" v-if="type==1">
      可联系您公司的管理员
      <br />
      <span v-for="name in names" :key="name.avatar" class="Jurisdiction-textTwo-name">{{name.name}}</span>
      <br/>
      将你加入到XX系统可操作范围内，添加步骤如下：
      <br />在“登录系统-组织架构-权限编辑”中可设置员工使用权限
    </p>
  </div>
</template>
<script>
import { getTheName } from "@/api/public.js";
export default {
  name: "Jurisdiction",
  props: ["type"],
  data() {
    return {
      imgTitle: "",
      names: []
    };
  },
  created() {
    if (this.type == 1) {
      this.imgTitle = "无操作权限";
      getTheName().then(data => {
        this.names = data.data;
      });
    } else {
      this.imgTitle = "无可见范围";
    }
  },
  methods: {},
  components: {}
};
</script>
<style lang="less" scoped>
body,
html {
  width: 100%;
  height: 100%;
}
.Jurisdiction {
  width: 752px;
  height: calc(100vh - 22px);
  padding: 1px 72px 1px;
  margin: 20px auto 0px;
  background: #ffffff;
  min-height: 800px;

  .Jurisdiction-top-img {
    width: 92px;
    height: 92px;
    margin: 60px auto 0px;
    .Jurisdiction-img {
      width: 100%;
      height: 100%;
    }
  }
  .Jurisdiction-img-title {
    color: #333333;
    font-size: 20px;
    margin-top: 14px;
    text-align: center;
  }
  .Jurisdiction-center-title {
    color: #333333;
    font-size: 24px;
    margin: 70px 0px 0px;
  }
  .Jurisdiction-center-text {
    color: #303133;
    font-size: 20px;
    margin: 20px 0px 0px;
  }
  .Jurisdiction-bott-img {
    width: 563px;
    height: 175px;
    margin: 20px auto 0px;
    .Jurisdiction-img {
      width: 100%;
      height: 100%;
    }
  }
  // 无操作权限的css
  .Jurisdiction-center-textTwo {
    margin-top: 32px;
    line-height: 42px;
    font-size: 20px;
    .Jurisdiction-textTwo-name {
      margin-right: 21px;
      color: #007af5;
      white-space: nowrap; /*强制span不换行*/
      display: inline-block; /*将span当做块级元素对待*/
      width: 70px; /*限制宽度*/
      overflow: hidden; /*超出宽度部分隐藏*/
      text-overflow: ellipsis; /*超出部分以点号代替*/
    }
  }
}
</style>