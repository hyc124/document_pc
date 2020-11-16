<template>
  <div>
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <div class="maincontent-box maincontent-left">
        <div class="maincontent-left-pd">
          <a-radio-group default-value="1" @change="onRadioBtn" button-style="solid">
            <a-radio-button value="1">组织架构</a-radio-button>
            <a-radio-button value="2">标签</a-radio-button>
          </a-radio-group>
        </div>
        <div>
          <Tree v-if="tabs.children!=''" :children="tabs.children" @treeClick="treeClick" />
        </div>
      </div>
      <div class="maincontent-box maincontent-right">
        <Header :title="HeaderTitle">
          <div class="flex-col-bd"></div>
          <a-button @click="onNewlyAdded" class="maincontent-newly-added">角色管理</a-button>
          <a-button @click="onSynchro" v-if="powers('organization_synchronous')">同步组织架构</a-button>
        </Header>
        <!-- 新加的已选用户和角色选择，关键词的搜索 -->
        <div class="flex-col">
          <div class="organizational-box">
            已选
            <span class="organizational-box-num">{{Keys.length}}</span>位用户
          </div>
          <a-button
            :disabled="disabled"
            v-if="powers('organization_set_role')"
            class="organizational-batch-edit"
            @click="showModal"
          >批量编辑</a-button>
          <div class="flex-col-bd"></div>
          <a-select
            v-if="tabs.offOnNum == 1"
            style="width: 150px"
            @change="handleChange"
            v-model="role.roletext"
            placeholder="请选择角色"
          >
            <a-select-option key="21354" value>全部</a-select-option>
            <a-select-option
              v-for="itme in role.roleLists"
              :key="itme.id"
              :value="itme.id"
            >{{itme.role_name}}</a-select-option>
          </a-select>
          <a-input-search
            v-model="keyword"
            placeholder="请输入姓名"
            style="width: 230px;height: 32px;margin-left:15px;"
            :maxLength="20"
          />
          <a-button type="primary" class="organizational-batch-edit" @click="addUsersLiset(1)">查询</a-button>
        </div>
        <Comtable :tabs="tabs.userList" @rowClick="rowClick" @compile="compile" @onTables="onTables" :paging="paging" />
      </div>
    </Maincontent>
    <!-- 编辑用户弹窗html组件 -->
    <a-modal v-model="popup.visible" title="编辑用户" on-ok="handleOk">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button
          key="submit"
          type="primary"
          :disabled="!onOff"
          :loading="popup.loading"
          @click="handleOk"
        >确定</a-button>
      </template>
      <div class="flex-col">
        <span class="organizational-popup-red">*</span>
        <span class="organizational-popup-left">姓名</span>
        <a-input
          class="flex-col-bd organizational-popup-input"
          v-model="popup.inputText"
          :disabled="true"
        />
      </div>
      <div class="flex-col organizational-bott-box">
        <span class="organizational-popup-red">*</span>
        <span class="organizational-popup-left">角色</span>
        <a-select
          class="flex-col-bd organizational-popup-input"
          style="width: 150px"
          @change="selectId"
          v-model="popup.inputTexts"
          placeholder="请选择角色"
          mode="multiple"
        >
          <a-select-option
            v-for="itme in role.roleLists"
            :key="itme.id"
            :value="itme.id"
          >{{itme.role_name}}</a-select-option>
        </a-select>
      </div>
    </a-modal>
    <!-- 点击同步组织架构弹窗 -->
    <a-modal title="同步组织架构" v-model="modal.visible">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="popup.loading" @click="uploadOk">确定</a-button>
      </template>
      <p class="upload-title flex-col">
        <span class="upload-title-left">即将同步组织架构</span>
        <span class="flex-col-bd"></span>
        <span class="upload-title-right hand" v-if="is_wx3" @click="onSecret">如何获取通讯录secret?</span>
      </p>
      <a-input v-if="is_wx3" v-model="modal.kwd" placeholder="请输入通讯录secret以同步部门、人员名称" />
      <p class="upload-bott-text">
        请确认企业微信后台【公文管理系统】应用可见范围内，
        <br />包含您本人，否则同步后您将被禁止登录，确定同步吗？
      </p>
    </a-modal>
    <!-- 如何获取通讯录secret弹窗 -->
    <a-modal
      title="通讯录secret获取方法"
      dialogClass="maincontent-modal"
      v-model="secret.visible"
      on-ok="handleOk"
    >
      <template slot="footer">
        <a-button key="submit" type="primary" @click="onSecretgb">关闭</a-button>
      </template>
      <a-carousel arrows>
        <div slot="prevArrow" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
          <a-icon type="left-circle" />
        </div>
        <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
          <a-icon type="right-circle" />
        </div>
        <div class="otationbox" v-for="itme in secret.obj" :key="itme.toptext">
          <img class="Rotationimgs" :src="itme.imgurl" alt />
          <p class="Rotationtoptext">{{itme.toptext}}</p>
          <p class="Rotationbottext">{{itme.bottext}}</p>
        </div>
      </a-carousel>
    </a-modal>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import Tree from "@/views/organizational/components/tree.vue";
