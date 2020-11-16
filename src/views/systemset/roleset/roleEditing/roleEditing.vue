<template>
  <div class="roleEditing">
    <Maintitle :titleObj="titleObj"
               @go_back="go_back">
      <slot>
        <div class="btn"></div>
      </slot>
    </Maintitle>
    <Maincontent>
      <div class="content">
        <div class="left">
          <div class="title">公司角色</div>
          <ul class="con-list"
              v-if="role_list">
            <li v-for="(item,index) in role_list"
                :key="item.id"
                :class="{active:grade==item.id}"
                @click="change_grade(item.id)">
              <span class="user_name"
                    :title="item.role_name">{{item.role_name}}</span>
              <span class="default"
                    v-if="item.is_system===1">系统默认</span>
              <p class="icon"
                 v-else>
                <!-- 编辑 -->
                <a-icon type="edit"
                        @click.stop="change_user(item.id,index)" />
                <!-- 删除 -->
                <a-icon type="delete"
                        @click.stop="delete_users(item.id)" />
              </p>
            </li>
            <a-modal v-model="visible_change"
                     cancelText="取消"
                     okText="确定"
                     title="修改角色名称"
                     @cancel="form2.name=''"
                     @ok="change_ok">
              <a-form-model ref="ruleForm"
                            :model="form2"
                            :rules="rules2">
                <a-form-model-item ref="name"
                                   label="角色名称"
                                   prop="name">
                  <a-input placeholder="请输入名称，最长30字符"
                           v-model="form2.name"
                           :maxLength="30" />
                </a-form-model-item>
              </a-form-model>
            </a-modal>
          </ul>
        </div>
        <div class="right">
          <div class="add-user">
            <span>{{role_name}} 设置</span>
            <a-button type="primary"
                      @click="addUsers">添加角色</a-button>
          </div>
          <div class="operations">
            <a-tabs v-model="tab">
              <a-tab-pane :key="1"
                          tab="操作权限">
                <Operation :grade="grade"
                           :operation="operation" />
              </a-tab-pane>
              <a-tab-pane :key="2"
                          tab="数据权限"
                          force-render>
                <DataJurisdiction :grade="grade"
                                  @data_node_ids="data_change"
                                  :dataJurisdiction="dataJurisdiction" />
              </a-tab-pane>
            </a-tabs>
          </div>
          <a-modal v-model="visible"
                   cancelText="取消"
                   okText="确定"
                   title="添加角色名称"
                   @cancel="form.name=''"
                   @ok="add_ok">
            <a-form-model ref="ruleForm"
                          :model="form"
                          :rules="rules">
              <a-form-model-item ref="name"
                                 label="角色名称"
                                 prop="name">
                <a-input placeholder="请输入名称，最长30字符"
                         v-model="form.name" />
              </a-form-model-item>
            </a-form-model>
          </a-modal>
        </div>
        <a-affix :offset-bottom="bottom">
          <div class="roleset-bottbox flex-col">
            <div class="flex-col-bd"></div>
            <a-button type="primary"
                      @click="operation_change">保存</a-button>
          </div>
        </a-affix>
      </div>
    </Maincontent>
  </div>
</template>

