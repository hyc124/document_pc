
<template>
  <div class="maincontent-tab">
    <div class="maincontent-tab-col">
      <div class="maincontent-tab-col-title maincontent-tab-col-title-h">
        <span style="color:red;" class="name-left">*</span>模板名称
      </div>
      <div class="maincontent-tab-col-content" style="padding:0px;">
        <a-form-model-item label class="item-w">
          <a-input
            style="height:48px;border:none;line-height: 48px;padding:0px 21px;"
            placeholder="请输入模板名称，限制30个字符"
            @change="onName"
            :maxLength="30"
          />
        </a-form-model-item>
      </div>
    </div>
    <div class="maincontent-tab-col">
      <div class="maincontent-tab-col-title maincontent-tab-col-title-h">签报类别名称</div>
      <div class="maincontent-tab-col-content">
        <a-form-model-item label class="item-w">
          <div class="flexIcon">
            <a-radio-group v-model="genre" @change="onGenre" class="choiseType">
              <a-radio
                class="choiseRadio"
                :value="item.id"
                v-for="item in typeList"
                :key="item.id"
                :style="genre==item.id?'color:#0082EF;':''"
              >{{item.name}}</a-radio>
            </a-radio-group>
            <div class="iconimg">
              <span @click="onGoBack(1)">设置新的类别</span>
            </div>
          </div>
        </a-form-model-item>
      </div>
    </div>
    <!-- 字号规则 -->
    <div class="maincontent-tab-col">
      <div class="maincontent-tab-col-title maincontent-tab-col-title-h">字号规则</div>
      <div class="maincontent-tab-col-content">
        <a-form-model-item label class="item-w">
          <div class="body">
            <a-radio-group @change="onRule" v-model="word_no_id">
              <div class="flexIcon">
                <a-radio>不需要规则</a-radio>
                <div class="iconimg">
                  <span @click="onGoBack(2)">设置新的规则</span>
                </div>
              </div>
              <div style="padding:16px 21px 16px 0px;">
                <div v-if="onOff">常用规则:</div>
                <div class="ofen-use-role">
                  <template v-for="(item) in allWordnoList">
                    <a-radio
                      :key="item.id"
                      :value="item.id"
                      :style="word_no_id==item.id?'color:#0082EF;':''"
                      v-if="item.is_default==1"
                    >
                      {{item.name}}
                      <div class="ofen-user-datas" v-show="item.id==word_nos">
                        <span>{{item.word_no}}</span>
                      </div>
                      <span class="ofen-use-icon" v-if="item.is_default==1">常用</span>
                    </a-radio>
                  </template>
                </div>
                <div class="more-role hand" @click="role_data.more_role=!role_data.more_role">
                  <span style="padding-left:21px;">更多字号规则</span>
                  <i class="sanjiao" :class="role_data.more_role?'shang':'xia'"></i>
                </div>
                <div class="more-contant" v-show="role_data.more_role">
                  <div class="search">
                    <a-input-search
                      placeholder="搜索字号规则名称"
                      style="width: 279px;margin-bottom:16px"
                      v-model="role_data.word_no_search"
                      @search="word_no_search"
                    />
                  </div>
                  <div class="radio-list">
                    <template v-for="(item) in allWordnoList">
                      <a-radio
                        :key="item.id"
                        :value="item.id"
                        :style="word_no_id==item.id?'color:#0082EF;':''"
                        v-if="item.is_default!=1"
                      >
                        {{item.name}}
                        <div class="ofen-user-datas" v-show="item.id==word_nos">
                          <span>{{item.word_no}}</span>
                        </div>
                      </a-radio>
                    </template>
                  </div>
                </div>
              </div>
            </a-radio-group>
          </div>
          <!--  -->
        </a-form-model-item>
      </div>
    </div>
    <!-- 流程处理 -->
    <div class="maincontent-tab-col">
      <div class="maincontent-tab-col-title maincontent-tab-col-title-h">流程处理</div>
      <div class="maincontent-tab-col-content">
        <a-form-model-item label class="item-w">
          <div class="s-content">
            <div class="c-content">
              <div class="left">
                <span class="use-liucheng">常用流程：</span>
                <div class="liucheng-box">
                  <a-radio-group v-model="liuId">
                    <div class="ofen-use-list flex-col">
                      <div v-if="approvalList.length==0">暂未设置</div>
                      <a-radio
                        v-else
                        :key="index"
                        :value="item.id"
                        v-for="(item,index) in approvalList"
                        @change="onProcedure(item.id)"
                      >
                        {{item.name}}
                        <span class="ofen-use-icon">常用</span>
                      </a-radio>
                    </div>
                    <div class="more" @click="lookMare()">
                      <span>更多流程</span>
                      <i class="sanjiao" :class="more_show_liucheng?'shang':'xia'"></i>
                    </div>
                    <div style="height:340px">
                      <div class="more-content" v-if="more_show_liucheng">
                        <div class="liucheng-search">
                          <a-input-search
                            placeholder="搜索流程名称"
                            style="width: 279px"
                            @search="liucheng_onSearch"
                            v-model="liuName"
                          />
                        </div>
                        <div class="other-radio">
                          <a-radio
                            :key="index"
                            :value="item.id"
                            v-for="(item,index) in allApprovalList"
                            @change="onProcedure(item.id)"
                            :style="liuId==item.id?'color:#0082EF;':''"
                          >
                            {{item.name}}
                            <span class="ofen-use-icon" v-if="item.is_default==1">常用</span>
                          </a-radio>
                        </div>
                      </div>
                    </div>
                  </a-radio-group>
                </div>
              </div>
              <div class="right">
                <div class="top">
                  <div class="setUser">
                    <div class="iconimg">
                      <span @click="onGoBack(3)">设置新的流程</span>
                    </div>
                  </div>
                  <div class="person-title">默认审批人</div>
                  <div class="person-list">
                    <div class="person-item" v-for="(item,index) in approved" :key="index">
                      <div class="ellipsis" v-if="index>0">...</div>
                      <div class="msg">
                        <div class="user-img">
                          <div class="head-img">
                            <img
                              class="item-top-img"
                              :src="item.avatar||require('../../../../../assets/adddraft/default-head-img.png')"
                              alt
                              srcset
                            />
                          </div>
                        </div>
                        <div class="name">{{item.title}}</div>
                        <div class="other">{{item.approver_type==1?'(会签)':'(或签)'}}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bottom">
                  <div class="person-title">默认抄送人</div>
                  <div class="person-list">
                    <div class="person-item" v-for="(item,index) in CCroved" :key="index">
                      <div class="msg">
                        <div class="user-img">
                          <div class="head-img">
                            <img
                              class="item-top-img"
                              :src="item.avatar||require('../../../../../assets/adddraft/default-head-img.png')"
                              alt
                              srcset
                            />
                          </div>
                        </div>
                        <div class="name">{{item.title}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-form-model-item>
      </div>
    </div>
    <!-- 是否套红 -->
    <div class="maincontent-tab-col borderTom">
      <div class="maincontent-tab-col-title maincontent-tab-col-title-h">是否套红</div>
      <div class="maincontent-tab-col-content">
        <a-form-model-item label class="item-w">
          <a-radio-group style="margin:18px 0 15px;" @change="onCrimson" v-model="is_red">
            <a-radio :value="1" :style="is_red==1?'color:#0082EF;':''">是</a-radio>
            <a-radio :value="0" :style="is_red==0?'color:#0082EF;':''">否</a-radio>
          </a-radio-group>
          <a-checkbox-group v-model="red_template" v-show="whethers" @change="onCrimsonName">
            <div class="solid"></div>

            <div class="want">
              <div class="want-title">
                <span>常用套红模板：</span>
                <span style="color:#0082EF;cursor: pointer;" @click="onGoBack(4)">上传套红模板</span>
              </div>
              <div class="want-content">
                <div class="ofen-use-template">
                  <div class="template-item" v-for="(item,index) in crimsonseList" :key="index">
                    <a-checkbox :key="index" :value="item.id">{{item.name}}</a-checkbox>
                    <div class="template-img">
                      <div class="mask">
                        <div class="look" @click="look_red_template(item)"></div>
                        <div class="bianji" @click="bianji_red_template(item)"></div>
                      </div>
                      <img src="../../../../../assets/adddraft/red-tepment.png" alt />
                    </div>
                  </div>
                </div>
                <div class="redmore" @click="more_show_template=!more_show_template">
                  <span>更多套红模板</span>
                  <i class="sanjiao" :class="more_show_template?'shang':'xia'"></i>
                </div>

                <div class="more-template" v-show="more_show_template">
                  <a-input-search
                    placeholder="搜索模板名称"
                    style="width: 279px"
                    @search="template_onSearch"
                  />
                  <div class="template-list">
                    <div
                      class="template-item"
                      v-for="(item,index) in allCrimsonseList"
                      :key="index"
                    >
                      <a-checkbox :key="index" :value="item.id">{{item.name}}</a-checkbox>
                      <div class="template-img">
                        <div class="mask">
                          <div class="look" @click="look_red_template(item)"></div>
                          <div class="bianji" @click="bianji_red_template(item)"></div>
                        </div>
                        <img src="../../../../../assets/adddraft/red-tepment.png" alt />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-checkbox-group>
        </a-form-model-item>
      </div>
    </div>
    <!-- 套红预览 -->
    <a-modal
      class="view-modal"
      title="套红模板预览"
      :footer="null"
      :visible="view_template.visible"
      @ok="view_template.visible=false"
      @cancel="view_template.visible=false"
      cancelText="取消"
      okText="确认"
    >
      <div class="view_template" v-html="view_template.content"></div>
    </a-modal>
  </div>
</template>
<script>
import { GetAllList } from "@/api/applicationset.js";
import { HttpUrl } from "@/js/public.js";
import { SetpathsetList } from "@/api/postflowpathset"; //获取流程列表
export default {
  name: "BasicInfo",
  components: {},
  filters: {
    img(urls, url) {
      let text = String(urls).startsWith("http");
      let imgurl = "";
      if (text) {
        imgurl = urls;
      } else {
        imgurl = url + urls;
      }
      return imgurl;
    },
  },
  created() {
    //  获取所有列表
    this.getallList();
  },
  data() {
    return {
      word_no_id: "",
      is_red: 3, // 是否需要模板选项
      HttpUrl, // 后端域名
      //规则设置
      liuName: "", //搜索流程名称
      role_data: {
        more_role: false,
        word_no_search: null, //搜索内容
        zanshi_word_no: null, //用于选择切换显示时的数据
      },
      liuchengList: "",
      more_show_template: false,
      more_show_liucheng: false,
      red_template: [], //套红模板
      name: "",
      genre: "",
      rule: "",
      procedure: "",
      crimson: "",
      whethers: false,
      // -----------------------
      approved: [],
      CCroved: [],
      // 分类列表数据
      typeList: [],
      // 字号列表数据
      wordnoList: [],
      //所有的
      allWordnoList: [],
      // 搜索的
      searchWordnoList: [],
      // 流程列表数据
      approvalList: [],
      //所有的
      allApprovalList: [],
      // 搜索存数据
      searchallApprovalList: [],
      // 套红模板列表
      crimsonseList: [],
      //所有的
      allCrimsonseList: [],
      // 搜索存数据
      searchCrimsonseList: [],
      // -----------------------

      liuId: "", //详情流程id
      view_template: { visible: false, content: "" },
      // 跳转的状态
      status: "",
      word_nos: "", // 选中的字号回字id
    };
  },
  computed: {
    onOff() {
      let _onOff = false;
      for (let i = 0; i < this.allWordnoList.length; i++) {
        if (this.allWordnoList[i].is_default == 1) {
          _onOff = true;
        }
      }
      return _onOff;
    },
  },
  methods: {
    //套红模板预览
    look_red_template(item) {
      this.view_template.visible = true;
      this.view_template.content = item.content;
    },
    // 跳转到新页面的弹窗提示
    onGoBack(num) {
      this.status = num;
      let _obj = {
        1: "类别",
        2: "规则",
        3: "流程",
        4: "套红模板",
      };
      this.visible = this.$confirm({
        title: "提示",
        content: `即将跳转新增${_obj[num]}页面,目前页面输入内容将丢失，是否继续跳转？`,
        okText: "确认",
        cancelText: "取消",
        icon: "info-circle",
        onOk: this.handleOk,
      });
    },
    // 跳转到新页面的弹窗确定按钮
    handleOk() {
      if (this.status == 1) {
        this.$router.push(`/signoffclassifyset`);
      } else if (this.status == 2) {
        this.$router.push(`/signoffruleset/signoffadd`);
      } else if (this.status == 3) {
        this.$router.push(`/signoffflowpathset/signoffflowpathadd`);
      } else if (this.status == 4) {
        this.$router.push(`/signoffcrimsonset/crimsonadd?type=1`);
      }
    },
    //套红模板编辑
    bianji_red_template(item) {
      this.visible = this.$confirm({
        title: "提示",
        content: `即将跳转编辑套红模板页面,目前页面输入内容将丢失，是否继续跳转？`,
        okText: "确认",
        cancelText: "取消",
        icon: "info-circle",
        onOk: () => {
          this.$router.push({
            path: "/postcrimsonset/crimsonadd",
            query: {
              id: item.id,
              type: 3,
            },
          });
        },
      });
    },
    lookMare() {
      this.more_show_liucheng = !this.more_show_liucheng;
    },
    //获取流程详情类型： 1 收文 2 发文 3 签报
    getLiuDetail() {
      SetpathsetList({
        approval_id: this.liuId,
        type: 3,
      }).then((res) => {
        if (res.code == 1) {
          this.approved = res.data.approval_process;
          this.CCroved = res.data.cc_list;
        }
      });
    },
    //单选框改变获取
    choiseLiu(id) {
      this.liuId = id;
      this.getLiuDetail();
    },

    //字号搜索
    word_no_search(e) {
      if (e != "") {
        let searchList = [];
        this.allWordnoList.forEach((item) => {
          if (item.name.includes(e)) {
            searchList.push(item);
          }
        });
        this.allWordnoList = searchList;
      } else {
        this.allWordnoList = this.searchWordnoList;
      }
    },
    //模板搜索
    //模板搜索
    template_onSearch(e) {
      if (e != "") {
        let searchList = [];
        this.allCrimsonseList.forEach((item) => {
          if (item.name.includes(e)) {
            searchList.push(item);
          }
        });
        this.allCrimsonseList = searchList;
      } else {
        this.allCrimsonseList = this.searchCrimsonseList;
      }
    },
    //流程搜索
    liucheng_onSearch(e) {
      if (e != "") {
        let searchList = [];
        this.allApprovalList.forEach((item) => {
          if (item.name.includes(e)) {
            searchList.push(item);
          }
        });
        this.allApprovalList = searchList;
      } else {
        this.allApprovalList = this.searchallApprovalList;
      }
    },
    //模板名称
    onName(e) {
      this.$emit("signoffformworksetname", e.target.value);
    },
    //发文的类别
    onGenre(e) {
      this.$emit("signoffformworksetonGenre", e.target.value);
    },
    //规则
    onRule(e) {
      this.$emit("signoffformworksetonRule", e.target.value);
            this.word_nos = e.target.value;
      if (e.target.value !== undefined) {
        this.allWordnoList.forEach((el) => {
          if (el.id === e.target.value) {
            this.role_data.zanshi_word_no = el.word_no;
          }
        });
      } else {
        this.role_data.zanshi_word_no = "";
      }
    },
    //流程处理
    onProcedure(e) {
      this.$emit("signoffformworksetonProcedure", e);
      this.liuId = e;
      this.getLiuDetail();
    },
    //是否套红
    onCrimson(e) {
      this.$emit("signoffformworksetonCrimson", e.target.value);
      if (e.target.value == 0) {
        this.whethers = false;
      } else {
        this.whethers = true;
      }
    },
    onCrimsonName(e) {
      this.$emit("signoffformworksetonCrimsonName", e.join());
    },
    // 获取类别 字号 流程 套红列表
    getallList() {
      GetAllList({ type: 3 }).then((res) => {
        this.typeList = res.data.d_type; //公文
        //流程
        res.data.process.forEach((el) => {
          if (el.is_default == 1) {
            this.approvalList.push(el); //流程
          }
        });
        this.approvalList = this.approvalList.slice(0, 3);
        this.allApprovalList = res.data.process;
        this.searchallApprovalList = res.data.process; //存数据
        //字号
        res.data.word_no.forEach((el) => {
          if (el.is_default == 1) {
            this.wordnoList.push(el); //流程
          }
        });
        this.wordnoList = this.wordnoList.slice(0, 3);
        this.allWordnoList = res.data.word_no; //编码
        this.searchWordnoList = res.data.word_no; //存数据

        //模板
        res.data.redtemplete.forEach((el) => {
          if (el.is_default == 1) {
            this.crimsonseList.push(el); //流程
          }
        });
        this.crimsonseList = this.crimsonseList.slice(0, 3);
        this.allCrimsonseList = res.data.redtemplete; //编码
        this.searchCrimsonseList = res.data.redtemplete; //存数据
      });
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  position: absolute;
  top: 10px;
}
.maincontent
  .maincontent-tab
  .maincontent-tab-col
  .maincontent-tab-col-content
  .body
  .ant-radio-wrapper {
  max-height: 80px;
}
.maincontent
  .maincontent-tab
  .maincontent-tab-col
  .maincontent-tab-col-content
  .body
  .more-contant
  .ant-radio-wrapper {
  max-height: 80px;
}
// 字号规则选中样式
.ofen-user-datas {
  display: flex;
  align-items: center;
  width: 400px;
  height: 45px;
  box-sizing: border-box;
  border-top: 1px dashed rgba(220, 223, 230, 1);
  border-bottom: 1px dashed rgba(220, 223, 230, 1);
  font-size: 14px;
  color: #303133;
  margin: 10px 0 0 25px;
  padding: 10px 0;
  .date,
  .role {
    border-bottom: 1px solid rgba(220, 223, 230, 1);
    padding-bottom: 5px;
  }
  .role {
    margin-left: 10px;
  }
}
.view-modal {
  .view_template {
    position: relative;
    width: 548px;
    margin: 0 auto;
  }
  /deep/ .ant-modal {
    width: 900px !important;
  }
  /deep/ .ant-modal-content {
    width: 900px;
  }
  /deep/.ant-modal-body {
    height: 700px;
  }
}
/deep/.ant-input {
  box-shadow: none !important;
}
.maincontent {
  padding: 30px;
  .maincontent-tab {
    .maincontent-tab-col {
      display: flex;
      .maincontent-tab-col-title-h {
        min-height: 48px;
        .name-left {
          margin-right: 10px;
          font-size: 20px;
          position: relative;
          top: 3px;
        }
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
        flex: 1;
        padding: 0 18px;
        border-top: 1px solid #dcdfe6;
        border-left: 1px solid #dcdfe6;
        border-right: 1px solid #dcdfe6;
        .solid {
          border: 0.5px dashed #eee;
        }
        .flexIcon {
          display: flex;
          justify-content: space-between;
          margin-top: 17px;
          .choiseType {
            width: 900px;
            .choiseRadio {
              padding-bottom: 13px;
            }
          }
        }
        .iconimg {
          width: 90px;
          color: #0082ef;
          cursor: pointer;
          margin-top: -6px;
          i {
            display: inline-block;
            width: 16px;
            height: 12px;
            background: url("../../../../../assets/addpostset/set-font.png")
              no-repeat;
            background-size: 16px 12px;
            margin-right: 10px;
            vertical-align: middle;
            margin-top: -3px;
          }
        }
        .ofen-use-icon {
          display: inline-block;
          width: 34px;
          height: 20px;
          background: rgba(234, 240, 252, 1);
          border-radius: 2px;
          color: #839ccf;
          text-align: center;
          line-height: 20px;
          font-size: 12px;
          margin-left: 10px;
        }
        .body {
          display: flex;
          flex-direction: column;
          width: 100%;
          .ofen-use-role {
            display: flex;
            flex-direction: column;
            margin-top: 10px;
            padding-left: 21px;
            overflow-y: scroll;
            .ofen-use-icon {
              display: inline-block;
              width: 34px;
              height: 20px;
              background: rgba(234, 240, 252, 1);
              border-radius: 2px;
              color: #839ccf;
              text-align: center;
              line-height: 20px;
              font-size: 12px;
              margin-left: 10px;
            }
          }
          .radio-list {
            height: 150px;
            overflow-y: scroll;
          }
          .more-contant {
            display: flex;
            flex-direction: column;
            padding: 20px 0;
            padding-left: 21px;
            position: relative;
            padding-top: 55px;
            .ant-radio-wrapper {
              display: block;
            }
          }
          .ant-radio-wrapper {
            margin-bottom: 12px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .more-role {
            display: flex;
            align-items: center;
            color: #0082ef;
            font-size: 14px;
            margin-top: 10px;
          }
        }
        .c-content {
          display: flex;
          padding-top: 14px;

          .left {
            display: flex;
            flex-direction: column;
            padding-right: 40px;
            border-right: 1px solid rgba(220, 223, 230, 1);
            width: 350px;

            .use-liucheng {
              color: #606266;
              // margin-bottom: 10px;
            }
            .liucheng-box {
              padding-left: 15px;
              height: 100%;
              .ant-radio-group {
                display: flex;
                flex-direction: column;
                .ant-radio-wrapper {
                  margin: 10px 0;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                .ofen-use-list {
                  display: flex;
                  flex-direction: column;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }

                .more {
                  display: flex;
                  align-items: center;
                  color: #0082ef;
                  font-size: 14px;
                  margin: 10px 0;
                  cursor: pointer;
                }
                .more-content {
                  height: 340px;
                  overflow-y: scroll;
                  transition: all 0.3s;
                }
                .other-radio {
                  display: flex;
                  flex-direction: column;
                }
                .liucheng-search {
                  margin: 5px 0;
                }
              }
              .ofen-use-icon {
                display: inline-block;
                width: 34px;
                height: 20px;
                background: rgba(234, 240, 252, 1);
                border-radius: 2px;
                color: #839ccf;
                text-align: center;
                line-height: 20px;
                font-size: 12px;
                margin-left: 10px;
              }
            }
          }
          .right {
            position: relative;
            display: flex;
            flex-direction: column;
            padding: 24px 30px 20px 66px;
            flex: 1;
            .setUser {
              position: absolute;
              top: 2px;
              right: 0;
            }
            .person-title {
              color: #303133;
              font-size: 14px;
              margin-bottom: 20px;
              font-weight: 500;
            }
            .person-list {
              display: flex;
              flex-wrap: wrap;
              .person-item {
                display: flex;
                align-items: center;
                margin-right: 20px;
                margin-bottom: 20px;
                .msg {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  width: 50px;

                  .user-img {
                    position: relative;
                    .head-img {
                      width: 50px;
                      height: 50px;
                      background: rgba(240, 242, 245, 1);
                      border-radius: 2px;
                      img {
                        width: 100%;
                        height: 100%;
                      }
                    }
                    .x {
                      position: absolute;
                      top: -5px;
                      right: -5px;
                      width: 12px;
                      height: 12px;
                      background: url("../../../../../assets/adddraft/x.png");
                      background-size: 12px 12px;
                    }
                  }

                  .name {
                    // margin-top: 5px;
                    width: 80px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    text-align: center;
                    color: #303133;
                  }
                  .other {
                    margin-top: -20px;

                    color: #bbbbbb;
                    font-size: 12px;
                  }
                }

                .ellipsis {
                  align-self: flex-start;
                  color: #606266;
                  font-size: 16px;
                  margin-right: 15px;
                  cursor: pointer;
                }
              }
              .add-user {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 50px;
                height: 50px;
                background: rgba(250, 250, 250, 1);
                border: 1px dashed rgba(220, 223, 230, 1);
                border-radius: 2px;
                color: #9e9e9e;
                font-size: 24px;
                // margin-left: 15px;
                cursor: pointer;
              }
            }
            .top {
              flex: 1;
              border-bottom: 1px dashed rgba(230, 230, 230, 1);
              margin-bottom: 10px;
            }
            .bottom {
              flex: 1;
              .person-item {
                margin-right: 45px;
              }
            }
          }
        }
        .want {
          padding: 20px;
          width: 1050px;
          .want-title {
            display: flex;
            justify-content: space-between;
          }
          .want-content {
            padding: 0 10px;
            .ofen-use-template {
              display: flex;
              flex-wrap: wrap;
              margin-top: 10px;

              .more {
                display: flex;
                align-items: center;
                color: #0082ef;
              }
            }
            .template-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 64px;
              margin-right: 131px;
              margin-bottom: 20px;
              .ant-checkbox-wrapper {
                width: 150px;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin: 0;
              }
              .template-img {
                position: relative;
                margin-top: 10px;
                width: 64px;
                height: 81px;
                &:hover {
                  .mask {
                    display: flex;
                  }
                }
                .mask {
                  display: none;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  position: absolute;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  background: rgba(0, 0, 0, 0.5);
                  .look {
                    width: 16px;
                    height: 12px;
                    background: url("../../../../../assets/adddraft/red-tepment-look.png");
                    background-size: 16px 12px;
                  }
                  .bianji {
                    width: 12px;
                    height: 14px;
                    background: url("../../../../../assets/adddraft/red-tepment-delete.png");
                    background-size: 12px 14px;
                    margin-top: 5px;
                  }
                }
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
            .more-template {
              display: flex;
              flex-direction: column;

              margin-top: 20px;
              .template-list {
                display: flex;
                flex-wrap: wrap;
                margin-top: 20px;
              }
              .template-item {
                margin-right: 131px;
              }
            }
          }
        }
        /deep/ .item-w.ant-row.ant-form-item {
          margin: 0;
          border: none;
        }
        .maincontent-tab-col-content-body {
          .maincontent-tab-col-content-body-col {
            display: flex;
            height: 92px;
            border-bottom: 1px solid #dcdfe6;
            padding-top: 5px;
            .maincontent-tab-col-content-body-col-title {
              width: 100px;
              padding-top: 9px;
              text-align: center;
              color: #606266;
              font-weight: 500;
            }
            .maincontent-tab-col-content-body-col-content {
              flex: 1;
            }
          }
          .maincontent-tab-col-content-body-two-col {
            padding: 21px;
            border-bottom: 1px solid #dcdfe6;
            .maincontent-tab-col-content-body-col-two-content {
              margin-top: 10px;
              border: 1px solid #dcdfe6;
              padding: 16px;
            }
          }
          .maincontent-tab-colboder-top {
            border-top: 1px solid #dcdfe6;
            padding-top: 15px;
            display: flex;
            align-items: center;
            .maincontent-tab-colboder-top-titel {
              width: 160px;
            }
            .maincontent-tab-colboder-top-content {
              flex: 1;
            }
            /deep/ .ant-radio-wrapper {
              width: 180px;
            }
            /deep/.ant-checkbox-wrapper {
              padding: 5px;
            }
          }
        }
      }
    }
  }
}
.borderTom {
  border-bottom: 1px solid #dcdfe6;
}
// 审批人
.transfer-modal {
  /deep/.ant-modal-body {
    padding: 24px 24px 0;
  }
  /deep/ .ant-modal {
    width: 600px !important;
  }
  .search-box {
    display: flex;
    justify-content: space-between;
  }
  .list-box {
    height: 350px;
    // border: 1px solid #ebeef5;
    display: flex;
    .list-box-cl {
      width: 50%;
      height: 100%;
      padding: 0 2px;
      .list-box-cl-cell {
        height: 40px;
        margin: 10px 0;
        display: flex;
        align-items: center;
        .transfer-icon {
          font-size: 24px;
          margin: 0 10px;
        }
        .transferlist-icon {
          color: #e6b821;
        }
        .transferlistcl-icon {
          color: #6fb9f6;
        }
      }
      .list-box-cl-cell-activ {
        background-color: #f2f7ff;
      }
    }
    .list-box-right {
      padding: 0 15px;
      border-left: 1px solid #ebeef5;
      .list-box-right-top {
        padding-bottom: 20px;
        border-bottom: 1px solid #ebeef5;
      }
      .list-box-right-bottom {
        padding: 5px 0;
        height: calc(350px - 42px);
        overflow: auto;
        .list-box-right-bottom-cl {
          line-height: 40px;
          height: 40px;
          padding: 0 10px;
          display: flex;
          justify-content: space-between;
        }
        .list-box-right-bottom-cl:hover {
          background-color: #e6f7ff;
        }
      }
    }
    .list-box-left {
      /deep/ .ant-tabs-bar {
        margin: 0;
      }
      /deep/ .ant-tabs .ant-tabs-top-content {
        height: calc(350px - 32px - 45px);
        overflow: auto;
      }
    }
  }
  .list-box-app {
    max-height: 450px;
    overflow: auto;
    .list-box-top {
      padding: 0;
      border-bottom: 1px solid #ebeef5;
    }
    .list-box-bottom,
    .list-box-top {
      .list-box-top-radio {
        display: block;
        height: 40px;
        line-height: 40px;
      }
    }
    .list-box-bottom {
      padding-bottom: 10px;
      .list-box-bottom-title {
        margin: 10px 0;
      }
    }
  }
}
.items {
  display: flex;
  flex-wrap: wrap;
  .item {
    margin-top: 15px;
    margin-right: 20px;
    max-width: 80px;
    margin-bottom: 15px;
    .item-top {
      width: 50px;
      height: 50px;
      background: rgba(240, 242, 245);
      border-radius: 2px;
      margin: 0 auto;
      position: relative;
      .item-top-img {
        height: 100%;
        width: 100%;
        border-radius: 2px;
      }
    }
    .item-bottom {
      margin-top: 5px;
      text-align: center;
      font-size: 14px;
      line-height: 20px;
    }
    .item-close {
      border-radius: 50%;
      // background: crimson;
      position: absolute;
      top: -6px;
      right: -6px;
      z-index: 10;
      cursor: pointer;
    }
  }
}
.redmore {
  display: flex;
  align-items: center;
  color: #0082ef;
  font-size: 14px;
  margin: 10px 0;
  cursor: pointer;
}

.transfer-modal {
  /deep/ .ant-modal {
    width: 900px !important;
  }
  /deep/ .ant-modal-content {
    width: 900px;
  }
  /deep/.ant-modal-body {
    height: 700px;
  }
  /deep/ .ant-modal-footer {
    border: none;
  }
  .view_template {
    border-bottom: 1px solid #fa5555;
    margin-top: 50px;
  }
}
</style>