import Header from "@/views/organizational/components/header.vue";
import Comtable from "@/views/organizational/components/comtable.vue";
import {
  OrganiZational,
  SetUser,
  getUsersByRoleOrKwd,
  GetSecret
} from "@/api/organizational.js";
import { OrganiZationalList, obtainRole, addLabelList } from "@/api/public.js";
export default {
  name: "Organizational",
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: false // 返回开关
      },
      tabs: {
        // 用户列表数据
        userList: {
          // 请求获取的数据
          data: "",
          // 用户表格的函数
          rowSelection: {}
        },
        children: [], // 左边部门和标签列表数据
        offOnNum: 1
      },
      Keys: [], // 当前列表选中的列表的key集合
      role: {
        // 角色信息列表
        roleLists: "",
        // 角色下拉框选择信息
        roletext: undefined,
        // 角色条件选择的id
        roleid: ""
      },
      keyword: "", // 条件查询，输入框关键词
      onOff: true,
      treeClickid: "", // 点击文件夹的id
      addListnum: 0, // 第几次调用列表函数
      disabled: true, // 批量按钮开关
      popup: {
        // 弹窗确定按钮加载中
        loading: false,
        // 弹窗开关
        visible: false,
        // 弹窗角色名称展示框
        inputText: "",
        // 弹窗角色选中的id
        inputId: "",
        // 弹窗角色选中的文字
        inputTexts: [],
        // 弹窗中的 选中人员的id
        id: ""
      },
      // 数据组织架构和标签的集合
      datas: {
        // 标签数据
        LabelDatas: "",
        addListZz: {
          tree: {}
        }
      },
      // 组织架构弹窗控制数据
      modal: {
        visible: false,
        // 弹窗输入框数据
        kwd: ""
      },
      // secret通讯录弹窗
      secret: {
        visible: false,
        obj: [
          {
            toptext: "第一步",
            bottext:
              "打开企业微信管理后台，点击「登录」，以管理员身份企业微信扫码登录。",
            imgurl: require("@/assets/organizational/Rotation1.png")
          },
          {
            toptext: "第二步",
            bottext:
              "登录成功后，在菜单栏点击「管理工具」，进入以后点击「通讯录同步」。",
            imgurl: require("@/assets/organizational/Rotation2.png")
          },
          {
            toptext: "第三步",
            bottext: "进入该界面后，在secret栏，直接复制对应链接。",
            imgurl: require("@/assets/organizational/Rotation3.png")
          },
          {
            toptext: "第四步",
            bottext: "将复制的链接粘贴至secret输入框，点击「确定」同步成功！",
            imgurl: require("@/assets/organizational/Rotation4.png")
          },
          {
            toptext: "第五步",
            bottext: "将复制的链接粘贴至secret输入框，点击“确定”同步成功！",
            imgurl: require("@/assets/organizational/Rotation5.png")
          }
        ]
      },
      // 总条数
      count: {
        zzjg: "",
        bq: "",
        count: ""
      },
      limit: "",
      page: 1,
      //分页组件的数据
      paging: {
        pageSize: 10,
        current: 1,
        total: null
      },
      // 判断是否为第三方 false 为不是 true为是第三方
      is_wx3:false
    };
  },
  components: {
    Maintitle,
    Maincontent,
    Tree,
    Header,
    Comtable
  },
  created() {
    this.tabs.userList.rowSelection = {
      selectedRowKeys: this.Keys,
      // 点击选中用户按钮，获取多选中的用户id，调用函数做处理
      onChange: this.multipleChoice
    };
  },
  mounted() {
    // 获取标签列表
    this.LabelList();
    // 获取部门和人员列表
    this.addList();
    // 获取角色信息列表
    this.roleList();
    if (this.$route.query.id) {
      this.role.roleid = Number(this.$route.query.id);
      this.role.roletext = Number(this.$route.query.id);
      this.addUsersLiset();
    }
  },
  computed: {
    // 配合watch监听
    gets() {
      return this.Keys;
    },
    // 获取权限
    jurisdiction() {
      return this.$store.state.jurisdiction[8];
    },
    HeaderTitle() {
      let _title = "";
      if (this.datas?.addListZz?.tree?.title != undefined) {
        _title = this.datas?.addListZz?.tree?.title;
      }
      return _title;
    }
  },
  watch: {
    // 监听this.Keys数据变化
    gets(v) {
      this.tabs.userList.rowSelection.selectedRowKeys = v;
    }
  },
  methods: {
    // 新增角色,跳转到新增角色页面
    onNewlyAdded() {
      this.$router.push({
        path: "/roleset",
        query: {
          id: 1
        }
      });
    },
    // 分页时间
    rowClick(record) {
      this.limit = record.pageSize;
      this.page = record.current;
      if (
        (this.role.roleid != undefined && this.role.roleid != "") ||
        this.keyword != ""
      ) {
        this.addUsersLiset();
      } else if (this.tabs.offOnNum == 1) {
        this.addList();
      } else {
        this.LabelList();
      }
    },
    // 权限判断
    powers(text) {
      return this.jurisdiction.includes(text);
    },
    // 打开Secret通讯录指导弹窗
    onSecret() {
      this.secret.visible = true;
    },
    // 关闭Secret通讯录指导弹窗
    onSecretgb() {
      this.secret.visible = false;
    },
    // 打开编辑弹窗
    showModal() {
      this.popup.inputTexts = [];
      this.popup.visible = true;
    },
    // 关闭同步组织架构弹窗和编辑弹窗
    handleCancel() {
      this.modal.visible = false;
      this.popup.visible = false;
    },
    // 点击弹窗确定按钮事件
    handleOk() {
      if (this.popup.inputTexts.length > 0) {
        this.onSetUser();
      } else {
        this.$message.error("角色不能为空");
      }
    },
    // 弹窗里选择角色身份的id
    selectId(key) {
      this.popup.inputId = String(key);
    },
    // 点击组织架构列表事件
    treeClick(key) {
      // 刷新数据，所有搜索条件数据归零
      this.onEliminate();
      this.treeClickid = key.join();
      this.keyword = "";
      if (this.tabs.offOnNum == 1) {
        this.role.roleid = "";
        this.role.roletext = undefined;
        this.addList();
      } else {
        this.LabelList();
      }
    },
    // 选择组织架构或者标签
    onRadioBtn(key) {
      // 刷新数据，所有搜索条件数据归零
      this.onEliminate();
      this.treeClickid = "";
      this.keyword = "";
      this.role.roleid = "";
      this.keyword = "";
      this.role.roletext = undefined;
      this.tabs.offOnNum = key.target.value;
      if (key.target.value == 1) {
        this.tabs.children = [];
        this.tabs.children.push(this.datas.addListZz.tree);
        this.tabs.userList.data = this.datas.addListZz.members;
        this.paging.total = this.count.zzjg;
      } else {
        this.tabs.children = this.datas.LabelDatas.tags;
        this.tabs.userList.data = this.datas.LabelDatas.user;
        this.paging.total = this.count.bq;
      }
    },
    // 选择角色条件
    handleChange(key) {
      this.role.roleid = key;
    },
    onTables(){
     this.disabled = true
    },
    // 点击一行的编辑角色事件
    compile(info) {
      if (info.role_name != null) {
        let _ids = [];
        let _texts = info.role_name.split(";");
        for (let i = 0; i < _texts.length; i++) {
          for (let j = 0; j < this.role.roleLists.length; j++) {
            if (this.role.roleLists[j].role_name == _texts[i]) {
              _ids.push(this.role.roleLists[j].id);
            }
          }
        }
        this.popup.inputId = _ids.join(",");
        this.popup.inputTexts = _ids;
      } else {
        this.popup.inputTexts = [];
      }
      this.popup.id = info.userid;
      this.popup.inputText = info.name;
      this.popup.visible = true;
    },
    // 点击同步组织架构弹窗确定按钮
    uploadOk() {
      let _this = this;
      if (_this.onOff) {
        _this.onOff = false;
        this.modal.visible = false;
        let info = setTimeout(() => {
          _this.onOff = true;
          _this.$message.error("同步组织架构失败");
        }, 10000);
        OrganiZational({ link_secret: _this.modal.kwd }).then(res => {
          clearTimeout(info);
          _this.onOff = true;
          _this.modal.visible = false;
          // 获取部门和人员列表
          this.addList();
          // 获取角色信息列表
          this.roleList();
          // 获取标签列表
          this.LabelList();
        });
      }
    },
    // 每次调用刷新数据
    onEliminate() {
      this.paging.pageSize = 10;
      this.paging.current = 1;
      this.limit = 10;
      this.page = 1;
    },
    // 点击同步组织架构按钮
    async onSynchro() {
      let { data } = await GetSecret();
      if(data.is_wx3){
        this.is_wx3 = true
        this.modal.kwd = data.link_secret
      }
      this.modal.visible = true;
    },
    // 对多选选中的角色做处理
    multipleChoice(key, info) {
      if (key.length > 1) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
      let text = [];
      let id = [];
      for (let i = 0; i < info.length; i++) {
        text.push(info[i].name);
        id.push(info[i].userid);
      }
      this.Keys = key;
      this.popup.inputText = text.join(",");
      this.popup.id = id.join(",");
    },
    // 获取组织架构列表信息
    addList() {
      OrganiZationalList({
        dept_id: this.treeClickid,
        page: this.page,
        limit: this.limit,
        type: 1
      }).then(data => {
        this.count.zzjg = data.data.count;
        this.paging.total = this.count.zzjg;
        if (this.addListnum < 2) {
          this.datas.addListZz = data.data;
          this.tabs.children.push(this.datas.addListZz.tree);
          if (!this.$route.query.id) {
            this.tabs.userList.data = this.datas.addListZz.members;
          }
        } else {
          this.tabs.userList.data = data.data.members;
        }
        this.Keys = [];
        this.addListnum += 1;
      });
    },
    // 获取角色信息列表
    roleList() {
      obtainRole({ limit: 200 }).then(data => {
        this.role.roleLists = data.data.datas;
        if (this.$route.query.id) {
          this.role.roletext = Number(this.$route.query.id);
        }
      });
    },
    // 修改角色信息函数
    onSetUser() {
      SetUser({ user_ids: this.popup.id, role_ids: this.popup.inputId }).then(
        data => {
          this.popup.id = "";
          this.popup.inputId = "";
          this.popup.inputTexts = [];
          this.popup.visible = false;
          this.popup.visible = false;
          this.popup.inputText = "";
          if (this.tabs.offOnNum == 1) {
            this.addList();
          } else {
            this.LabelList();
          }
        }
      );
    },
    // 根据关键词和角色身份搜索用户
    addUsersLiset(num) {
      if (num == 1) {
        // 刷新数据，所有搜索条件数据归零
        this.onEliminate();
      }
      if (this.tabs.offOnNum == 1) {
        getUsersByRoleOrKwd({
          role_id: this.role.roleid,
          kwd: this.keyword,
          page: this.page
        }).then(data => {
          this.paging.total = data.count;
          this.Keys = [];
          this.tabs.userList.data = data.data;
        });
      } else {
        this.LabelList();
      }
    },
    // 获取标签列表
    LabelList() {
      addLabelList({
        tagid: this.treeClickid,
        kwd: this.keyword,
        page: this.page,
        limit: this.limit
      }).then(data => {
        this.count.bq = data.data.count;
        if (this.addListnum < 2) {
          this.datas.LabelDatas = data.data;
        } else {
          this.tabs.userList.data = data.data.user;
        }
        this.Keys = [];
        this.addListnum += 1;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.maincontent-newly-added {
  margin: 0 20px;
}
/deep/.maincontent-modal {
  width: 800px !important;
  .ant-carousel .slick-list .slick-slide.slick-active {
    height: 400px !important;
  }
}
/deep/ .ant-tree li .ant-tree-node-content-wrapper {
  padding-left: 0px;
}
.organizational-popup-red {
  line-height: 32px;
  color: red;
}
.organizational-popup-left {
  line-height: 32px;
  margin-left: 6px;
}
.organizational-popup-input {
  margin-left: 15px;
}
.organizational-bott-box {
  margin: 40px 0px 30px;
}
.upload-title {
  margin-bottom: 16px;
  .upload-title-left {
    font-size: 18px;
    color: #333333;
  }
  .upload-title-right {
    font-size: 14px;
    color: #0078f0;
  }
}
.upload-bott-text {
  margin-top: 16px;
  font-size: 14px;
  color: #606366;
}
.maincontent {
  background-color: transparent;
  padding: 0;
  display: flex;
  justify-content: space-between;
  .maincontent-box {
    background: white;
    .organizational-box {
      letter-spacing: 2px;
      .organizational-box-num {
        color: #0082ef;
      }
    }
    .organizational-batch-edit {
      margin-left: 15px;
    }
  }
  .maincontent-left {
    background: white;
    width: 260px;
    .maincontent-left-pd {
      margin: 10px 20px 0px;
    }
    .ant-radio-group {
      display: flex;
      .ant-radio-button-wrapper {
        flex: 1;
        padding: 9px 0;
        line-height: 1.2;
        text-align: center;
        height: auto;
      }
      .ant-radio-button-wrapper-checked {
        color: #0082ef;
        background-color: #e6f1fc;
        border-color: #a3d0fd;
      }
    }
  }
  .maincontent-right {
    width: 1009px;
    background: white;
    padding: 20px 20px 0px;
  }
}
/deep/.ant-carousel .slick-slide {
  text-align: center;
  height: 160px;
  line-height: 160px;
  overflow: hidden;
}

/deep/.ant-carousel .custom-slick-arrow {
  width: 40px;
  height: 40px;
  font-size: 35px;
  color: #606366;
  opacity: 0.8;
  position: absolute;
  top: 40%;
}
/deep/.ant-carousel .custom-slick-arrow:before {
  display: none;
}
/deep/.ant-carousel .custom-slick-arrow:hover {
  opacity: 0.5;
}

/deep/.ant-carousel .slick-slide h3 {
  color: #fff;
}
.otationbox {
  height: 100%;
  width: 100% !important;
  .Rotationimgs {
    height: 300px;
    width: 80%;
    margin: 0 auto;
  }
  .Rotationtoptext {
    color: #333333;
    font-size: 24px;
    text-align: left;
    margin: 10px 0px 0px;
    padding-left: 18px;
  }
  .Rotationbottext {
    color: #333333;
    font-size: 14px;
    text-align: left;
    padding-left: 18px;
  }
}
/deep/.ant-carousel .slick-dots li.slick-active button {
  background: #333333;
}
/deep/ .ant-carousel .slick-dots li button {
  background: #7d7d7d;
}
/deep/ .ant-carousel .slick-list .slick-slide.slick-active {
  height: 260px;
}
/deep/.ant-carousel .slick-list .slick-slide.slick-active {
  line-height: 25px;
}
</style>