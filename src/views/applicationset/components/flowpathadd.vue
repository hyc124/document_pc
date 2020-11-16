<template>
  <div>
    <Maintitle :titleObj="titleObj" @go_back="reverts">
      <div>
        <!-- <a-button @click="reverts">返回</a-button> -->
        <a-button type="primary" class="bcbtn" @click="keep">保存</a-button>
      </div>
    </Maintitle>
    <Maincontent>
      <div class="maincontent-tab">
        <div class="maincontent-tab-col">
          <div class="maincontent-tab-col-title maincontent-tab-col-title-h">
            <span class="red">*</span>流程标题
          </div>
          <div class="maincontent-tab-col-content">
            <a-form-model-item label class="item-w">
              <a-input
                v-model="form.name"
                style="height:71px;border:none;line-height: 71px;"
                placeholder="请输入模板名称，限制30个字符"
                :maxLength="30"
                class="flowpathadd-item-w-input"
              />
            </a-form-model-item>
          </div>
        </div>
        <div class="maincontent-tab-col">
          <div class="maincontent-tab-col-title maincontent-tab-col-title-h">流程说明</div>
          <div class="maincontent-tab-col-content">
            <a-form-model-item label class="item-w">
              <a-textarea
                v-model="form.desc"
                placeholder="请输入流程模板说明，限制500个字符"
                style="height:71px;border:none;resize: none;"
                :maxLength="500"
                class="flowpathadd-item-w-input"
              />
            </a-form-model-item>
          </div>
        </div>
        <div class="maincontent-tab-col">
          <div class="maincontent-tab-col-title" style="border-bottom: 1px solid #dcdfe6;">流程设置</div>
          <div class="maincontent-tab-col-content">
            <div class="maincontent-tab-col-content-body">
              <div class="maincontent-tab-col-content-body-col">
                <div class="maincontent-tab-col-content-body-col-title">可见范围</div>
                <div class="maincontent-tab-col-content-body-col-content">
                  <a-form-model-item>
                    <div class="atags">
                      <a-tag class="atag" v-for="(item,index) in visiblerange.visuals" :key="index">
                        <a-icon
                          :type="item.type==1?'folder':item.type==2?'user':item.type==4?'tags':''"
                          style="margin-right:5px"
                          :theme="item.type==1?'filled':'outlined'"
                          :style="item.type==1?'color:#0082EF':''"
                        />
                        {{item.title}}
                      </a-tag>
                      <span
                        style="color:#7DA4D1;cursor: pointer;"
                        @click="visiblerange.visible=true"
                      >修改</span>
                    </div>
                    <!-- 可见范围弹窗 -->
                    <a-modal
                      class="islook transfer-modal"
                      title="可见范围"
                      :visible="visiblerange.visible"
                      :confirm-loading="confirmLoading"
                      @ok="handleOk"
                      @cancel="handleCancel"
                      cancelText="取消"
                      okText="确认"
                    >
                      <div>
                        <Framelist2
                          :transformation="true"
                          :range="visiblerange"
                          :tag="{tab: true,bm: true,pe: true,company: false,label: true,role: true,lately: true,}"
                          :restype="4"
                        />
                      </div>
                    </a-modal>
                  </a-form-model-item>
                </div>
              </div>
              <div class="maincontent-tab-col-content-body-two-col">
                <div>审批流程</div>
                <div class="maincontent-tab-col-content-body-col-two-content">
                  <div>默认审批人</div>
                  <div>
                    <a-form-model-item style="margin:0">
                      <div class="items">
                        <template v-if="applt(approved)">
                          <template v-for="(item, index) in approved">
                            <div class="item-s" :key="index">
                              <div class="item">
                                <div class="item-top">
                                  <img class="item-top-img" :src="img(item.avatar)" alt srcset />
                                  <a-icon
                                    type="close-circle"
                                    class="item-close"
                                    theme="filled"
                                    @click="appitemClose(item.value)"
                                  />
                                </div>
                                <div class="item-bottom">
                                  {{item.title}}
                                  <br />
                                  {{item.approver_type | tofixed}}
                                </div>
                              </div>
                              <template v-if="appadd(index,approved)">
                                <a-button
                                  type="dashed"
                                  class="labeladds"
                                  @click="addapproved(index+1)"
                                >
                                  <a-icon type="plus" />
                                </a-button>
                              </template>
                              <template v-else>
                                <div class="itme-add hand" @click="addapproved(index+1)">...</div>
                              </template>
                            </div>
                          </template>
                        </template>
                        <template v-else>
                          <a-button type="dashed" class="labeladd" @click="addapproved(0)">
                            <a-icon type="plus" />
                          </a-button>
                        </template>
                      </div>
                      <!-- 审批人弹窗 -->
                      <a-modal
                        class="transfer-modal appvisi-modal"
                        title="选择审批人"
                        :visible="appvisi"
                        :confirm-loading="confirmLoading"
                        @ok="apphandleOk"
                        @cancel="apphandleCancel"
                        cancelText="取消"
                        okText="确认"
                      >
                        <div class="list-box-app">
                          <div class="list-box-top">
                            <a-radio-group
                              v-model="appvisiradiovalue"
                              @change="appvisiradioonChange"
                            >
                              <a-radio class="list-box-top-radio" :value="1">上级（自动设置通讯录中的上级领导为抄送人）</a-radio>
                              <a-radio class="list-box-top-radio" :value="2">标签</a-radio>
                              <a-radio class="list-box-top-radio" :value="3">单个成员</a-radio>
                              <a-radio class="list-box-top-radio" :value="4">申请人</a-radio>
                              <a-radio class="list-box-top-radio" :value="5">部门</a-radio>
                            </a-radio-group>
                          </div>
                          <div class="list-box-bottom">
                            <div v-show="appvisiradiovalue==1">
                              <div class="list-box-bottom-title">指定级别</div>
                              <a-select
                                size="default"
                                v-model="appvisiradioone.appvisiselectvalue"
                                style="width: 200px"
                                @change="handleChange"
                              >
                                <a-select-option v-for="i in selectO" :key="i.value">{{i.title}}</a-select-option>
                              </a-select>
                              <div class="list-box-bottom-title">同级有多个上级时</div>
                              <a-radio-group v-model="radiovalue">
                                <a-radio class="list-box-top-radio" :value="2">或签（一名上级同意即可）</a-radio>
                                <a-radio class="list-box-top-radio" :value="1">会签（须所有上级同意）</a-radio>
                              </a-radio-group>
                            </div>
                            <div v-show="appvisiradiovalue==2">
                              <div class="list-box-bottom-title">请选择标签审批方式：</div>
                              <a-radio-group v-model="radiovalue">
                                <a-radio class="list-box-top-radio" :value="2">或签（一名上级同意即可）</a-radio>
                                <a-radio class="list-box-top-radio" :value="1">会签（须所有上级同意）</a-radio>
                              </a-radio-group>
                              <Framelist
                                :range="appvisiradiotwo.tagsrange"
                                :tag="{tags:true,tab:false,pe:false,bm:false}"
                                style="margin-top:10px"
                                :restype="3"
                              />
                            </div>
                            <div v-show="appvisiradiovalue==3">
                              <Framelist
                                :range="appvisiradiothree.tagsrange"
                                :tag="{tags:false,tab:true,pe:true,bm:false}"
                                style="margin-top:10px"
                                :restype="2"
                              />
                            </div>
                            <div v-show="appvisiradiovalue==4"></div>
                            <div v-show="appvisiradiovalue==5">
                              <div class="list-box-bottom-title">请选择标签审批方式：</div>
                              <a-radio-group v-model="radiovalue">
                                <a-radio class="list-box-top-radio" :value="2">或签（一名上级同意即可）</a-radio>
                                <a-radio class="list-box-top-radio" :value="1">会签（须所有上级同意）</a-radio>
                              </a-radio-group>
                              <Framelist
                                :range="appvisiradiofive.tagsrange"
                                :tag="{tags:false,tab:true,pe:false,bm:true}"
                                style="margin-top:10px"
                                :restype="1"
                              />
                            </div>
                          </div>
                        </div>
                      </a-modal>
                    </a-form-model-item>
                  </div>
                  <div>默认抄送人</div>
                  <div>
                    <a-form-model-item style="margin:0">
                      <div class="items">
                        <template v-if="applt(CCroved)">
                          <template v-for="(item, index) in CCroved">
                            <div class="item-s" :key="index">
                              <div class="item" :key="index">
                                <div class="item-top">
                                  <img class="item-top-img" :src="img(item.avatar)" alt srcset />
                                  <a-icon
                                    type="close-circle"
                                    theme="filled"
                                    class="item-close"
                                    @click="CCitemClose(item.value)"
                                  />
                                </div>
                                <div class="item-bottom">
                                  {{item.title}}
                                  <br />
                                  {{item.approver_type | tofixed}}
                                </div>
                              </div>
                              <template v-if="appadd(index,CCroved)">
                                <a-button
                                  type="dashed"
                                  class="labeladds"
                                  @click="addcclist(index+1)"
                                >
                                  <a-icon type="plus" />
                                </a-button>
                              </template>
                              <template v-else>
                                <div class="itme-add"></div>
                              </template>
                            </div>
                          </template>
                        </template>
                        <template v-else>
                          <a-button type="dashed" class="labeladd" @click="addcclist(0)">
                            <a-icon type="plus" />
                          </a-button>
                        </template>
                      </div>
                      <!-- 抄送人弹窗 -->
                      <a-modal
                        class="transfer-modal"
                        title="选择抄送人"
                        :visible="CCperson"
                        :confirm-loading="confirmLoading"
                        @ok="CChandleOk"
                        @cancel="CChandleCancel"
                        cancelText="取消"
                        okText="确认"
                      >
                        <div>
                          <Framelist2
                            :range="CCpersonradio.tagsrange"
                            :tag="{  tab: true,bm: true,pe: true,company: false,label: true,role: true,lately: true,}"
                            :restype="4"
                          />
                        </div>
                      </a-modal>
                    </a-form-model-item>
                  </div>
                  <div class="maincontent-tab-colboder-top">
                    <div class="maincontent-tab-colboder-top-titel">撤销权限</div>
                    <div class="maincontent-tab-colboder-top-content">
                      <a-checkbox-group v-model="form.typethr">
                        <a-checkbox value="revoke">允许审批人撤销</a-checkbox>
                      </a-checkbox-group>
                    </div>
                  </div>
                </div>
                <div class="maincontent-tab-colboder-top" style="border:none;padding:17px">
                  <div class="maincontent-tab-colboder-top-titel">抄送通知</div>
                  <div class="maincontent-tab-colboder-top-content">
                    <a-radio-group v-model="form.resource" @change="onRadio">
                      <a-radio value="1" :style="form.resource==1?'color:#0082EF;':''">提交申请时抄送</a-radio>
                      <a-radio value="2" :style="form.resource==2?'color:#0082EF;':''">审批通过后抄送</a-radio>
                    </a-radio-group>
                  </div>
                </div>
                <div class="maincontent-tab-colboder-top" style="padding:17px">
                  <div class="maincontent-tab-colboder-top-titel">审批通知</div>
                  <a-radio-group v-model="form.edit_revoke" @change="onRadio">
                    <a-radio value="1" :style="form.edit_revoke==1?'color:#0082EF;':''">审批完成后通知</a-radio>
                    <a-radio value="2" :style="form.edit_revoke==2?'color:#0082EF;':''">每个节点审批完成后通知</a-radio>
                  </a-radio-group>
                </div>
                <div class="maincontent-tab-colboder-top" style="padding:17px">
                  <div class="maincontent-tab-colboder-top-titel">设置为我的常用流程</div>
                  <a-radio-group v-model="form.collect" @change="onRadio">
                    <a-radio value="1" :style="form.collect==1?'color:#0082EF;':''">是</a-radio>
                    <a-radio value="2" :style="form.collect==2?'color:#0082EF;':''">否</a-radio>
                  </a-radio-group>
                </div>
                <div class="maincontent-tab-colboder-top" style="padding:17px">
                  <div class="maincontent-tab-colboder-top-titel">修改权限</div>
                  <a-checkbox-group v-model="form.typethrS">
                    <a-checkbox value="edit_approval">提交申请时，员工不可修改固定审批人</a-checkbox>
                    <br />
                    <a-checkbox value="edit_cclist">提交申请时，员工不可修改固定抄送人</a-checkbox>
                  </a-checkbox-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Maincontent>
  </div>
