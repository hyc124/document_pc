<template>
  <div class="editmain">
    <Maintitle :titleObj="titleObj"
               @go_back="reverts">
      <div>
        <a-button type="primary"
                  class="bcbtn"
                  @click="serveAddEleList">保存</a-button>
      </div>
    </Maintitle>
    <Maincontent>
      <div class="MaskTop"
           v-if="computedAuth"></div>
      <div class="maincontent-tab">
        <div class="maincontent-tab-col"
             style="height:48px;">
          <div class="maincontent-tab-col-title maincontent-tab-col-title-h">
            <span class="red">*</span>签章名称
          </div>
          <div class="maincontent-tab-col-content">
            <a-form-model-item label
                               class="item-w">
              <div class="flex-col">
                <a-input autocomplete="off"
                         :maxLength="30"
                         v-model="form.name"
                         class="item-w-input"
                         placeholder="请输入签章名称" />
                <div class="flex-col-bd"></div>
                <a-checkbox @change="onChange"
                            :checked="CommonlyUsed"
                            class="maincontent-item-checkout">设为我的常用签章</a-checkbox>
              </div>
            </a-form-model-item>
          </div>
        </div>
        <div class="maincontent-tab-col">
          <div class="maincontent-tab-col-title maincontent-tab-col-title-h">签章类型</div>
          <div class="maincontent-tab-col-content">
            <a-form-model-item label
                               class="item-w">
              <a-radio-group v-model="form.type">
                <a-radio :value="1"
                         :style="form.type==1?'color:#0082ef;':''">个人签章</a-radio>
                <a-radio :value="2"
                         :style="form.type==2?'color:#0082ef;':''">单位印章</a-radio>
                <a-radio :value="3"
                         :style="form.type==3?'color:#0082ef;':''">个人印章</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </div>
        </div>
        <div class="maincontent-tab-col">
          <div class="maincontent-tab-col-title maincontent-tab-col-title-hs">可以使用的用户</div>
          <div class="maincontent-tab-col-content">
            <a-form-model-item label
                               class="item-w">
              <div class="userBox">
                <div class="noChiose">为空则只有创建人可用</div>
                <div class="userLIst">
                  <div class="choiseUser hand"
                       v-for="(item,index) in CCpersonradio.tagsrange.visual"
                       :key="index">
                    {{item.title}}
                    <a-icon type="close"
                            class="choiseUser-icon"
                            @click="deleteUser(item.value)" />
                  </div>
                </div>
                <div @click="usersUsed()"
                     class="iconImg">
                  <img src="../../../../assets/signatureset/chioseUser.png"
                       alt
                       style="width:16px;height:15px;" />
                </div>
              </div>
            </a-form-model-item>
            <!-- 选择用户 -->
            <a-modal ref="used"
                     class="transfer-modal"
                     :title="status==1?'选择可以使用的用户':'选择允许使用和授权给他人的用户' "
                     :visible="CCperson"
                     :confirm-loading="confirmLoading"
                     @ok="CChandleOk"
                     @cancel="CChandleCancel"
                     cancelText="取消"
                     okText="确认">
              <div>
                <Framelist v-if="status==1"
                           :range="CCpersonradio.tagsrange"
                           :tag="{tab: true,bm: true,pe: true,company: false,label: true,role: true,lately: true}"
                           :restype="4" />
                <Framelist v-else
                           :range="EmpoweringUser.tagsrange"
                           :tag="{tab: true,bm: true,pe: true,company: false,label: true,role: true,lately: true}"
                           :restype="4" />
              </div>
            </a-modal>
          </div>
        </div>
        <div class="maincontent-tab-col">
          <div class="maincontent-tab-col-title maincontent-tab-col-title-hs">
            允许使用和授权
            <br />给他人的用户
          </div>
          <div class="maincontent-tab-col-content">
            <a-form-model-item label
                               class="item-w">
              <div class="userBox">
                <!-- v-if="EmpoweringUser.tagsrange.visual.length==0" -->
                <!-- v-else -->
                <div class="noChiose">为空则只有创建人可用</div>
                <div class="userLIst">
                  <div class="choiseUser hand"
                       v-for="(item,index) in EmpoweringUser.tagsrange.visual"
                       :key="index">
                    {{item.title}}
                    <a-icon type="close"
                            class="choiseUser-icon"
                            @click="deleteUsers(item.value)" />
                  </div>
                </div>

                <div @click="empowering()"
                     class="iconImg">
                  <img src="../../../../assets/signatureset/chioseUser.png"
                       alt
                       style="width:16px;height:15px;" />
                </div>
              </div>
            </a-form-model-item>
          </div>
        </div>
        <div class="maincontent-tab-col">
          <div class="maincontent-tab-col-title maincontent-tab-col-title-h">免密用章</div>
          <div class="maincontent-tab-col-content">
            <div class="MaskBott"
                 v-if="computedAuth"></div>
            <a-form-model-item label
                               class="item-w">
              <a-radio-group v-model="form.is_pwd">
                <a-radio :value="1"
                         style="padding-right:30px;">否</a-radio>
                <a-radio :value="0">是</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </div>
        </div>
        <div class="maincontent-tab-col"
             v-if="form.is_pwd==1">
          <div class="maincontent-tab-col-title maincontent-tab-col-title-h">
            <span class="red">*</span>签章密码
          </div>
          <div class="maincontent-tab-col-content">
            <div class="MaskBott"
                 v-if="computedAuth"></div>
            <a-form-model-item label
                               class="item-w">
              <a-input-password autocomplete="off"
                                :maxLength="6"
                                placeholder="请输入密码"
                                v-model="form.pwd"
                                style="width:200px;" />
            </a-form-model-item>
          </div>
        </div>
        <div class="maincontent-tab-col"
             v-if="form.is_pwd==1">
          <div class="maincontent-tab-col-title maincontent-tab-col-title-h">
            <span class="red">*</span>确认密码
          </div>
          <div class="maincontent-tab-col-content">
            <div class="MaskBott"
                 v-if="computedAuth"></div>
            <a-form-model-item label
                               class="item-w">
              <a-input-password autocomplete="off"
                                :maxLength="6"
                                placeholder="请确认密码"
                                v-model="form.re_pwd"
                                style="width:200px;" />
            </a-form-model-item>
          </div>
        </div>
        <div class="maincontent-tab-col">
          <div class="maincontent-tab-col-title maincontent-tab-col-title-h"
               style="height:210px;">签章信息</div>
          <div class="maincontent-tab-col-content"
               style="height:210px;">
            <div class="MaskBott"
                 v-if="computedAuth"></div>
            <a-form-model-item label
                               class="item-w">
              <div v-if="form.img!=''"
                   class="imgList">
                <img :src="HttpUrl+form.img"
                     alt
                     v-if="id!=''" />
                <img :src="imgUrl"
                     alt />
              </div>
              <a-upload v-else
                        name="file"
                        :beforeUpload="beforeUpload"
                        :customRequest="customRequest"
                        :disabled="filedisabled"
                        @change="handleChange"
                        :showUploadList="false">
                <div class="upBox">
                  <a-icon type="cloud-upload"
                          style="font-size:40px;color:#C3CCD4;margin:42px 78px 0;" />
                  <div class="upText">
                    <span>上传附件</span>
                    <span>点击上传</span>
                  </div>
                </div>
              </a-upload>
              <div class="warText">为避免变形，签章图片建议上传4：3的图片，支持格式：jpg/gif/bmp文件，文件大小不超过5M</div>
            </a-form-model-item>
          </div>
        </div>
        <div class="maincontent-tab-col"
             style="border-bottom:1px solid #DCDFE6;">
          <div class="maincontent-tab-col-title">创建人</div>
          <div class="createUser"
               style="border-right:none;">
            <div class="MaskBott"
                 v-if="computedAuth"></div>
            <a-form-model-item label>{{create_user_name}}</a-form-model-item>
          </div>
          <div class="maincontent-tab-col-title">创建时间</div>
          <div class="createUser">
            <div class="MaskBott"
                 v-if="computedAuth"></div>
            <a-form-model-item label
                               class="item-w">{{time||'保存后自动获取当前时间'}}</a-form-model-item>
          </div>
        </div>
      </div>
    </Maincontent>
  </div>