<script>
import Maintitle from '@/views/components/maintitle.vue'
import Maincontent from '@/views/components/maincontent.vue'
import Operation from '@/views/systemset/roleset/roleEditing/components/operation.vue'
import DataJurisdiction from '@/views/systemset/roleset/roleEditing/components/dataJurisdiction.vue'
import {
  update_role,
  get_roloe_name,
  delete_role,
  add_role,
  update_role_oper,
  update_role_data,
  power_setting_index,
} from '@/api/roleset.js'
export default {
  components: {
    Maintitle,
    Maincontent,
    Operation,
    DataJurisdiction,
  },
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: true, // 返回开关
      },
      //新建模态框状态
      visible: false,
      //修改权限名名模态框
      visible_change: false,

      //修改角色名称的id
      role_id: null,

      //用户角色切换
      grade: null,

      //左侧角色列表
      role_list: null,

      //右侧操作权限
      operation: {
        obj: null,
        ids: [],
      },
      //右侧数据权限
      dataJurisdiction: null,
      //判断右侧是哪一个权限页面
      tab: 1,
      //操作权限数据
      operation_ids: null,
      //数据权限
      data_ids: null,
      //添加角色
      new_user: '',
      disabled_flag: true,
      role_name: '', //当前角色名称
      rules: {
        name: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 30,
            message: '请输入不超过30个字符',
            trigger: ['change', 'blur'],
          },
        ],
      },
      rules2: {
        name: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 15,
            message: '请输入不超过15个字符',
            trigger: ['change', 'blur'],
          },
        ],
      },
      form: {
        name: '',
      },
      //修改权限名文本框的内容
      form2: {
        name: '',
      },
      bottom: 0,
    }
  },
  methods: {
    //获取数据
    async get_auth() {
      if (this.grade) {
        let { code, msg, data } = await power_setting_index({
          role_id: this.grade,
        })
        this.role_list = data.role
        this.operation.obj = data.auth
        this.dataJurisdiction = data.data_auth
        this.data_ids = data.data_auth
        this.role_list.forEach((item, index) => {
          this.role_name =
            item.id == this.grade ? item.role_name : this.role_name
        })
      }
    },
    //确认修改
    async update_ok() {
      this.disabled_flag = false
      await update_role_oper({
        role_id: parseInt(this.grade),
        node_ids: this.operation.ids.join(),
      })

      await update_role_data({
        role_id: this.grade,
        data_auth: this.data_ids,
      })
      this.get_auth()

      setTimeout(() => {
        this.disabled_flag = true
      }, 3000)
    },

    //操作权限改变
    operation_change() {
      this.update_ok()
    },
    //数据权限改变
    data_change(val) {
      this.data_ids = val
    },

    //公司角色切换
    change_grade(val) {
      //设置重复点和点击超级管理员(系统默认)
      if (val == this.grade) {
        return
      }
      this.grade = val
      this.get_auth()
    },

    //左侧点击编辑
    change_user(id, index) {
      this.visible_change = true
      this.form2.name = this.role_list[index].role_name
      this.role_id = id
    },

    //确认添加
    async add_ok() {
      if (this.form.name.length < 16 && this.form.name.length != 0) {
        let { code } = await add_role({ role_name: this.form.name })
        if (code === 1) {
          this.get_auth()
          this.form.name = ''
          this.visible = false
        }
      }
    },

    //修改权限名确认
    async change_ok() {
      this.visible_change = false
      if (this.role_id) {
        let { code, msg } = await update_role({
          id: this.role_id,
          role_name: this.form2.name,
        })
        if (code === 1) {
          this.role_id = null
          this.form2.name = ''
          this.get_auth()
        }
      }
    },
    //删除权限角色
    delete_users(id) {
      let _this = this
      this.$confirm({
        icon: 'info-circle',
        title: '提示',
        content: '是否删除权限角色？',
        okText: '确认',
        cancelText: '取消',
        onOk: async function () {
          let dt = await delete_role({ id })
          _this.visible = false
          if (dt.code == 1) {
            _this.role_id = 1
            if (id == _this.$route.query.id) {
              _this.$router.go(-1)
            } else {
              _this.grade = _this.$route.query.id || null
              _this.get_auth()
            }
          }
        },
        onCancel() {},
      })
    },

    //新建
    addUsers() {
      this.visible = true
    },

    //返回
    go_back() {
      this.$router.go(-1)
    },
  },
  created() {
    this.grade = this.$route.query.id || null
    this.get_auth()
  },
}
</script>

<style lang="less" scoped>
/deep/.ant-modal-header {
  border-bottom: 0px solid #ccc;
}
/deep/.ant-modal-footer {
  border-top: 0px solid #ccc;
}
.roleEditing {
  .maintitle {
    .btn {
      button {
        margin-right: 20px;
      }
    }
  }
  .maincontent {
    padding: 0 0;
    .content {
      display: flex;
      background: rgba(247, 247, 247, 1);
      flex-wrap: wrap;
      .roleset-bottbox {
        height: 60px;
        width: 1280px;
        margin-top: 15px;
        background: #ffffff;
        padding: 0 20px;
        box-shadow: 0 0 10px rgba(00, 00, 00, 0.1);
      }
      /deep/.ant-pagination {
        text-align: right;
      }
      .left {
        width: 290px;
        background: rgba(255, 255, 255, 1);
        padding: 20px 0;
        z-index: 1;
        .title {
          width: 280px;
          height: 56px;
          padding-left: 20px;
          line-height: 56px;
          font-weight: bold;
          font-size: 16px;
        }
        .con-list {
          width: 100%;
          height: calc(100% - 40px);
          overflow-y: scroll;
          li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 280px;
            height: 56px;
            cursor: pointer;
            line-height: 56px;
            padding-left: 40px;
            padding-right: 10px;
            color: #303133ff;
            transition: all 0.3s;
            border-right: 2px solid transparent;

            .user_name {
              width: 140px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .default {
              color: #c0c4ccff;
            }
            .icon {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin: 0;
              width: 60px;
              i {
                width: 30px;
                height: 30px;
                line-height: 30px;
              }
            }
          }
          .active {
            background: rgba(229, 242, 254, 1);
            color: #0082efff;
            border-right: 2px solid #0082efff;
          }
        }
      }
      .right {
        width: 980px;
        margin-left: 10px;
        .add-user {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          width: 990px;
          height: 60px;
          background: rgba(255, 255, 255, 1);
          span {
            font-size: 18px;
          }
        }
        .operations {
          height: calc(100% - 75px);
          padding: 0 20px;
          background: rgba(255, 255, 255, 1);
          margin-top: 15px;
          /deep/.ant-tabs-tab {
            font-size: 16px;
          }
        }
      }
    }
  }
}

.ant-spin-nested-loading {
  height: 100%;
  width: 100%;
}
/deep/ .ant-form {
  width: 100%;
  .ant-row {
    display: flex;
    margin-bottom: 0;
    .ant-form-item-label {
      flex: 0 0 80px !important;
    }
    .ant-form-item-control-wrapper {
      flex: 1;
    }
  }
}
</style>