</template>
<script>
import Tree from "@/views/applicationset/postset/postflowpathset/components/tree.vue";
import Framelist from "@/views/applicationset/postset/postflowpathset/components/framelist.vue";
import Framelist2 from "@/views/sendout/draft/addcompoents/components/organization/framelist.vue";
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import {
  AddpathsetList,
  SetpathsetList,
  SavepathsetList,
} from "@/api/postflowpathset.js";
import { OrganiZationalList } from "@/api/public.js";
import { HttpUrl } from "@/js/public.js";
import { get_roloe_menu } from '@/api/router.js'
let selectO = [
  {
    title: "直接上级",
    value: "a1",
  },
  {
    title: "第2上级",
    value: "a2",
  },
  {
    title: "第3上级",
    value: "a3",
  },
  {
    title: "第4上级",
    value: "a4",
  },
  {
    title: "第5上级",
    value: "a5",
  },
  {
    title: "第6上级",
    value: "a6",
  },
  {
    title: "第7上级",
    value: "a7",
  },
  {
    title: "第8上级",
    value: "a8",
  },
  {
    title: "第9上级",
    value: "a9",
  },
  {
    title: "第10上级",
    value: "a10",
  },
];
export default {
  name: "Flowpathadd",
  props: ["path_type"],
  data() {
    return {
      defultimg: require("@/assets/adddraft/default-head-img.png"),
      // 头部需要的开关集合
      titleObj: {
        retu: true, // 返回开关
      },
      HttpUrl, // 后端域名
      addid: undefined, // undefined为新增 有就为编辑
      selectO, // 指定级别
      confirmLoading: false, // 弹窗确认按钮加载动画
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: "",
        typethr: ["revoke"],
        typethrS: ["edit_approval", "edit_cclist"],
        resource: "2",
        edit_revoke: "1",
        collect: "2",
        desc: "",
      },
      del_prefix: {
        1: "bm",
        2: "pe",
        3: "company",
        4: "label",
        5: "role",
        6: "lately",
      },
      //---------- 可见范围----------
      visiblerange: {
        visible: false, // 可见范围弹窗
        visual: [], // 弹窗
        visuals: [], // 不是弹框
      },
      //---------- 可见范围 ----------

      //---------- 审批人 ----------
      app_index: 0,
      appvisi: false,
      appvisiradiovalue: 1, // 选择审批类型
      approved: [], // 选了的审批节点
      ce_approved: [],
      radiovalue: 2, // 或签还是会签
      appvisiradioone: {
        appvisiselectvalue: "a1",
        appvisiselecttext: "直接上级",
        appvisiradiovalue: 2,
      },
      appvisiradiotwo: {
        appvisiradiovalue: 2,
        tagsrange: {
          visual: [], // 弹窗
        },
      },
      appvisiradiothree: {
        tagsrange: {
          visual: [], // 弹窗
        },
      },
      appvisiradiofour: {},
      appvisiradiofive: {
        appvisiradiovalue: 2,
        tagsrange: {
          visual: [], // 弹窗
        },
      },
      //---------- 审批人 ----------
      //---------- 抄送人 ----------
      ccp_index: 0,
      CCperson: false,
      // CCpersonradiovalue: 1,
      CCroved: [], // 没打开,
      CCpersonradio: {
        tagsrange: {
          visual: [], //打开了
        },
      },
      //---------- 抄送人 ----------

      // 主页传来的数据
      mainData: null,
      // 抄送通知
      radio: null,
    };
  },
  computed: {
    applt() {
      return (v) => {
        return v.length > 0;
      };
    },
    appadd() {
      return (v, c) => {
        return v == c.length - 1;
      };
    },
    img() {
      return (urls) => {
        if (urls == "") {
          return this.defultimg;
        } else {
          let text = String(urls).startsWith("http");
          let imgurl = "";
          if (text) {
            imgurl = urls;
          } else {
            imgurl = this.HttpUrl + urls;
          }
          return imgurl;
        }
        return;
      };
    },
  },
  mounted() {
    this.addid = this.$route.query?.id;
    if (this.addid != undefined) {
      // 获取编辑数据
      SetpathsetList({ approval_id: this.addid, type: this.path_type }).then(
        (res) => {
          this.form.name = res.data.name; // 流程标题
          this.form.desc = res.data.explain; // 流程模版说明
          this.form.resource = res.data.cc_notice.toString(); // 审批通过
          this.form.edit_revoke = res.data.edit_revoke.toString();
          this.form.collect = res.data.other.collect.toString();
          this.form.typethr = []; //是否允许审批人撤销
          this.form.typethrS = []; //是否允许审批人撤销
          for (let key in res.data.revoke) {
            // 1 可以 2 不可以
            if (res.data.revoke[key] == 1) {
              this.form.typethr.push(key); // 是否允许审批人撤销
            }
          }
          for (let key in res.data.root_setting) {
            if (res.data.root_setting[key] == 2) {
              this.form.typethrS.push(key); // 是否允许审批人撤销
            }
          }
          let CC = res.data.cc_list.map((r) => {
            if (r.type == 2) {
              r.value = "tag" + r.value;
            }
            return r;
          });
          let APP = res.data.approval_process.map((r) => {
            if (r.type == 1) {
              r.value = "a" + r.value;
            }
            if (r.type == 2) {
              r.value = "tag" + r.value;
            }
            return r;
          });
          let VIE = res.data.visible_range.map((r) => {
            // 前端type 0 个人 1部门 2标签 后端 1个人 2部门 3标签
            switch (r.type) {
              case 1:
                r.type = 2;
                r.del_id = this.del_prefix[2] + r.value;
                break;
              case 2:
                r.type = 1;
                r.del_id = this.del_prefix[1] + r.value;
                break;
              case 3:
                r.type = 4;
                r.del_id = this.del_prefix[4] + r.value;
                break;
              case 4:
                r.type = 5;
                r.del_id = this.del_prefix[5] + r.value;
                break;
            }

            return r;
          });
          this.CCroved = CC; // 抄送人
          this.approved = APP; // 审批人
          this.visiblerange.visual = res.data.visible_range; // 可见范围
          this.visiblerange.visuals = res.data.visible_range; // 可见范围
        }
      );
    } else {
      let _userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
      let _dep_name = _userinfo.dep_name.split(",");
      let _department = _userinfo.department.split(",");
      for (let i = 0; i < _dep_name.length; i++) {
        this.visiblerange.visuals.push({
          avatar: "",
          title: _dep_name[i],
          type: 1,
          value: _department[i],
        });
        this.visiblerange.visual.push({
          avatar: "",
          title: _dep_name[i],
          type: 1,
          value: _department[i],
        });
      }
    }
  },
  created() {
    // 接收传来的参数
    this.GetMaindata();
    get_roloe_menu().then((data) => {
      this.$store.commit("SET_LEFTDATA_jurisdiction", data.data);
    });
    // 组织架构的数据list
    // this.addList();
  },
  filters: {
    //可以有很多的自定义过滤器
    tofixed(i) {
      //这里的this 是window  input是指 | 符号之前的数据 param1 是参数，可以用更多的参数
      return i == 1 ? "(会签)" : i == 2 ? "(或签)" : "";
    },
  },
  components: {
    Maintitle,
    Maincontent,
    Tree,
    Framelist,
    Framelist2,
  },
  methods: {
    // 深拷贝
    StoP(a) {
      return JSON.parse(JSON.stringify(a));
    },
    // 清除弹窗勾选审批人
    cloerRen(e) {
      e.tagsrange.visual = [];
    },
    // 打开审批人
    addapproved(i) {
      this.app_index = i;
      this.appvisi = true;
    },
    // 打开抄送人
    addcclist(i) {
      this.ccp_index = i;
      this.CCperson = true;
      this.CCpersonradio.tagsrange.visual = this.StoP(this.CCroved);
    },
    // 点击取消，返回上一页
    reverts() {
      this.$router.go(-1);
    },
    keep() {
      if (this.form.name.trim() == "") {
        this.$message.error("请输入流程标题", 1);
        return false;
      }
      if (this.visiblerange.visuals.length == 0) {
        this.$message.error("请设置可见范围", 1);
        return false;
      }
      if (this.approved.length == 0) {
        this.$message.error("请设置审批人", 1);
        return false;
      }
      if (this.form.resource.trim() == "") {
        this.$message.error("请设置抄送通知", 1);
        return false;
      }
      // 审批人
      let approval_process = this.approved.map((x) => {
        if (x.type == 2 || x.type == 1) {
          x.value = x.value.replace(/[^0-9]/gi, "");
        }
        x.handwritten_signature = 0;
        return x;
      });
      // 抄送人
      let cc_list = this.CCroved.map((x) => {
        // 前端 1组织架构(部门)，2组织架构(人)，3发文收文单位，4标签，5角色，6最近选择
        // 后端 1 部门 2 标签 3 个人
        x.type = x.type == 2 ? 3 : x.type;
        return x;
      });
      // 可见范围
      let visible_range = this.StoP(this.visiblerange.visuals);
      visible_range = visible_range.map((x) => {
        switch (x.type) {
          //部门
          case 1:
            x.type = 2;
            break;
          //人
          case 2:
            x.type = 1;
            break;
          //标签
          case 4:
            x.type = 3;
            break;
          //角色
          case 5:
            x.type = 4;
            break;

          //最近选择
          case 6:
            x.type = 5;
            break;
        }
        if (x.all_users) {
          x.userid = x.all_users.map((el) => {
            return el.userid;
          });
        }
        return x;
      });

      let root_setting = {
        revoke: 2,
        edit_approval: 1,
        edit_cclist: 1,
      };
      for (let t of this.form.typethr) {
        root_setting[t] = 1;
      }
      for (let t of this.form.typethrS) {
        root_setting[t] = 2;
      }
      let approval = {
        group_id: 1,
        name: this.form.name.trim(),
        visible_range,
        root_setting,
        cc_notice: this.form.resource.trim(),
        edit_revoke: this.form.edit_revoke.trim(),
        collect: this.form.collect.trim(),
        cc_list,
        approval_process,
        explain: this.form.desc.trim(),
        type: this.path_type,
      };
      // 添加
      if (this.addid == undefined) {
        AddpathsetList({ approval }).then((res) => {
          if (res.code == 1) {
            this.$router.push({
              path:
                this.path_type == 2
                  ? "/postflowpathset"
                  : this.path_type == 1
                  ? "/getflowpathset"
                  : this.path_type == 3
                  ? "/signoffflowpathset"
                  : "/home",
            });
          } else {
            this.$message.error(msg, 1);
          }
        });
      }
      // 修改
      else {
        SavepathsetList({ approval, approval_id: this.addid }).then((res) => {
          if (res.code == 1) {
            this.$router.push({
              path:
                this.path_type == 2
                  ? "/postflowpathset"
                  : this.path_type == 1
                  ? "/getflowpathset"
                  : this.path_type == 3
                  ? "/signoffflowpathset"
                  : "/home",
            });
          } else {
            this.$message.error(msg, 1);
          }
        });
      }
    },
    //------------ 可见范围  ------------
    // 弹窗 确定
    handleOk(e) {
      this.visiblerange.visible = false;
      this.visiblerange.visuals = this.StoP(this.visiblerange.visual);
    },
    // 弹窗 取消
    handleCancel(e) {
      this.visiblerange.visible = false;
      this.visiblerange.visual = this.StoP(this.visiblerange.visuals);
    },
    //------------ 可见范围  ------------
    //------------ 审批人  ------------
    // 弹窗 确认
    apphandleOk() {
      let a = this.appvisiradiovalue; // 选择审批类型
      if (a == 1) {
        // 选择上级
        let b = this.appvisiradioone.appvisiselectvalue;
        let c = this.appvisiradioone.appvisiselecttext;
        this.approved.splice(this.app_index, 0, {
          type: a,
          title: c,
          approver_type: this.radiovalue,
          value: b,
          avatar: "",
        });
      } else if (a == 2) {
        let b = this.appvisiradiotwo;
        let d = b.tagsrange.visual;
        for (let vel of d) {
          this.approved.splice(this.app_index, 0, {
            type: a,
            title: vel.title,
            approver_type: this.radiovalue,
            value: vel.value,
            avatar: vel.avatar,
          });
          this.app_index++;
        }
      } else if (a == 3) {
        let b = this.appvisiradiothree;
        for (let vel of b.tagsrange.visual) {
          this.approved.splice(this.app_index, 0, {
            type: a,
            title: vel.title,
            approver_type: "",
            value: vel.value,
            avatar: vel.avatar,
          });
          this.app_index++;
        }
      } else if (a == 4) {
        this.approved.splice(this.app_index, 0, {
          type: a,
          title: "申请人",
          approver_type: "",
          value: "",
          avatar: "",
        });
      } else if (a == 5) {
        let b = this.appvisiradiofive;
        for (let vel of b.tagsrange.visual) {
          this.approved.splice(this.app_index, 0, {
            type: a,
            title: vel.title,
            approver_type: this.radiovalue,
            value: vel.value,
            avatar: vel.avatar,
          });
          this.app_index++;
        }
      }
      this.appvisi = false;
      this.cloerRen(this.appvisiradiotwo);
      this.cloerRen(this.appvisiradiothree);
      this.cloerRen(this.appvisiradiofive);
    },
    // 弹窗 取消
    apphandleCancel(e) {
      this.appvisi = false;
      this.cloerRen(this.appvisiradiotwo);
      this.cloerRen(this.appvisiradiothree);
      this.cloerRen(this.appvisiradiofive);
    },
    // 切换类型
    appvisiradioonChange(e) {},
    // 下拉级别
    handleChange(value, a) {
      this.appvisiradioone.appvisiselecttext =
        a.componentOptions.children[0].text;
    },
    // 删除标签
    appitemClose(e) {
      for (let i in this.approved) {
        if (this.approved[i].value == e) {
          this.approved.splice(i, 1);
          return true;
        }
      }
    },
    //------------ 审批人  ------------

    //------------ 抄送人  ------------
    // 弹窗 确认
    CChandleOk() {
      this.CCperson = false;
      this.CCroved = this.CCpersonradio.tagsrange.visual.map((v) => {
        return v;
      });
    },
    // 弹窗 取消
    CChandleCancel(e) {
      this.CCperson = false;
      this.cloerRen(this.CCpersonradio);
    },
    // 下拉级别
    CChandleChange(value, a) {
      this.CCpersonradioone.appvisiselecttext =
        a.componentOptions.children[0].text;
    },
    // 删除标签
    CCitemClose(e) {
      for (let i in this.CCroved) {
        if (this.CCroved[i].value == e) {
          this.CCroved.splice(i, 1);
          return true;
        }
      }
    },
    //------------ 抄送人  ------------
    // 抄送通知
    onRadio(e) {
      this.radio = e.target.value;
    },
    // 接收点击编辑之后传来的参数
    GetMaindata() {
      this.$bus.$on("postflowpathsetSetdata", (val) => {
        this.mainData = val;
        this.form.name = val.name;
      });
    },
    // 获取发送ajax的数据
    GetajaxData() {
      let group_id = this.mainData.id;
      let name = this.form.name;
      let explain = this.form.desc;
    },
  },
};
</script>
<style lang="less" scoped>
.red {
  color: red;
  font-size: 20px;
  margin-right: 5px;
  margin-top: 4px;
}
/deep/.atags .atag {
  background: #ffffff;
}
.maincontent {
  padding: 30px;
  .maincontent-tab {
    .maincontent-tab-col {
      display: flex;
      .maincontent-tab-col-title-h {
        height: 72px;
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
        border-top: 1px solid #dcdfe6;
        border-left: 1px solid #dcdfe6;
        border-right: 1px solid #dcdfe6;
        /deep/ .item-w.ant-row.ant-form-item {
          margin: 0;
          border: none;
        }
        .flowpathadd-item-w-input {
          box-shadow: none;
          &::-webkit-input-placeholder {
            line-height: 60px;
          }
        }
        .maincontent-tab-col-content-body {
          .maincontent-tab-col-content-body-col {
            display: flex;
            min-height: 92px;
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
.labeladd {
  margin-top: 15px;
  margin-right: 20px;
  margin-bottom: 15px;
  width: 50px;
  height: 50px;
  background-color: #fafafa;
}
.atags {
  font-size: 14px;
  .icona {
    margin-right: 8px;
  }
  .atag {
    padding: 0 10px 0;
    min-width: 124px;
    height: 28px;
    font-size: 14px;
    line-height: 26px;
    vertical-align: middle;
    margin: 0 20px 0 0;
  }
}
.items {
  display: flex;
  flex-wrap: wrap;
  .item-s {
    display: flex;
    .item {
      margin-top: 15px;
      // margin-right: 20px;
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
    .labeladds {
      margin-top: 15px;
      margin-left: 35px;
      width: 50px;
      height: 50px;
      background-color: #fafafa;
    }
    .itme-add {
      padding: 20px 20px 55px;
      font-size: 25px;
      line-height: 25px;
    }
  }
}
.checkbox-box {
  margin: 10px 0;
}
.bcbtn {
  margin-left: 20px;
}
.transfer-modal {
  /deep/ .ant-modal {
    width: 793px !important;
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
.appvisi-modal {
  /deep/.ant-modal-body {
    padding: 5px 24px;
  }
}
</style>