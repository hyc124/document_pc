<template>
  <div>
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <div class="short-content">
        <!-- input框 -->
        <div class="item">
          <span class="left">是否开启邮件验证:</span>
          <a-radio-group class="right" v-model="isUser" @change="onChange">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </div>
        <div v-if="isUser == 1">
          <div class="item">
            <span class="left">发件人:</span>
            <a-input class="right" placeholder v-model="form.Sender" />
          </div>
          <div class="item">
            <span class="left">邮箱地址:</span>
            <a-input class="right" placeholder v-model="form.email_address" />
          </div>
          <div class="item">
            <span class="left">SMTP服务器:</span>
            <a-input class="right" placeholder v-model="form.smtpServer" />
          </div>
          <div class="item">
            <span class="left">连接方式:</span>
            <a-select class="right" v-model="form.type" defaultValue="ssl" @onChange="onChange">
              <a-select-option value="ssl">ssl</a-select-option>
              <a-select-option value="tls">tls</a-select-option>
            </a-select>
          </div>
          <div class="item">
            <span class="left">SMTP服务器端口:</span>
            <a-input class="right" placeholder v-model="form.ServerPort" />
          </div>
          <div class="item">
            <span class="left">发件箱账号:</span>
            <a-input class="right" v-model="form.username" />
          </div>
          <div class="item">
            <span class="left">发件箱密码:</span>
            <a-input-password class="right" type="password" v-model="form.password" />
          </div>
          <!-- 提交按钮 -->
          <div class="button">
            <div class="left"></div>
            <a-button class="right" type="primary" @click="submit">确定</a-button>
          </div>
        </div>
      </div>
    </Maincontent>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import { updateEmail, getEmailDetail } from "@/api/roleset.js";

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
        Sender: "", //发件人
        email_address: "", //	邮箱地址
        smtpServer: "", //	SMTP服务器
        type: "", //连接方式
        ServerPort: "", //	SMTP服务器端口
        username: "", //发件箱账号
        password: "" //	发件箱密码
      }
    };
  },
  methods: {
    //是否关闭短信验证
    onChange(e) {
      this.isUser = e.target.value;
      let dataForm = JSON.parse(JSON.stringify(this.dataForm));
      if (e.target.value == 0) {
        if (dataForm.switch == 1) {
          //判断是否可以再次提交
          dataForm.switch = e.target.value;
          this.updateEmail(dataForm);
        }
      } else if (e.target.value == 1) {
        this.isUser = 1;
        if (dataForm.switch == 0) {
          //判断是否可以再次提交
          dataForm.switch = e.target.value;
          this.updateEmail(dataForm);
        }
      }
      setTimeout(this.getEmailDetail, 200);
      // this.getSmsDetail()}
    },
    //get短信设置
    async getEmailDetail(val) {
      let { data } = await getEmailDetail();
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
      this.updateEmail(this.form);
    },
    //修改短信設置
    async updateEmail(form) {
      let { code, data } = await updateEmail(form);
      this.getEmailDetail();
    }
  },
  created() {
    this.getEmailDetail();
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