<template>
  <div>
    <Maintitle :titleObj="titleObj"
               @go_back="reverts">
      <div>
        <a-button type="primary"
                  class="bcbtn"
                  @click="keep">保存</a-button>
      </div>
    </Maintitle>
    <Maincontent>
      <div class="maincontent-tab">
        <div class="maincontent-tab-col">
          <div class="maincontent-tab-col-title maincontent-tab-col-title-a flex-col">
            <span class="maincontent-tab-col-title-a-xx">*</span> 单位名称
          </div>
          <div class="maincontent-tab-col-content">
            <a-form-model-item label
                               class="item-w">
              <a-input :maxLength="30"
                       v-model="form.name"
                       style="height:38px;"
                       placeholder="请输入单位名称"
                       class="inputs"
                       onlyready />
            </a-form-model-item>
          </div>
        </div>
        <div class="maincontent-tab-col">
          <div class="maincontent-tab-col-title maincontent-tab-col-title-h">
            <div class="flex-col">
              <span class="maincontent-tab-col-title-a-xx">*</span>文书
              <span style="color:#F56C6C;">(公文接收人)</span>
            </div>
            <a-checkbox :checked="form.status == 1"
                        @change="checkChange"
                        value="1">可退文</a-checkbox>
          </div>
          <div class="maincontent-tab-col-content">
            <div @click="kChange(form.doc_receiver,'doc_receiver')"
                 class="Choosers">
              <Svgicon item="Chooser" />
            </div>
            <div class="Choosers-bott-box flex-col">
              <template v-for="itme in form.doc_receiver">
                <div class="Choosers-bott-box-text hand"
                     :key="itme.userid">
                  {{itme.name}}
                  <a-icon @click="onCutOff(itme,form.doc_receiver)"
                          class="Choosers-text-icon"
                          type="close" />
                </div>
              </template>
            </div>
          </div>
          <div class="maincontent-tab-col-title maincontent-tab-col-title-h">单位领导</div>
          <div class="maincontent-tab-col-content">
            <div @click="kChange(form.leader,'leader')"
                 class="Choosers">
              <Svgicon item="Chooser" />
            </div>
            <div class="Choosers-bott-box flex-col">
              <template v-for="itme in form.leader">
                <div class="Choosers-bott-box-text hand"
                     :key="itme.userid">
                  {{itme.name}}
                  <a-icon @click="onCutOff(itme,form.leader)"
                          class="Choosers-text-icon"
                          type="close" />
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="maincontent-tab-col">
          <div class="maincontent-tab-col-title maincontent-tab-col-title-a flex-col">督办联络员</div>
          <div class="maincontent-tab-col-content">
            <div @click="kChange(form.supervisor,'supervisor')"
                 class="Choosers">
              <Svgicon item="Chooser" />
            </div>
            <div class="Choosers-bott-box flex-col">
              <template v-for="itme in form.supervisor">
                <div class="Choosers-bott-box-text hand"
                     :key="itme.userid">
                  {{itme.name}}
                  <a-icon @click="onCutOff(itme,form.supervisor)"
                          class="Choosers-text-icon"
                          type="close" />
                </div>
              </template>
            </div>
          </div>
          <div class="maincontent-tab-col-title maincontent-tab-col-title-a flex-col">会议联络员</div>
          <div class="maincontent-tab-col-content">
            <div @click="kChange(form.meeting,'meeting')"
                 class="Choosers">
              <Svgicon item="Chooser" />
            </div>
            <div class="Choosers-bott-box flex-col">
              <template v-for="itme in form.meeting">
                <div class="Choosers-bott-box-text hand"
                     :key="itme.userid">
                  {{itme.name}}
                  <a-icon @click="onCutOff(itme,form.meeting)"
                          class="Choosers-text-icon"
                          type="close" />
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="maincontent-tab-col">
          <div class="maincontent-tab-col-title maincontent-tab-col-title-a flex-col">建议联络员</div>
          <div class="maincontent-tab-col-content">
            <div @click="kChange(form.suggested,'suggested')"
                 class="Choosers">
              <Svgicon item="Chooser" />
            </div>
            <div class="Choosers-bott-box flex-col">
              <template v-for="itme in form.suggested">
                <div class="Choosers-bott-box-text hand"
                     :key="itme.userid">
                  {{itme.name}}
                  <a-icon @click="onCutOff(itme,form.suggested)"
                          class="Choosers-text-icon"
                          type="close" />
                </div>
              </template>
            </div>
          </div>
          <div class="maincontent-tab-col-title maincontent-tab-col-title-a flex-col">提案联络员</div>
          <div class="maincontent-tab-col-content">
            <div @click="kChange(form.proposal,'proposal')"
                 class="Choosers">
              <Svgicon item="Chooser" />
            </div>
            <div class="Choosers-bott-box flex-col">
              <template v-for="itme in form.proposal">
                <div class="Choosers-bott-box-text hand"
                     :key="itme.userid">
                  {{itme.name}}
                  <a-icon @click="onCutOff(itme,form.proposal)"
                          class="Choosers-text-icon"
                          type="close" />
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="maincontent-tab-col">
          <div class="maincontent-tab-col-title"
               style="border-bottom: 1px solid #dcdfe6;width: 150px;">分发可使用者</div>
          <div class="maincontent-tab-col-content maincontent-tab-col-contents">
            <div class="maincontent-tab-col-content-body-col">
              <div @click="kChange(form.distribution,'distribution')"
                   class="Choosers">
                <Svgicon item="Chooser" />
              </div>
              <a-form-model-item>
                <div class="Choosers-bott-box Choosers-bott-boxss">
                  <template v-for="itme in form.distribution">
                    <div class="Choosers-bott-box-text hand"
                         :key="itme.userid">
                      {{itme.name}}
                      <a-icon class="Choosers-text-icon"
                              type="close"
                              @click="onCutOff(itme,form.distribution)" />
                    </div>
                  </template>
                </div>
                <!-- 可见范围弹窗 -->
                <a-modal class="transfer-modal"
                         title="人员选单"
                         :visible="visiblerange.visible"
                         :confirm-loading="confirmLoading"
                         @ok="handleOk"
                         @cancel="handleCancel"
                         cancelText="取消"
                         okText="确认">
                  <div>
                    <Framelist :range="visiblerange"
                               :tag="tag"
                               :restype="4"
                               :transformation="true" />
                  </div>
                </a-modal>
              </a-form-model-item>
            </div>
          </div>
        </div>
      </div>
    </Maincontent>
  </div>
