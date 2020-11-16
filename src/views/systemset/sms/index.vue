<template>
  <div>
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <div class="short-content">
        <!-- 是否开启短信验证 -->
        <div class="item">
          <span class="left">是否开启短信验证:</span>
          <a-radio-group class="right" v-model="isUser" @change="onChange">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </div>
        <div v-if="isUser == 1">
          <!-- input框 -->
          <div class="item">
            <span class="left">短信appid:</span>
            <a-input class="right" placeholder v-model="form.appid" />
          </div>
          <div class="item">
            <span class="left">短信appkey:</span>
            <a-input-password class="right" placeholder v-model="form.appkey" />
          </div>
          <div class="item">
            <span class="left">短信签名ID:</span>
            <a-input class="right" placeholder v-model="form.sign" />
          </div>
          <div class="item">
            <span class="left">待审核短信模板ID:</span>
            <a-input class="right" placeholder v-model="form.temp_id" />
          </div>
          <div class="item">
            <span class="left">审批超时短信模板ID:</span>
            <a-input class="right" placeholder v-model="form.notice_id" />
          </div>
          <!--                    <div class="item">-->
          <!--                        <span class="left">短信验证码过期时间:</span>-->
          <!--                        <a-input class="right" placeholder="设置短信验证码多少分钟过期" v-model="form.expiration" />-->
          <!--                    </div>-->
          <!--                    <div class="item">-->
          <!--                        <span class="left">短信发送频率:</span>-->
          <!--                        <a-input class="right" placeholder="设置多少分钟发送一次" v-model="form.frequency" />-->
          <!--                    </div>-->
          <!-- 提交按钮 -->
          <div class="button">
            <div class="left"></div>
            <a-button class="right" type="primary" @click="submit">保存设置</a-button>
          </div>
        </div>
      </div>
    </Maincontent>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import { updateSms, getSmsDetail } from "@/api/roleset.js";

export default {
  components: {
    Maintitle,
    Maincontent
  },
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: false // 返回开关
      },
      isUser: "",
      dataForm: {},
      form: {
        switch: "",
        appid: "", //短信appid
        appkey: "", //短信appkey
        sign: "", //短信签名id
        temp_id: "", //短信验证码模板ID
        notice_id: "", //短信通知类模板ID
        expiration: "", //短信验证码过期时间
        frequency: "" //短信发送频率
      }
    };
  },
  methods: {
    //是否关闭短信验证
    async onChange(e) {
      this.isUser = e.target.value;
      let dataForm = JSON.parse(JSON.stringify(this.dataForm));
      if (e.target.value == 0) {
        if (dataForm.switch == 1) {
          //判断是否可以再次提交
          dataForm.switch = e.target.value;
          this.updateSms(dataForm);
        }
      } else if (e.target.value == 1) {
        this.isUser = 1;
        if (dataForm.switch == 0) {
          //判断是否可以再次提交
          dataForm.switch = e.target.value;
          this.updateSms(dataForm);
        }
      }
      setTimeout(this.getSmsDetail, 200);
      // this.getSmsDetail()
    },
    //get短信設置
    async getSmsDetail(val) {
      let { data } = await getSmsDetail();
      if (data) {
        this.dataForm = data;
        this.form = JSON.parse(JSON.stringify(data));
        this.isUser = data.switch == null ? 0 : data.switch;
        if (val) {
          this.isUser = 1;
        }
      }
    },
    submit() {
      let form = JSON.parse(JSON.stringify(this.form));
      form.switch = this.isUser;
      this.updateSms(form);
    },
    //修改短信設置
    async updateSms(form) {
      let { code, data } = await updateSms(form);
      this.getSmsDetail();
    }
  },
  created() {
    this.getSmsDetail();
  }
};
</script>
<style lang="less" scoped>
.short-content {
  padding-top: 50px;
  .ant-radio-group {
    width: auto;
  }
  .item {
    width: 535px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .left {
      width: 30%;
      text-align: right;
      margin-right: 20px;
    }
    .right {
      width: 70%;
    }
  }
  .button {
    width: 535px;
    display: flex;
    .left {
      width: 30%;
      text-align: right;
      margin-right: 15px;
    }
    .right {
      width: 125px;
    }
  }
}
</style>