</template>
<script>
import Maintitle from '@/views/components/maintitle.vue'
import Maincontent from '@/views/components/maincontent.vue'
import {
  addEle,
  eleDetail,
  getUserInfo,
  getEleUpdate,
} from '@/api/allsignatrue.js'
import { HttpUrl } from '@/js/public.js'
import { public_data_files, randomnumber } from '@/js/public.js'
import Framelist from '@/views/sendout/draft/addcompoents/components/organization/framelist.vue' //选择人员

export default {
  name: 'allsignatureadd',
  components: {
    Maintitle,
    Maincontent,
    Framelist,
  },
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: true, // 返回开关
      },
      auth: '', // 当前角色改动签章的权限
      HttpUrl,
      imgUrl: '',
      id: '', //详情的id
      filedisabled: false, //限制上传文件数量
      create_user_name: '',
      time: '',
      status: '',
      form: {
        name: '',
        type: '2',
        is_pwd: '1', //是否免密
        pwd: '', //密码
        re_pwd: '', //确认密码
        use_user_ids: '', //可使用的用户
        auth_user_ids: '', //可使用授权的id
        img: '', //上传章的图片
        default: 0, // 是否设为常用
      },
      //   选人
      confirmLoading: false, // 弹窗确认按钮加载动画
      CCperson: false,
      visiblerange: {
        visible: false, // 可见范围弹窗
        visual: [], // 弹窗
        visuals: [], // 不是弹框
      },
      CCpersonradio: {
        tagsrange: {
          visual: [], //打开了获取到的数组
        },
      },
      EmpoweringUser: {
        tagsrange: {
          visual: [], //打开了获取到的数组
        },
      },
    }
  },
  mounted() {
    if (this.$route.query.ids) {
      this.id = this.$route.query.ids
      this.lookDetail()
    } else {
      this.create_user_name = JSON.parse(
        sessionStorage.getItem('userinfo')
      ).name
    }
  },
  computed: {
    CommonlyUsed(num) {
      return this.form.default == 1
    },
    computedAuth() {
      let _onOff
      if (this.auth != 1) {
        _onOff = true
      } else {
        _onOff = false
      }
      return _onOff
    },
  },
  methods: {
    // 是否设置为常用签章开关
    onChange(el) {
      if (el.target.checked) {
        this.form.default = 1
      } else {
        this.form.default = 0
      }
    },
    //删除可以使用的人员
    deleteUser(id) {
      this.CCpersonradio.tagsrange.visual.forEach((item, index) => {
        if (item.value == id) {
          this.CCpersonradio.tagsrange.visual.splice(index, 1)
        }
      })
    },
    //删除允许使用的用户
    deleteUsers(id) {
      this.EmpoweringUser.tagsrange.visual.forEach((item, index) => {
        if (item.value == id) {
          this.EmpoweringUser.tagsrange.visual.splice(index, 1)
        }
      })
    },
    //可以使用的用户
    usersUsed() {
      this.CCperson = true
      this.status = 1
    },
    empowering() {
      this.CCperson = true
      this.status = 2
    },
    // 弹窗 确定
    CChandleOk(e) {
      if (this.status == 1) {
        let user = []
        this.CCpersonradio.tagsrange.visual.forEach((item) => {
          if (item.type == 4) {
            user = [...user, ...item.userids]
          } else if (item.type == 5) {
            item.all_users.forEach((el2) => {
              user.push(el2.userid)
            })
          } else {
            user.push(item.value)
          }
        })
        user = Array.from(new Set(user))
        this.form.use_user_ids = user.join()
      } else {
        let users = []
        this.EmpoweringUser.tagsrange.visual.forEach((item) => {
          if (item.type == 4) {
            users = [...users, ...item.userids]
          } else if (item.type == 5) {
            item.all_users.forEach((el2) => {
              users.push(el2.userid)
            })
          } else {
            users.push(item.value)
          }
        })
        users = Array.from(new Set(users))
        this.form.auth_user_ids = users.join()
      }
      this.CCperson = false
      this.visiblerange.visible = false
      this.visiblerange.visuals = JSON.parse(
        JSON.stringify(this.visiblerange.visual)
      )
    },
    // 弹窗 取消
    CChandleCancel(e) {
      this.CCperson = false
      this.visiblerange.visible = false
      this.visiblerange.visual = JSON.parse(
        JSON.stringify(this.visiblerange.visuals)
      )
    },
    // 点击取消，返回上一页
    reverts() {
      this.$router.go(-1)
    },
    //新建签章
    serveAddEleList() {
      if (this.form.name.trim() == '') {
        this.$message.error('请输入签章名称', 1)
        return false
      }
      if (this.form.is_pwd == 1 && this.form.pwd == '') {
        this.$message.error('请输入密码', 1)
        return false
      }
      if (this.form.is_pwd == 1 && this.form.re_pwd == '') {
        this.$message.error('请确认密码', 1)
        return false
      }
      if (this.form.is_pwd == 1 && this.form.pwd !== this.form.re_pwd) {
        this.$message.error('请两次输入密码不一致', 1)
        return false
      }
      let data = new FormData()
      if (this.id != '') {
        data.append('id', this.id)
      }
      data.append('img', this.form.img)
      data.append('name', this.form.name)
      data.append('type', this.form.type)
      data.append('is_pwd', this.form.is_pwd)
      data.append('pwd', btoa(this.form.pwd))
      data.append('re_pwd', btoa(this.form.re_pwd))
      data.append('use_user_ids', this.form.use_user_ids)
      data.append('auth_user_ids', this.form.auth_user_ids)
      data.append('default', this.form.default)
      if (this.id != '') {
        getEleUpdate(data).then((res) => {
          if (res.code == 1) {
            this.$router.push({ path: '/allsignature' })
          }
        })
      } else {
        addEle(data).then((res) => {
          if (res.code == 1) {
            this.$router.push({ path: '/allsignature' })
          }
        })
      }
    },
    // 判断上传文件是否符合要求
    beforeUpload(file) {
      return public_data_files(file, ['jpg', 'gif', 'bmp', 'png', 'jepg'], 10)
    },
    customRequest(files) {
      this.form.img = files.file
    },
    getBase64(img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },
    handleChange(info) {
      this.getBase64(info.file.originFileObj, (imageUrl) => {
        this.imgUrl = imageUrl
      })
    },
    //获取详情数据
    lookDetail() {
      let data = new URLSearchParams()
      data.append('id', this.id)
      eleDetail(data).then((res) => {
        if (res.code == 1) {
          this.auth = res.data.auth
          this.form.type = parseInt(res.data.type)
          this.form.is_pwd = parseInt(res.data.is_pwd)
          this.create_user_name = res.data.create_user_name
          this.time = res.data.time
          Object.keys(this.form).forEach((key) => {
            if (key == 'pwd') {
              this.form[key] = atob(res.data[key])
            } else {
              this.form[key] = res.data[key]
            }
          })
          this.form.re_pwd = this.form.pwd
          res.data.use_user_names.forEach((item) => {
            let ccList = {}
            ccList['value'] = item.userid
            ccList['title'] = item.name
            ccList['type'] = 2
            ccList['del_id'] = 'pe' + item.id
            this.CCpersonradio.tagsrange.visual.push(ccList)
          })
          res.data.auth_user_names.forEach((item) => {
            let emList = {}
            emList['value'] = item.userid
            emList['title'] = item.name
            emList['type'] = 2
            emList['del_id'] = 'pe' + item.id
            this.EmpoweringUser.tagsrange.visual.push(emList)
          })
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.editmain {
  height: 100%;
  position: relative;
  .MaskTop {
    position: absolute;
    top: 30px;
    left: 180px;
    height: 97px;
    width: 1070px;
    z-index: 5;
    background: rgba(0, 0, 0, 0.04);
  }
  .MaskBott {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 5;
    background: rgba(0, 0, 0, 0.04);
    left: 0;
    top: 0;
  }
}
.bcbtn {
  margin-left: 20px;
}
.maincontent {
  padding: 30px;
  .maincontent-tab {
    .maincontent-tab-col {
      display: flex;
      .maincontent-tab-col-title-h {
        min-height: 48px;
        .red {
          margin-top: 4px;
        }
      }
      .maincontent-tab-col-title-hs {
        min-height: 80px;
      }
      .maincontent-tab-col-title {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        border-top: 1px solid #dcdfe6;
        border-left: 1px solid #dcdfe6;
        background-color: #f9f9f9;
        color: #606266;
      }
      .maincontent-tab-col-content {
        position: relative;
        flex: 1;
        border-top: 1px solid #dcdfe6;
        border-left: 1px solid #dcdfe6;
        border-right: 1px solid #dcdfe6;
        .maincontent-item-checkout {
          color: #303233;
          margin-right: 25px;
        }
        /deep/ .item-w.ant-row.ant-form-item {
          margin: 0;
          border: none;
        }
        .item-w-input {
          height: 46px;
          border: none;
          line-height: 48px;
          width: 50%;
          box-shadow: none;
        }
        /deep/.ant-form-item-control {
          // line-height: 48px;
          padding-left: 21px;
        }
        .userBox {
          position: relative;
          min-height: 80px;
          .noChiose {
            color: #f56c6c;
            height: 40px;
            width: 300px;
          }
          .iconImg {
            width: 60px;
            padding-left: 20px;
            position: absolute;
            right: 0px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .userLIst {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          .choiseUser {
            padding: 0 30px 0 10px;
            margin-right: 10px;
            margin-bottom: 10px;
            line-height: 20px;
            border: 1px solid transparent;
            position: relative;
            width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &:hover {
              color: #f56c6c;
              border: 1px solid #f56c6c;
            }
            .choiseUser-icon {
              display: none;
              position: absolute;
              right: 10px;
              top: 50%;
              transform: translateY(-50%);
            }
            &:hover .choiseUser-icon {
              display: inline-block;
            }
          }
        }
      }
      .upBox {
        width: 200px;
        height: 150px;
        margin-top: 20px;
        background-color: #f9f9f9;
        .upText {
          font-size: 14px;
          text-align: center;
          span:nth-child(2) {
            color: #0082ef;
            padding-left: 10px;
          }
        }
      }
      .imgList {
        position: relative;
        margin-top: 20px;
        width: 200px;
        height: 150px;
        img {
          max-width: 200px;
          max-height: 150px;
        }
        // .imgIcon{
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        // }
      }
      .warText {
        color: #f56c6c;
        font-size: 12px;
      }
    }
  }
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.createUser {
  width: 460px;
  border-top: 1px solid #ccc;
  height: 48px;
  padding: 5px 0 0 21px;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  position: relative;
}
.ant-form-item {
  margin-bottom: 0;
}
/deep/ .ant-modal {
  width: 710px !important;
}
</style>