</template>
<script>
import Framelist from '@/views/applicationset/postset/postflowpathset/components/framelist.vue'
import Maintitle from '@/views/components/maintitle.vue'
import Maincontent from '@/views/components/maincontent.vue'
import Svgicon from '@/views/components/svgicon.vue'
import { oneCompany, addCompany } from '@/api/company.js'
import { HttpUrl } from '@/js/public.js'
export default {
  name: 'companyDetail',
  props: ['path_type'],
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: true, // 返回开关
      },
      HttpUrl, // 后端域名
      confirmLoading: false, // 弹窗确认按钮加载动画
      form: {
        id: '', // 修改必传，新增不传
        name: '', // 单位名称
        doc_receiver: [], // 公文接收人
        status: 0, // 公文接收人是否可退文
        leader: [], // 领导人
        supervisor: [], // 督办联络员
        meeting: [], // 会议联络员
        suggested: [], // 建议联络员
        proposal: [], // 提案联络员
        distribution: [], // 分发可使用者
      },
      // 不能朝过超过1人提示
      texts: {
        doc_receiver: '公文接收人',
        leader: '领导人',
        supervisor: '督办联络员',
        meeting: '会议联络员',
        suggested: '建议联络员',
        proposal: '提案联络员',
        distribution: '分发可使用者',
      },
      //---------- 可见范围----------
      visiblerange: {
        visible: false, // 可见范围弹窗
        visual: [], // 弹窗
        visuals: [], // 不是弹框
      },
      // 主页传来的数据
      mainData: null,
      // 当前选中的数据下标
      text: '',
      tag: { tags: false, tab: true, pe: true, bm: false },
    }
  },
  mounted() {
    // undefined为新增 有就为编辑
    if (this.$route.query?.id != undefined) {
      this.form.id = this.$route.query.id
      // 获取编辑数据
      oneCompany({ id: this.$route.query.id }).then((res) => {
        let info = res.data
        let form = this.form
        form.name = info.title // 单位名称赋值
        form.status = info.status // 公文接收人是否可退文赋值
        form.doc_receiver.push(info.doc_receiver) // 公文接收人赋值

        if (info.leader != null) {
          form.leader.push(info.leader) // 领导人赋值
        }
        if (info.supervisor != null) {
          form.supervisor.push(info.supervisor) // 督办联络员赋值
        }
        if (info.meeting != null) {
          form.meeting.push(info.meeting) // 会议联络员赋值
        }
        if (info.suggested != null) {
          form.suggested.push(info.suggested) // 建议联络员赋值
        }
        if (info.proposal != null) {
          form.proposal.push(info.proposal) // 提案联络员赋值
        }
        if (info.distribution_info != null) {
          form.distribution = info.distribution_info // 分发可使用者
        }
      })
    }
  },
  created() {
    // 接收传来的参数
    this.GetMaindata()
  },
  components: {
    Maintitle,
    Maincontent,
    Framelist,
    Svgicon,
  },
  methods: {
    // × 删除角色事件
    onCutOff(item, arrys) {
      arrys.forEach((info, index) => {
        if (info.userid == item.userid) {
          arrys.splice(index, 1)
        }
      })
    },
    // 点击取消，返回上一页
    reverts() {
      this.$router.go(-1)
    },
    // 是否可以退文
    checkChange(e) {
      if (e.target.checked) {
        this.form.status = 1
      } else {
        this.form.status = 0
      }
    },
    // 选人事件
    kChange(info, text) {
      if (text == 'distribution') {
        this.tag = { tags: false, tab: true, pe: true, bm: true }
      } else {
        this.tag = { tags: false, tab: true, pe: true, bm: false }
      }

      this.text = text
      this.visiblerange.visual = []
      this.visiblerange.visible = true
      this.visiblerange.visual = info.map((e) => {
        return {
          title: e.name,
          value: e.userid,
          type: 0,
        }
      })
    },
    // 点击保存按钮
    keep() {
      if (this.form.name == '') {
        this.$message.error('单位名称不能为空')
        return false
      }
      if (this.form.doc_receiver == []) {
        this.$message.error('文书不能为空')
        return false
      }
      addCompany(this.form).then((data) => {
        setTimeout(() => {
          this.$router.go(-1)
        }, 1000)
      })
    },
    //------------ 可见范围  ------------
    // 弹窗 确定
    handleOk() {
      if (this.visiblerange.visual.length > 1 && this.text != 'distribution') {
        this.$message.error(`${this.texts[this.text]}只能选择一个人`)
      } else {
        this.visiblerange.visible = false
        this.form[this.text] = []
        this.form[this.text] = this.visiblerange.visual.map((e) => {
          return {
            userid: e.value,
            name: e.title,
          }
        })
      }
    },
    // 弹窗 取消
    handleCancel(e) {
      this.visiblerange.visible = false
    },
    // 接收点击编辑之后传来的参数
    GetMaindata() {
      this.$bus.$on('postflowpathsetSetdata', (val) => {
        this.mainData = val
        this.form.name = val.name
      })
    },
  },
}
</script>
<style lang="less" scoped>
/deep/.ant-input {
  padding: 0px;
}
.inputs {
  border: none;
  border-radius: 0px !important;
  height: 46px !important;
  box-shadow: none;
}
.maincontent {
  padding: 30px;
  .maincontent-tab {
    border-right: 1px solid #dcdfe6;
    .maincontent-tab-col {
      display: flex;
      .maincontent-tab-col-title-h {
        height: 96px;
      }
      .maincontent-tab-col-title-a {
        height: 48px;
      }
      .maincontent-tab-col-title {
        display: flex;
        justify-content: flex-end;
        align-content: center;
        flex-wrap: wrap;
        width: 150px !important;
        border-top: 1px solid #dcdfe6;
        border-left: 1px solid #dcdfe6;
        background-color: #f9f9f9;
        padding-right: 20px;
        color: #303133;
        .maincontent-tab-col-title-a-xx {
          color: red;
          font-size: 20px;
          margin: 4px 5px 0px 0px;
        }
      }
      .maincontent-tab-col-content {
        flex: 1;
        border-top: 1px solid #dcdfe6;
        border-left: 1px solid #dcdfe6;
        position: relative;
        padding: 0px 40px 0px 20px;
        /deep/ .item-w.ant-row.ant-form-item {
          margin: 0;
          border: none;
        }
        .Choosers {
          text-align: center;
          width: 50px;
          line-height: 100%;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 0px;
          z-index: 1;
          color: #b5b5b5;
        }
        .Choosers-bott-box {
          height: 100%;
        }
        .Choosers-bott-boxs {
          height: 100%;
          line-height: 46px;
        }
        .Choosers-bott-boxss {
          width: 1008px;
          display: flex;
          flex-wrap: wrap;
        }
        .Choosers-bott-box-text {
          line-height: 23px;
          display: inline-block;
          margin: 10px 10px 0 0;
          padding: 0 30px 0 10px;
          border: 1px solid transparent;
          position: relative;
          .Choosers-text-icon {
            margin-left: 3px;
            display: none;
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
          }
          &:hover {
            border: 1px solid #f56c6c;
            color: #f56c6c;
          }
          &:hover .Choosers-text-icon {
            display: inline-block;
          }
        }
        .maincontent-tab-col-content-body-col {
          display: flex;
          min-height: 144px;
          border-bottom: 1px solid #dcdfe6;
          padding-left: 20px;
          padding-right: 40px;
        }
      }
      .maincontent-tab-col-contents {
        padding: 0px;
      }
    }
  }
}
.bcbtn {
  margin-left: 20px;
}
.transfer-modal {
  .list-div {
    height: 466px;
  }
  /deep/.ant-modal-body {
    padding: 24px 24px 0;
  }
  /deep/ .ant-modal {
    width: 793px !important;
  }
}
</style>