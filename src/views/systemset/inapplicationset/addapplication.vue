<template>
  <div>
    <Maintitle :titleObj="titleObj" @go_back="Back">
      <!-- <a-button @click="Back" style="margin-top: 13px;">返回</a-button> -->
    </Maintitle>
    <Maincontent>
      <a-form-model
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        style="margin-top: 40px;"
      >
        <a-form-model-item label="应用名称">
          <a-input placeholder="验证后自动充值" v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="应用Secretid">
          <a-input placeholder="请输入" v-model="form.secretid" />
          <p class="warring">注：第三方应用请联系服务商进行提供</p>
        </a-form-model-item>
        <a-form-model-item label="应用AgentId">
          <a-input placeholder="请输入" v-model="form.agentid" />
        </a-form-model-item>
        <a-form-model-item label="应用验证">
          <a-button type="primary" class="bnt_validation">
            <img :src="imgurl" class="img_validation" />
            <span class="bnt_look">点击验证</span>
          </a-button>
          <a-button class="bnt_pass">
            <img :src="imgpass" class="img_pass" />
            <span class="look_pass">验证通过</span>
          </a-button>
          <a-button class="bnt_err" type="danger">
            <img :src="imgerr" class="img_err" />
            <span class="look_err">参数错误</span>
          </a-button>
          <p class="warring">应用消息必须验证通过后才能保存</p>
        </a-form-model-item>
      </a-form-model>
    </Maincontent>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
export default {
  name: "addapplication",
  components: {
    Maintitle,
    Maincontent
  },
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: true // 返回开关
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: "",
        secretid: "",
        agentid: ""
      },
      imgurl: require("../../../assets/addpostset/validation.png"),
      imgpass: require("../../../assets/addpostset/pass.png"),
      imgerr: require("../../../assets/addpostset/err.png")
    };
  },
  methods: {
    Back() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.warring {
  font-size: 14px;
  font-family: PingFang SC;
  color: #c0c4cc;
  margin: 0;
}
.ant-input:placeholder-shown {
  width: 523px;
  height: 40px;
}
.ant-form-item-control {
  margin-left: 23px;
}
.bnt_validation {
  width: 146px;
  height: 47px;
  font-size: 14px;
  .img_validation {
    width: 19px;
    height: 22px;
  }
  .bnt_look {
    padding: 1px 0 0 5px;
  }
}
.bnt_pass {
  color: #ffffff;
  width: 146px;
  height: 47px;
  font-size: 14px;
  background-color: #49cb15;
  border: 1px solid #49cb15;
  margin-left: 20px;
  margin-right: 20px;
  .img_pass {
    width: 19px;
    height: 22px;
  }
  .look_pass {
    padding: 1px 0 0 5px;
  }
}
.bnt_pass:hover {
  color: #ffffff;
  opacity: 0.8;
  background-color: #49cb15;
}
.bnt_err {
  width: 146px;
  height: 47px;
  font-size: 14px;
  .img_err {
    width: 19px;
    height: 22px;
  }
  .look_err {
    padding: 1px 0 0 5px;
  }
}
</style>