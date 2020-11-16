<template>
  <div class="footer">
    <div class="main">
      <span class="hand"
            @click="relation">联系我们</span>
      <span class="division">|</span>
      <span class="hand"
            @click="showModal">功能建议</span>
      <span class="division">|</span>
      <span class="hand"
            @click="BUGshowModal">BUG反馈</span>

      <br />
      <span>企业微信服务专家:名冠天下</span>
      <span class="division">|</span>
      <span>客服电话:4000282880</span>
    </div>

    <!-- 功能建议 -->
    <div class="suggest">
      <a-modal class="demo-modal"
               title="功能建议"
               :visible="visible"
               :confirm-loading="confirmLoading"
               @ok="handleOk"
               @cancel="handleCancel"
               okText="确定"
               cancelText="取消">
        <div class="hint">
          <p>
            <span class="must">*</span>建议描述
          </p>
          <a-textarea placeholder="请简要描述您的建议..."
                      :rows="5"
                      v-model="hintText" />
        </div>
        <div class="file">
          <p class="file-text">附件</p>
          <a-upload name="file"
                    :multiple="true"
                    :showUploadList="false"
                    @change="handleChange">
            <a-button class="file-btn">上传文件</a-button>
          </a-upload>
          <p class="file-must">(单个文件最大支持50MB)</p>
        </div>
      </a-modal>
      <div v-if="reFresh"
           class="filesets-box item-w">
        <template v-for="(item, index) in percent">
          <Filesets :percent="item"
                    :key="index" />
        </template>
      </div>
    </div>
    <!-- BUG反馈 -->
    <div class="bugFeedback">
      <a-modal class="demo-modal"
               title="BUG反馈"
               :visible="visibles"
               :confirm-loading="BUGconfirmLoading"
               @ok="BUGhandleOk"
               @cancel="BUGhandleCancel"
               okText="确定"
               cancelText="取消">
        <div class="hint">
          <p>
            <span class="must">*</span>BUG描述
          </p>
          <a-textarea placeholder="请简要描述您的BUG..."
                      :rows="5"
                      v-model="BugText" />
        </div>
        <div class="file">
          <p class="file-text">附件</p>
          <a-upload name="file"
                    :multiple="true"
                    :showUploadList="false"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    @change="BUGhandleChange">
            <a-button class="file-btn">上传文件</a-button>
          </a-upload>
          <p class="file-must">(单个文件最大支持50MB)</p>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import Filesets from '@/views/components/filesets.vue'
import { randomnumber } from '@/js/public.js'
import { Feedbackinfo } from '@/api/feedback.js'
export default {
  name: 'Footer',
  data() {
    return {
      // 建议反馈
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      // BUG反馈
      visibles: false,
      BUGconfirmLoading: false,
      //接口相关数据
      file_infoSize: null,
      // 建议反馈文本
      hintText: '',
      // BUG反馈文本
      BugText: '',
      hintobj: {},
      percent: {}, // 上传文件的数据
      uid: '', //当前上传文件的id
      setInt: '', // 关闭倒计时的变量
      reFresh: false,
    }
  },
  components: {
    Filesets,
  },
  computed: {},
  methods: {
    // 联系我们
    relation() {
      this.$router.push('/footLink')
    },
    // 反馈建议显示弹框
    showModal() {
      this.visible = true
    },
    // 点击确认 关闭弹框
    handleOk(e) {
      // this.ModalText = "The modal will be closed after two seconds";
      this.confirmLoading = true
      this.visible = false
      this.confirmLoading = false
      this.feedbackinfo()
      this.hintText = ''
    },
    //点击取消关闭弹框
    handleCancel(e) {
      this.visible = false
    },
    // 上传
    handleChange(info) {
      this.file_infoSize = info.file.size
      this.reFresh = true
      let { file } = info
      this.uid = file.uid
      this.$set(this.percent, file.uid, {
        name: file.name,
        timer: null,
        num: 0,
        status: 1,
      })
      // 获取随机数
      let nums = Math.floor(Math.random() * (95 - 75 + 1)) + 75
      this.setInt = setInterval(() => {
        if (this.percent[this.uid].num < nums) {
          this.percent[this.uid].num += 1
        }
      }, 100)
      randomnumber(info, this.addfile)
    },
    // 上传文件的回调
    addfile(data) {
      this.percent[this.uid].status = 2
      this.percent[this.uid].num = 100
      let obj = {}
      obj.name = data.name
      obj.url = data.url + data.data.key
      obj.size = this.file_infoSize
      obj.type = 2
      this.hintobj = obj
    },
    feedbackinfo() {
      this.hintobj.remark = this.hintText
      Feedbackinfo(this.hintobj).then((res) => {
      })
    },
    // ==========================================我是分割线=====================================
    // 反馈建议显示弹框
    BUGshowModal() {
      this.visibles = true
    },
    // 点击确认 关闭弹框
    BUGhandleOk(e) {
      this.confirmLoading = true
      this.visibles = false
      this.confirmLoading = false
      this.BUGfeedbackinfo()
      this.BugText = ''
    },
    //点击取消关闭弹框
    BUGhandleCancel(e) {
      this.visibles = false
    },
    // 上传
    BUGhandleChange(info) {
      randomnumber(info, this.BUGadd)
    },
    // 上传bug文件的回调
    BUGadd(data) {
      let obj = {}
      obj.name = data.name
      obj.url = data.url + data.data.key
      obj.size = this.file_infoSize
      obj.type = 1
      this.hintobj = obj
    },
    // 建议反馈接口
    BUGfeedbackinfo() {
      this.hintobj.remark = this.BugText
      Feedbackinfo(this.hintobj).then((res) => {
      })
    },
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
.footer {
  height: 90px;
  max-width: 1280px;
  margin: 0 auto;
  padding-top: 24px;
  .main {
    font-size: 14px;
    color: #c0c4cc;
    letter-spacing: 2px;
    text-align: center;
    .division {
      margin: 0 8px;
    }
  }
}
.demo-modal {
  /deep/ .ant-modal-header {
    padding: 10px 24px;
    background: #4d98f0;
    .ant-modal-title {
      color: #fff;
    }
  }
  /deep/ .ant-modal-footer {
    border-top: none;
  }
  /deep/ .ant-modal-close-x {
    .ant-modal-close-icon {
      color: #fff;
      svg {
        color: #fff;
      }
    }
  }
}
.hint {
  display: flex;
  p {
    color: #333;
    margin-top: 5px;
    .must {
      color: red;
    }
  }
  .ant-input {
    width: 80%;
    border-radius: 0px;
    margin-left: 10px;
  }
}
.file {
  display: flex;
  margin-top: 15px;
  .file-text {
    color: #333;
    font-weight: 500;
    margin-left: 36px;
  }
  .file-btn {
    background: url('../../../assets/addpostset/file.png') no-repeat 5px 5px
      #0082ef;
    background-size: 20px 20px;
    padding-left: 30px;
    color: #fff;
    margin-left: 7px;
  }
  .file-must {
    margin-left: 10px;
    margin-top: 10px;
    font-size: 12px;
    color: #828282;
  }
  .item-w {
    margin-bottom: 50px;
  }
}
</style>